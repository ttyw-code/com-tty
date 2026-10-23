import * as THREE from 'three'

/**
 * 全站 3D 场景的公共材质。
 *
 * Material 在 three.js 里可以被多个 Mesh 复用，复用的收益：
 * 1. renderer 只编译一份 shader program；
 * 2. 同材质的连续绘制能减少状态切换；
 * 3. 改一处参数，全场景同步。
 *
 * ⚠️ 共享材质**不要随单个 Mesh 一起 dispose**：它被多个 Mesh 引用，
 * 释放其中一个会把材质从所有 Mesh 上抽走。统一等页面卸载、
 * 由 useThree 的 disposeScene 递归释放即可。
 */

/** 场景统一配色，改这里即可整体换色 */
export const SCENE_COLORS = {
  /** CSG 主体（参与布尔运算的立方体） */
  csgBox: 0x2f54eb,
  /** 被减 / 并 / 交的球体 */
  csgSphere: 0xffbb55,
  /** 原始包围盒高亮 */
  highlight: 0x8a9fff,
  /** 参考网格线条 */
  grid: 0x8a93a5,
} as const

/** CSG 立方体：弱金属、哑光，切口和明暗过渡看得清 */
export const csgBoxMaterial = new THREE.MeshStandardMaterial({
  color: SCENE_COLORS.csgBox,
  metalness: 0.2,
  roughness: 0.5,
})

/** CSG 球体：与立方体区分色相 */
export const csgSphereMaterial = new THREE.MeshStandardMaterial({
  color: SCENE_COLORS.csgSphere,
  metalness: 0.2,
  roughness: 0.5,
})

/** 原始包围盒的高亮材质，比主体更亮更光滑一点 */
export const highlightMaterial = new THREE.MeshStandardMaterial({
  color: SCENE_COLORS.highlight,
  metalness: 0.1,
  roughness: 0.4,
})

/**
 * 通用默认材质：白色哑光。
 * 给 STL / PLY / VTK 这类本身不含材质信息的几何体兜底。
 */
export const defaultMaterial = new THREE.MeshStandardMaterial()

/* ------------------------------------------------------------------ *
 * 外部模型材质（车辆）
 *
 * OBJ 只带几何、不带材质，但导出时通常保留了**材质槽名**（挂在 mesh.name 上），
 * 例如 R8 的 "body color" / "chrome" / "tyre" / "black matt" / "glass window"。
 * 用 getCarMaterial(name) 按名字挑材质，比一律套白色哑光有质感得多。
 *
 * ⚠️ 金属与玻璃的观感高度依赖**环境反射**：只给平行光时，
 * metalness 越高的材质越接近纯黑。使用时务必同时设置 scene.environment
 * （见 small3d 里的 PMREMGenerator + RoomEnvironment）。
 * ------------------------------------------------------------------ */

export const carMaterials = {
  /** 车漆：物理材质 + 清漆层，漆面高光更接近真车 */
  body: new THREE.MeshPhysicalMaterial({
    color: 0xb3121a,
    metalness: 0.55,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  }),
  /** 车身金属件 */
  metal: new THREE.MeshStandardMaterial({
    color: 0x9aa1a8,
    metalness: 0.9,
    roughness: 0.32,
  }),
  /** 镀铬：接近镜面 */
  chrome: new THREE.MeshStandardMaterial({
    color: 0xf2f4f6,
    metalness: 1,
    roughness: 0.06,
  }),
  /** 铝制部件：比铬稍糙 */
  aluminium: new THREE.MeshStandardMaterial({
    color: 0xb9bec4,
    metalness: 0.85,
    roughness: 0.38,
  }),
  /** 轮胎：纯橡胶，粗糙无金属 */
  tyre: new THREE.MeshStandardMaterial({
    color: 0x0b0b0c,
    metalness: 0,
    roughness: 0.92,
  }),
  /** 轮毂 */
  rim: new THREE.MeshStandardMaterial({
    color: 0x8d9298,
    metalness: 0.95,
    roughness: 0.22,
  }),
  /** 亮黑：保险杠、饰件 */
  gloss: new THREE.MeshStandardMaterial({
    color: 0x08090a,
    metalness: 0.35,
    roughness: 0.12,
  }),
  /** 哑黑：进气口、底盘件 */
  matt: new THREE.MeshStandardMaterial({
    color: 0x0d0e0f,
    metalness: 0,
    roughness: 0.95,
  }),
  /** 车窗玻璃：半透明 + 低粗糙，靠环境反射出窗面高光 */
  glass: new THREE.MeshPhysicalMaterial({
    color: 0x9fc4e0,
    metalness: 0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.42,
    ior: 1.5,
    depthWrite: false,
  }),
  /** 尾灯：自发光一点，才有"灯亮着"的感觉 */
  tailLight: new THREE.MeshStandardMaterial({
    color: 0xff2b2b,
    metalness: 0.2,
    roughness: 0.25,
    emissive: 0xff2b2b,
    emissiveIntensity: 0.6,
  }),
  /** 前灯 / 灯罩 */
  light: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    emissive: 0xffffff,
    emissiveIntensity: 0.8,
  }),
  /** 内饰、饰条 */
  interior: new THREE.MeshStandardMaterial({
    color: 0x2b2c2e,
    metalness: 0.1,
    roughness: 0.85,
  }),
  /** 格栅 */
  grille: new THREE.MeshStandardMaterial({
    color: 0x121314,
    metalness: 0.6,
    roughness: 0.5,
  }),
  /** 车标 */
  logo: new THREE.MeshStandardMaterial({
    color: 0xd01020,
    metalness: 0.5,
    roughness: 0.3,
  }),
}

