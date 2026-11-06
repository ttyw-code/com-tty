import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

/**
 * 程序化机械键盘（60% ANSI 布局，62 键）
 *
 * 不用任何模型/贴图资源：
 * - 键帽 = RoundedBoxGeometry + 纯色材质
 * - 字符 = canvas 画出来的透明贴图，贴在键帽顶面的一张平面上
 * - 壳体 = 一个大圆角盒 + 一圈内凹的定位板
 *
 * 单位是米：1u = 19mm（真实机械键盘键距），整块键盘约 285×95mm。
 */

/** 1u 的实际尺寸 */
const U = 0.019
/** 键帽比 1u 略小一点，留出缝隙 */
const KEY_GAP = 0.0007
/** 键帽高度 */
const KEY_HEIGHT = 0.0085
/** 壳体厚度 */
const CASE_HEIGHT = 0.016

type KeyDef = [label: string, width?: number]

/**
 * 60% ANSI 布局：每行宽度都凑满 15u，
 * 左侧修饰键（Tab 1.5u / Caps 1.75u / Shift 2.25u）逐行变宽，
 * 错落感就自然出来了，不需要额外算偏移
 */
const LAYOUT: KeyDef[][] = [
  [
    ['esc'],
    ['1'],
    ['2'],
    ['3'],
    ['4'],
    ['5'],
    ['6'],
    ['7'],
    ['8'],
    ['9'],
    ['0'],
    ['-'],
    ['='],
    ['⌫', 2],
  ],
  [
    ['tab', 1.5],
    ['q'],
    ['w'],
    ['e'],
    ['r'],
    ['t'],
    ['y'],
    ['u'],
    ['i'],
    ['o'],
    ['p'],
    ['['],
    [']'],
    ['\\', 1.5],
  ],
  [
    ['caps', 1.75],
    ['a'],
    ['s'],
    ['d'],
    ['f'],
    ['g'],
    ['h'],
    ['j'],
    ['k'],
    ['l'],
    [';'],
    ["'"],
    ['enter', 2.25],
  ],
  [
    ['shift', 2.25],
    ['z'],
    ['x'],
    ['c'],
    ['v'],
    ['b'],
    ['n'],
    ['m'],
    [','],
    ['.'],
    ['/'],
    ['shift', 1.75],
    ['fn'],
  ],
  [
    ['ctrl', 1.25],
    ['win', 1.25],
    ['alt', 1.25],
    ['', 6.25],
    ['alt', 1.25],
    ['win', 1.25],
    ['menu', 1.25],
    ['ctrl', 1.25],
  ],
]

/** 一个键帽对象：几何信息 + 动画状态 */
export interface Keycap {
  /** 键帽本体，用于射线拾取 */
  mesh: THREE.Mesh
  /** 字符平面，跟着键帽一起动 */
  legend: THREE.Mesh
  /** 静止时的 y，回弹的基准 */
  restY: number
  /** 字符面静止时的 y（跟着键帽高度走） */
  legendY: number
  /** 0 = 松开，1 = 按到底 */
  press: number
}

export interface KeyboardModel {
  group: THREE.Group
  keycaps: Keycap[]
  /** 每帧推进：按键按下/回弹 + 背光呼吸 */
  update: (elapsed: number, delta: number) => void
  /** 让某个键按一下（点击用） */
  press: (keycap: Keycap) => void
  /** 随机挑一个键按一下（自动打字用） */
  pressRandom: (elapsed: number) => void
}

