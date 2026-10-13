import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  toValue,
  type MaybeRefOrGetter,
} from 'vue'

/**
 * 初始化配置，**不是响应式的**。
 * 多数字段只在创建场景时读取一次；renderOnDemand / pauseWhenHidden /
 * axesViewport / onResize / onContextLost 会在运行时读取，直接改原对象字段即可生效。
 */
export interface UseThreeOptions {
  /** 背景色；传 null 保持透明，由容器 CSS 决定底色 */
  bgColor?: string | number | null
  antialias?: boolean
  alpha?: boolean
  /** 设备像素比上限，默认 min(devicePixelRatio, 2) */
  maxDpr?: number
  /** 相机类型，默认 perspective；正交（orthographic）适合 2D 图表、工程视图、等轴测视图 */
  cameraType?: 'perspective' | 'orthographic'
  /** 透视相机的垂直视场角，默认 75。正交相机忽略此项 */
  fov?: number
  /** 正交相机垂直方向可见的世界高度，默认 10（越大视野越广）。透视相机忽略此项 */
  frustumSize?: number
  near?: number
  far?: number
  cameraPosition?: { x?: number; y?: number; z?: number }
  /** 轨道控制器，传 false 关闭（纯展示场景） */
  controls?: boolean
  showAxes?: boolean
  axesSize?: number
  axesViewport?: {
    size?: number
    margin?: number
    corner?: 'lt' | 'rt' | 'lb' | 'rb'
  }
  /** 按需渲染：仅在相机/场景被标记变化时绘制，默认每帧渲染 */
  renderOnDemand?: boolean
  /** 页面不可见时自动暂停渲染，默认 true */
  pauseWhenHidden?: boolean
  autoStart?: boolean
  /** 初始化完成回调，参数保证非空，替代外部 watch(() => scene.value) */
  onInit?: (ctx: ThreeContext) => void
  onResize?: (size: { width: number; height: number }) => void
  onContextLost?: () => void
}

/** 场景相机：由 cameraType 决定是透视还是正交 */
export type SceneCamera = THREE.PerspectiveCamera | THREE.OrthographicCamera

export interface ThreeContext {
  scene: THREE.Scene
  camera: SceneCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls | null
}

export interface FrameContext extends ThreeContext {
  /** 距上一帧的秒数 */
  delta: number
  /** 自启动以来的秒数 */
  elapsed: number
}

export type FrameCallback = (ctx: FrameContext) => void

const DEFAULT_FRUSTUM_SIZE = 10
const AXES_HELPER_SIZE = 5
const AXES_VIEWPORT_SIZE = 100
const AXES_VIEWPORT_MARGIN = 10

