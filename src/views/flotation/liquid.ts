import * as THREE from 'three'

/**
 * 槽内液面
 *
 * 模型自带的 `槽内液面` 节点位置/尺寸就是真实液位，这里只替换材质，
 * 不重建几何体 —— 液面高度以后要改，改模型的这个节点即可。
 *
 * 视觉由三部分叠出来（都靠时间驱动，没有贴图资源）：
 * 1. 两层不同速度/方向滚动的 fbm 噪声 → 表面在缓慢流动
 * 2. 深浅两色按噪声混合 → 有起伏感，不是一块死板的半透明板
 * 3. Fresnel：掠射角时更亮 → 从侧面看能看到水面的反光边
 */

/** 顶点：只做标准变换，把世界坐标传给片元（噪声按世界坐标算，不受节点缩放影响） */
const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

/** 片元：双层滚动噪声 + 深浅混色 + Fresnel 边缘光 */
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform float uOpacity;

  varying vec3 vWorldPos;

  // 值噪声：哈希四个格点再双线性插值。比 simplex 短，做水面够用
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    // smoothstep 插值，避免格点处出现方格棱
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // 3 层 fbm：低频决定大的明暗块，高频负责细碎波纹
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    // 用世界坐标的 XZ 算噪声：液面节点有非等比缩放，用 uv 会把噪声拉变形
    vec2 p = vWorldPos.xz * 1.6;

    // 两层反向滚动，叠加后不会看出重复周期
    float layerA = fbm(p + vec2(uTime * 0.035, uTime * 0.012));
    float layerB = fbm(p * 1.9 - vec2(uTime * 0.02, uTime * 0.03));
    float waves = layerA * 0.65 + layerB * 0.35;

    vec3 color = mix(uDeepColor, uShallowColor, smoothstep(0.3, 0.78, waves));

    // Fresnel：视线越贴近水面越亮，模拟水面的反射
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - clamp(viewDir.y, 0.0, 1.0), 2.0);
    color += uShallowColor * fresnel * 0.6;

    // 噪声本身也带一点透明度起伏，看起来更"水"而不是塑料
    float alpha = uOpacity + waves * 0.15 + fresnel * 0.25;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`

export interface LiquidSurface {
  material: THREE.ShaderMaterial
  /** 每帧调用：推进噪声滚动 */
  update: (elapsed: number) => void
}

/**
 * 把液面节点的材质换成流动材质
 * @param mesh 模型里的 `槽内液面` 节点
 */
export function createLiquidSurface(mesh: THREE.Mesh): LiquidSurface {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      // 浮选矿浆偏青灰，不是纯蓝的自来水
      uDeepColor: { value: new THREE.Color('#08181d') },
      uShallowColor: { value: new THREE.Color('#2f7f86') },
      uOpacity: { value: 0.62 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    // 关掉深度写入：液面是半透明的，写入深度会把下面的气泡挡掉
    depthWrite: false,
    // 平面法线朝上，但相机从低角度时可能看到背面，双面更保险
    side: THREE.DoubleSide,
  })

  mesh.material = material
  // 半透明层排在气泡前面渲染，气泡才会被液面"盖住"一部分
  mesh.renderOrder = 1

  return {
    material,
    update: (elapsed) => {
      material.uniforms.uTime.value = elapsed
    },
  }
}
