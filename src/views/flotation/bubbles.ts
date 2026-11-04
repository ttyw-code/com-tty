import * as THREE from 'three'

/**
 * 槽内气泡
 *
 * 全部在 GPU 上算：每帧只更新一个 uTime uniform，CPU 不碰顶点数据。
 * 每颗气泡的"上升循环"由 `mod(时间 × 速度 + 相位, 液面高度)` 得到，
 * 到液面后自动回到槽底重新升，不需要创建/销毁对象。
 *
 * 参数（数量、半径、起止高度）都在创建时一次性写进 BufferAttribute。
 */

export interface BubbleOptions {
  /** 气泡数量，建议 500~1500 */
  count: number
  /** 分布椭圆半径（槽体内部尺寸的一半，留点余量避免贴壁） */
  radiusX: number
  radiusZ: number
  /** 气泡起点：槽底 */
  bottomY: number
  /** 气泡终点：液面 */
  topY: number
}

export interface BubbleField {
  points: THREE.Points
  /**
   * 每帧调用
   * @param elapsed 场景启动以来的秒数
   * @param sizeScale 设备像素高度 / (2·tan(fov/2))，用于把世界尺寸换算成点大小
   */
  update: (elapsed: number, sizeScale: number) => void
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBottom;
  uniform float uTop;
  uniform float uSizeScale;

  attribute float aSeed;   // 0~1 随机相位，让气泡错开
  attribute float aSize;   // 世界尺寸（米）
  attribute float aSpeed;  // 上升速度（米/秒）

  varying float vLife;     // 0 = 槽底，1 = 刚好到液面

  void main() {
    float span = max(uTop - uBottom, 0.001);

    // 关键：取模实现无限循环上升。+ aSeed*span 让每颗气泡起点不同
    float rise = mod(uTime * aSpeed + aSeed * span, span);
    vLife = rise / span;

    vec3 pos = position;
    pos.y = uBottom + rise;

    // 上升途中轻微摆动，越接近液面摆幅越大（模拟湍流）
    float sway = 0.015 + 0.05 * vLife;
    pos.x += sin(uTime * 1.7 + aSeed * 40.0) * sway;
    pos.z += cos(uTime * 1.3 + aSeed * 27.0) * sway;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 透视缩放：远的变小；接近液面时略膨胀（压力降低）
    gl_PointSize =
      aSize * (1.0 + vLife * 0.5) * uSizeScale / max(-mvPosition.z, 0.001);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vLife;

  void main() {
    // 把方形点裁成圆，并做出"亮边 + 透亮内心"的气泡壳
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float rim = smoothstep(0.5, 0.42, dist);
    float core = smoothstep(0.36, 0.0, dist);
    vec3 color = mix(uColor, vec3(1.0), core * 0.5);

    // 刚离开槽底、快要破裂时淡出，避免凭空出现/消失
    float fade =
      smoothstep(0.0, 0.06, vLife) * (1.0 - smoothstep(0.9, 1.0, vLife));

    gl_FragColor = vec4(color, (rim * 0.5 + core * 0.35) * fade * uOpacity);
  }
`

export function createBubbles(options: BubbleOptions): BubbleField {
  const { count, radiusX, radiusZ, bottomY, topY } = options

  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // sqrt 让点在圆面上均匀分布，否则会挤在圆心
    const radius = Math.sqrt(Math.random())
    const angle = Math.random() * Math.PI * 2

    positions[i * 3] = Math.cos(angle) * radius * radiusX
    // y 在顶点着色器里按时间重算，这里只是占位
    positions[i * 3 + 1] = bottomY
    positions[i * 3 + 2] = Math.sin(angle) * radius * radiusZ

    seeds[i] = Math.random()
    // 直径 1~2.6cm：真实气泡只有 1~3mm，那个尺寸在屏幕上不足 1px，
    // 这里按"看得见"的需求放大，靠数量补真实感
    sizes[i] = 0.01 + Math.random() * 0.016
    speeds[i] = 0.12 + Math.random() * 0.23
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  // 顶点着色器会改 y，包围球按初始值算会被错误剔除，直接关掉视锥裁剪判断
  geometry.boundingSphere = new THREE.Sphere(
    new THREE.Vector3(0, (bottomY + topY) / 2, 0),
    Math.max(radiusX, radiusZ, (topY - bottomY) / 2) * 1.5,
  )

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uBottom: { value: bottomY },
      uTop: { value: topY },
      uSizeScale: { value: 600 },
      uColor: { value: new THREE.Color('#cfeff2') },
      uOpacity: { value: 0.85 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    // 加色混合：暗色矿浆里气泡会有轻微自发光感，比普通混合更像气泡
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const points = new THREE.Points(geometry, material)
  // 排在液面之后（液面 renderOrder = 1），先画水再画气泡，气泡才会"在水里"
  points.renderOrder = 2
  points.frustumCulled = false

  return {
    points,
    update: (elapsed, sizeScale) => {
      material.uniforms.uTime.value = elapsed
      material.uniforms.uSizeScale.value = sizeScale
    },
  }
}