/** 用 canvas 画一个键帽字符，返回透明贴图 */
function createLegendTexture(label: string): THREE.CanvasTexture {
  const SIZE = 128
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, SIZE, SIZE)
    // 浅色键帽配深色字符，对比才够；键帽若是深色可改成 #e8eef2
    ctx.fillStyle = '#242b32'
    // 长标签（backspace/enter）用无衬线小字，单字符用大一点
    const isLong = label.length > 2
    const fontSize = isLong ? 26 : 48
    ctx.font = `600 ${fontSize}px "SF Pro Text", "Segoe UI", system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label.toUpperCase(), SIZE / 2, SIZE / 2 + 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/**
 * 生成整块键盘
 * @param options.color 键帽颜色（默认浅灰，接近 PBT 灰白配色）
 */
export function createKeyboard(
  options: { color?: string } = {},
): KeyboardModel {
  const keycapColor = options.color ?? '#8e98a3'

  const group = new THREE.Group()
  // 后缘抬高 5°，产品图的经典倾角（也让键帽层次更清楚）
  group.rotation.x = THREE.MathUtils.degToRad(5)
  const keycaps: Keycap[] = []

  const totalWidth = 15 * U
  const totalDepth = LAYOUT.length * U

  // ---- 壳体：底座 + 内凹的定位板 ----
  const caseMesh = new THREE.Mesh(
    new RoundedBoxGeometry(
      totalWidth + 0.012,
      CASE_HEIGHT,
      totalDepth + 0.012,
      4,
      0.004,
    ),
    new THREE.MeshStandardMaterial({
      color: '#22262b',
      roughness: 0.55,
      metalness: 0.35,
    }),
  )
  caseMesh.position.y = -CASE_HEIGHT / 2
  group.add(caseMesh)

  // 定位板比键帽区略大一圈，做出"键帽嵌在壳体里"的层次
  const plate = new THREE.Mesh(
    new RoundedBoxGeometry(
      totalWidth + 0.004,
      0.002,
      totalDepth + 0.004,
      3,
      0.001,
    ),
    new THREE.MeshStandardMaterial({
      color: '#12151a',
      roughness: 0.8,
      metalness: 0.1,
    }),
  )
  plate.position.y = -0.0005
  group.add(plate)

  // ---- 键帽 ----
  // 每种「宽度 + 高度」组合复用同一个几何体，避免 62 个键各建一份
  const geometryCache = new Map<string, THREE.BufferGeometry>()
  const keycapMaterial = new THREE.MeshStandardMaterial({
    color: keycapColor,
    roughness: 0.72,
    metalness: 0.02,
  })

  // 逐行键高：模拟 OEM 高度的球帽弧度，中间两行最矮，上下两端略高
  const ROW_HEIGHT_SCALE = [1, 0.95, 0.9, 0.93, 1]

  const getGeometry = (width: number, height: number) => {
    const key = `${width.toFixed(2)}-${height.toFixed(4)}`
    let geometry = geometryCache.get(key)
    if (!geometry) {
      geometry = new RoundedBoxGeometry(
        width * U - KEY_GAP,
        height,
        U - KEY_GAP,
        3,
        0.0016,
      )
      geometryCache.set(key, geometry)
    }
    return geometry
  }

  LAYOUT.forEach((row, rowIndex) => {
    // 从左上角开始往右排
    let cursor = 0
    const keyHeight = KEY_HEIGHT * ROW_HEIGHT_SCALE[rowIndex]

    row.forEach(([label, width = 1]) => {
      const keyWidth = width * U
      const x = cursor + keyWidth / 2 - totalWidth / 2
      const z = rowIndex * U + U / 2 - totalDepth / 2

      const mesh = new THREE.Mesh(getGeometry(width, keyHeight), keycapMaterial)
      mesh.position.set(x, keyHeight / 2, z)
      mesh.userData.label = label
      group.add(mesh)

      // 字符面：贴在键帽顶面之上 0.1mm，避免 z-fighting
      const legendY = keyHeight + 0.0001
      const legend = new THREE.Mesh(
        new THREE.PlaneGeometry(keyWidth * 0.78, U * 0.78),
        new THREE.MeshBasicMaterial({
          map: createLegendTexture(label),
          transparent: true,
          depthWrite: false,
          opacity: 0.9,
        }),
      )
      legend.rotation.x = -Math.PI / 2
      legend.position.set(x, legendY, z)
      group.add(legend)

      keycaps.push({
        mesh,
        legend,
        restY: keyHeight / 2,
        legendY,
        press: 0,
      })

      cursor += keyWidth
    })
  })

  // ---- 每帧更新 ----
  const update = (elapsed: number, delta: number) => {
    // 背光呼吸：字符亮度做低频正弦，让键面看起来"通电了"
    const glow = 0.82 + Math.sin(elapsed * 1.6) * 0.1

    for (const keycap of keycaps) {
      // 阻尼回弹：press 向 0 收敛，越接近越快
      if (keycap.press > 0) {
        keycap.press = Math.max(0, keycap.press - delta * 5)
      }

      // 按下去 1.6mm，视觉上足够明显又不会穿到定位板
      const offset = keycap.press * 0.0016
      keycap.mesh.position.y = keycap.restY - offset
      keycap.legend.position.y = keycap.legendY - offset

      const material = keycap.legend.material as THREE.MeshBasicMaterial
      material.opacity = glow
    }
  }

  const press = (keycap: Keycap) => {
    keycap.press = 1
  }

  /**
   * 自动打字：一次只按一颗，间隔 90~270ms（约 4~10 字/秒）。
   * 不要每颗键各自计时——62 颗键同时乱按，看着像被猫踩过
   */
  let nextAutoPress = 1.2
  const pressRandom = (elapsed: number) => {
    if (elapsed < nextAutoPress) return

    const keycap = keycaps[Math.floor(Math.random() * keycaps.length)]
    keycap.press = 1
    nextAutoPress = elapsed + 0.09 + Math.random() * 0.18
  }

  return { group, keycaps, update, press, pressRandom }
}