export function useThree(
  containerRef: MaybeRefOrGetter<HTMLElement | null>,
  options: UseThreeOptions = {},
) {
  const scene = shallowRef<THREE.Scene | null>(null)
  const camera = shallowRef<SceneCamera | null>(null)
  const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
  const controls = shallowRef<OrbitControls | null>(null)

  const axesScene = shallowRef<THREE.Scene | null>(null)
  const axesCamera = shallowRef<THREE.PerspectiveCamera | null>(null)

  /** 容器 CSS 尺寸，射线拾取等场景可直接复用 */
  const size = ref({ width: 0, height: 0 })
  const isReady = ref(false)

  let resizeObserver: ResizeObserver | null = null
  let resizeRaf = 0
  let disposed = false
  let started = false
  let suspendedByKeepAlive = false
  let dirty = true

  let lastTime = 0
  let elapsed = 0

  const frameCallbacks = new Set<FrameCallback>()
  const readyCallbacks = new Set<(ctx: ThreeContext) => void>()

  /** 注册逐帧回调，返回取消函数 */
  const onBeforeRender = (cb: FrameCallback) => {
    frameCallbacks.add(cb)
    if (isReady.value) dirty = true
    return () => frameCallbacks.delete(cb)
  }

  /** 初始化完成回调；已就绪时立即执行 */
  const onReady = (cb: (ctx: ThreeContext) => void) => {
    const ctx = getContext()
    if (ctx) cb(ctx)
    else readyCallbacks.add(cb)
    return () => readyCallbacks.delete(cb)
  }

  const getContext = (): ThreeContext | null => {
    if (!scene.value || !camera.value || !renderer.value) return null
    return {
      scene: scene.value,
      camera: camera.value,
      renderer: renderer.value,
      controls: controls.value,
    }
  }

  const disposeMaterial = (material: THREE.Material) => {
    const shader = material as THREE.ShaderMaterial
    if (shader.uniforms) {
      for (const uniform of Object.values(shader.uniforms)) {
        const value = uniform?.value as THREE.Texture | undefined
        if (value && (value as THREE.Texture).isTexture) value.dispose()
      }
    }
    for (const value of Object.values(material)) {
      const texture = value as THREE.Texture | null
      if (texture && (texture as THREE.Texture).isTexture) texture.dispose()
    }
    material.dispose()
  }

  const disposeScene = (root: THREE.Object3D) => {
    root.traverse((obj) => {
      const mesh = obj as Partial<THREE.Mesh>
      mesh.geometry?.dispose()
      const material = mesh.material
      if (Array.isArray(material)) material.forEach(disposeMaterial)
      else if (material) disposeMaterial(material)
    })
    root.clear()
  }

  /** 透视相机改 aspect；正交相机重算左右上下边界，保证容器变化时画面不拉伸 */
  const updateCameraFrustum = (
    cam: SceneCamera,
    width: number,
    height: number,
  ) => {
    const aspect = width / height
    if (cam instanceof THREE.PerspectiveCamera) {
      cam.aspect = aspect
    } else {
      const halfH = (options.frustumSize ?? DEFAULT_FRUSTUM_SIZE) / 2
      const halfW = halfH * aspect
      cam.left = -halfW
      cam.right = halfW
      cam.top = halfH
      cam.bottom = -halfH
    }
    cam.updateProjectionMatrix()
  }

  const applySize = (width: number, height: number) => {
    const cam = camera.value
    const rend = renderer.value
    if (!cam || !rend || width === 0 || height === 0) return

    size.value = { width, height }
    updateCameraFrustum(cam, width, height)
    rend.setSize(width, height)
    dirty = true
    options.onResize?.(size.value)
  }

  /** 读取容器尺寸（padding box，与 canvas 绝对定位基准一致） */
  const readSize = (el: HTMLElement) => ({
    width: el.clientWidth,
    height: el.clientHeight,
  })

  const onContainerResize = () => {
    const el = toValue(containerRef)
    if (!el) return

    if (!isReady.value) {
      const { width, height } = readSize(el)
      if (width > 0 && height > 0) init(el)
      return
    }

    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(() => {
      const { width, height } = readSize(el)
      applySize(width, height)
    })
  }

  const onVisibility = () => {
    if (options.pauseWhenHidden === false) return
    if (document.hidden) stop()
    else if (started) start()
  }

  const onContextLost = (event: Event) => {
    event.preventDefault()
    stop()
    options.onContextLost?.()
  }

  const onContextRestored = () => {
    dirty = true
    if (started) start()
  }

  const init = (el: HTMLElement) => {
    if (isReady.value || disposed) return

    const { width, height } = readSize(el)
    if (width === 0 || height === 0) return

    const _scene = new THREE.Scene()
    _scene.background =
      options.bgColor == null ? null : new THREE.Color(options.bgColor)
    scene.value = _scene

    const near = options.near ?? 0.1
    const far = options.far ?? 1000
    // 正交相机没有透视收缩，适合 2D 图表 / 工程视图 / 等轴测视图
    const _camera =
      options.cameraType === 'orthographic'
        ? new THREE.OrthographicCamera(0, 0, 0, 0, near, far)
        : new THREE.PerspectiveCamera(
            options.fov ?? 75,
            width / height,
            near,
            far,
          )
    updateCameraFrustum(_camera, width, height)
    const { x = 5, y = 5, z = 5 } = options.cameraPosition || {}
    _camera.position.set(x, y, z)
    _camera.lookAt(0, 0, 0)
    camera.value = _camera

    const _renderer = new THREE.WebGLRenderer({
      antialias: options.antialias ?? true,
      alpha: options.alpha ?? true,
      powerPreference: 'high-performance',
    })
    _renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, options.maxDpr ?? 2),
    )
    _renderer.setSize(width, height)

    const canvas = _renderer.domElement
    // canvas 默认 inline 会撑高父容器，这里改为绝对定位铺满容器 padding box
    canvas.style.display = 'block'
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    if (getComputedStyle(el).position === 'static')
      el.style.position = 'relative'
    el.appendChild(canvas)
    renderer.value = _renderer

    canvas.addEventListener('webglcontextlost', onContextLost, false)
    canvas.addEventListener('webglcontextrestored', onContextRestored, false)

    if (options.controls !== false) {
      const _controls = new OrbitControls(_camera, canvas)
      _controls.enableDamping = true
      _controls.dampingFactor = 0.05
      _controls.addEventListener('change', () => {
        dirty = true
      })
      controls.value = _controls
    }

    if (options.showAxes) {
      const _axesScene = new THREE.Scene()
      _axesScene.add(new THREE.AxesHelper(options.axesSize ?? AXES_HELPER_SIZE))
      axesScene.value = _axesScene

      const _axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
      _axesCamera.up.copy(_camera.up)
      axesCamera.value = _axesCamera
    }

    size.value = { width, height }
    isReady.value = true

    const ctx = getContext()
    if (ctx) {
      options.onInit?.(ctx)
      for (const cb of readyCallbacks) cb(ctx)
      readyCallbacks.clear()
    }

    if (options.autoStart !== false) start()
  }

  const renderAxes = () => {
    const rend = renderer.value
    const axes = axesScene.value
    const axesCam = axesCamera.value
    const cam = camera.value
    const orbit = controls.value
    if (!rend || !axes || !axesCam || !cam) return

    const {
      size: viewport = AXES_VIEWPORT_SIZE,
      margin = AXES_VIEWPORT_MARGIN,
      corner = 'rb',
    } = options.axesViewport || {}
    const { width, height } = size.value
    const x =
      corner === 'lt' || corner === 'lb' ? margin : width - viewport - margin
    const y =
      corner === 'lb' || corner === 'rb' ? margin : height - viewport - margin

    // 用 scissor 限定清除范围，避免影响主场景已绘制的内容
    rend.setScissorTest(true)
    rend.setViewport(x, y, viewport, viewport)
    rend.setScissor(x, y, viewport, viewport)
    rend.clearDepth()

    const target = orbit ? orbit.target : axes.position
    axesCam.position.copy(cam.position).sub(target).setLength(15)
    axesCam.lookAt(axes.position)
    rend.render(axes, axesCam)

    rend.setScissorTest(false)
  }

  const tick = () => {
    const rend = renderer.value
    const cam = camera.value
    const sc = scene.value
    if (!rend || !cam || !sc) return

    const now = performance.now()
    const delta = lastTime === 0 ? 0 : (now - lastTime) / 1000
    lastTime = now
    elapsed += delta

    const orbit = controls.value
    if (orbit && orbit.update()) dirty = true

    const ctx = getContext()
    if (ctx) {
      const frameCtx: FrameContext = { ...ctx, delta, elapsed }
      for (const cb of frameCallbacks) cb(frameCtx)
    }

    const onDemand = options.renderOnDemand === true
    if (onDemand && !dirty) return
    dirty = false

    const { width, height } = size.value
    rend.setViewport(0, 0, width, height)
    rend.render(sc, cam)

    if (axesScene.value) renderAxes()
  }

  const start = () => {
    if (disposed || !renderer.value) return
    started = true
    lastTime = 0
    dirty = true
    renderer.value.setAnimationLoop(tick)
  }

  const stop = () => {
    if (!renderer.value) return
    renderer.value.setAnimationLoop(null)
  }

  /** 外部修改场景后手动请求重绘（按需渲染模式下必须调用） */
  const invalidate = () => {
    dirty = true
  }

  /** 重新读取容器尺寸并同步相机/渲染器 */
  const resize = () => {
    const el = toValue(containerRef)
    if (!el) return
    const { width, height } = readSize(el)
    applySize(width, height)
  }

  /** 屏幕坐标 → NDC，供 Raycaster 使用 */
  const toNDC = (
    event: { clientX: number; clientY: number },
    target = new THREE.Vector2(),
  ) => {
    const el = toValue(containerRef)
    if (!el) return target.set(0, 0)
    const rect = el.getBoundingClientRect()
    return target.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )
  }

  const dispose = () => {
    if (disposed) return
    disposed = true

    stop()
    resizeObserver?.disconnect()
    resizeObserver = null
    cancelAnimationFrame(resizeRaf)
    document.removeEventListener('visibilitychange', onVisibility)

    const canvas = renderer.value?.domElement
    if (canvas) {
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      canvas.remove()
    }

    controls.value?.dispose()
    if (axesScene.value) disposeScene(axesScene.value)
    if (scene.value) disposeScene(scene.value)

    renderer.value?.dispose()
    renderer.value?.forceContextLoss()

    frameCallbacks.clear()
    readyCallbacks.clear()
    scene.value = null
    camera.value = null
    renderer.value = null
    controls.value = null
    axesScene.value = null
    axesCamera.value = null
    isReady.value = false
  }

  onMounted(() => {
    const el = toValue(containerRef)
    if (!el) return

    // 用 ResizeObserver 替代 window.resize：容器自身尺寸变化（侧栏折叠、flex 重排）也能响应
    resizeObserver = new ResizeObserver(onContainerResize)
    resizeObserver.observe(el)
    document.addEventListener('visibilitychange', onVisibility)

    const { width, height } = readSize(el)
    if (width > 0 && height > 0) init(el)
  })

  onUnmounted(dispose)

  // 配合 <KeepAlive>：被缓存失活时停帧，避免切走后继续空转 GPU
  onDeactivated(() => {
    suspendedByKeepAlive = true
    stop()
  })

  onActivated(() => {
    if (suspendedByKeepAlive && started && !document.hidden) start()
    suspendedByKeepAlive = false
  })

  return {
    scene,
    camera,
    renderer,
    controls,
    size,
    isReady,
    onReady,
    onBeforeRender,
    invalidate,
    start,
    stop,
    resize,
    toNDC,
    dispose,
  }
}