/**
 * 名字 → 材质的匹配规则。
 * 顺序有意义：`glass lamp` 必须先于 `glass`，否则灯罩会被当成车窗玻璃。
 */
const carMaterialRules: Array<[RegExp, THREE.Material]> = [
  [/^body\s*colou?r/i, carMaterials.body],
  [/^chrome/i, carMaterials.chrome],
  [/^(aluminium|aluminum)/i, carMaterials.aluminium],
  [/^metal/i, carMaterials.metal],
  [/^tyre|^tire/i, carMaterials.tyre],
  [/^rims?/i, carMaterials.rim],
  [/^black\s*gloss/i, carMaterials.gloss],
  [/^black\s*matt?/i, carMaterials.matt],
  [/^glass\s*(lamp|projector)/i, carMaterials.light],
  [/^glass/i, carMaterials.glass],
  [/^tail\s*light/i, carMaterials.tailLight],
  [/^light/i, carMaterials.light],
  [/^grille/i, carMaterials.grille],
  [/^logo/i, carMaterials.logo],
  [/^(interior|trim)/i, carMaterials.interior],
]

/** 按 mesh 名字挑车模材质；匹配不上时退回 defaultMaterial */
export function getCarMaterial(name: string): THREE.Material {
  const key = name.trim()
  const hit = carMaterialRules.find(([pattern]) => pattern.test(key))
  return hit ? hit[1] : defaultMaterial
}

/**
 * 参考网格材质：程序化网格纹理 + 透明平面。
 *
 * 用纹理而不是 GridHelper 的线条，是为了让**远处能真正模糊** ——
 * 线条宽度在多数平台不生效（WebGL 限制），远处永远是 1px 锐利细线；
 * 纹理则会由 mipmap 自动降采样，远处自然糊成柔和一片。
 *
 * @param size 平面边长（世界单位）
 * @param options.cell 每格的世界单位长度，默认 1
 * @param options.opacity 线条不透明度，默认 0.32
 */
export function createGridMaterial(
  size: number,
  options: { cell?: number; opacity?: number } = {},
): THREE.MeshBasicMaterial {
  const { cell = 1, opacity = 0.32 } = options
  const CELL_PX = 64

  const canvas = document.createElement('canvas')
  canvas.width = CELL_PX
  canvas.height = CELL_PX

  const ctx = canvas.getContext('2d')
  if (ctx) {
    // 只画左、上两条边，平铺后相邻单元的边正好接上
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(1, 0)
    ctx.lineTo(1, CELL_PX)
    ctx.moveTo(0, 1)
    ctx.lineTo(CELL_PX, 1)
    ctx.stroke()
  }

  const map = new THREE.CanvasTexture(canvas)
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.repeat.set(size / cell, size / cell)
  // 斜视（远处向地平线收敛）时保留细节，避免糊得太早
  map.anisotropy = 8

  return new THREE.MeshBasicMaterial({
    map,
    color: SCENE_COLORS.grid,
    transparent: true,
    opacity,
    // 半透明面不写深度，避免和它上面的物体产生深度冲突
    depthWrite: false,
  })
}

/**
 * 逐帧动画用的 shader 材质。
 * shader 源码与 uniforms 由调用方提供，避免这里反向依赖具体页面。
 */
export function createAnimatedShaderMaterial(
  vertexShader: string,
  fragmentShader: string,
  uniforms: Record<string, THREE.IUniform>,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
}
