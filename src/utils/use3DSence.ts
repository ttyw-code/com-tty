import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, onUnmounted, shallowRef, type Ref } from 'vue'

export interface UseThreeOptions {
  bgColor?: string | number
  antialias?: boolean
  showAxes?: boolean
  axesSize?: number
  cameraPosition?: { x: number; y: number; z: number }
}

export function useThree(
  containerRef: Ref<HTMLElement | null>,
  options: UseThreeOptions = {},
) {
  // 核心对象使用 shallowRef 以避免 Vue 深度响应式带来的性能开销
  const scene = shallowRef<THREE.Scene | null>(null)
  const camera = shallowRef<THREE.PerspectiveCamera | null>(null)
  const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
  const controls = shallowRef<OrbitControls | null>(null)

  // 辅助场景对象
  const axesScene = shallowRef<THREE.Scene | null>(null)
  const axesCamera = shallowRef<THREE.PerspectiveCamera | null>(null)

  let animationId: number
  let cachedWidth = 0
  let cachedHeight = 0

  // 初始化函数
  const init = () => {
    if (!containerRef.value) return

    const { width, height } = containerRef.value.getBoundingClientRect()
    cachedWidth = width
    cachedHeight = height

    // 1. 创建场景
    const _scene = new THREE.Scene()
    _scene.background = new THREE.Color(options.bgColor ?? 0x000000)
    scene.value = _scene

    // 2. 创建相机
    const _camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const { x = 5, y = 5, z = 5 } = options.cameraPosition || {}
    _camera.position.set(x, y, z)
    camera.value = _camera

    // 3. 创建渲染器
    const _renderer = new THREE.WebGLRenderer({
      antialias: options.antialias ?? true,
      alpha: true,
    })
    _renderer.setSize(width, height)
    _renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.value.appendChild(_renderer.domElement)
    renderer.value = _renderer

    // 4. 添加控制器
    const _controls = new OrbitControls(_camera, _renderer.domElement)
    _controls.enableDamping = true // 开启阻尼效果
    _controls.dampingFactor = 0.05
    controls.value = _controls

    // 5. 辅助坐标轴 (可选)
    if (options.showAxes) {
      const _axesScene = new THREE.Scene()
      const axesHelper = new THREE.AxesHelper(options.axesSize ?? 5)
      _axesScene.add(axesHelper)
      axesScene.value = _axesScene

      const _axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
      _axesCamera.up = _camera.up // 同步 up 向量
      axesCamera.value = _axesCamera
    }

    // 6. 启动动画循环
    animate()

    // 7. 监听窗口大小变化
    window.addEventListener('resize', onResize)
  }

  // 动画循环
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    if (controls.value) controls.value.update()

    if (renderer.value && scene.value && camera.value) {
      // 渲染主场景
      renderer.value.setViewport(0, 0, cachedWidth, cachedHeight)
      renderer.value.render(scene.value, camera.value)

      // 渲染右下角坐标轴
      if (axesScene.value && axesCamera.value && controls.value) {
        renderer.value.autoClear = false
        renderer.value.clearDepth() // 清除深度缓冲区，确保坐标轴在最上层

        const axesViewportSize = 100 // 坐标轴视口大小
        const margin = 10 // 边距
        // 设置视口到右下角
        renderer.value.setViewport(
          cachedWidth - axesViewportSize - margin,
          margin,
          axesViewportSize,
          axesViewportSize,
        )

        // 同步相机方向
        // 计算相机相对于控制中心的位置向量，并缩放到合适距离
        axesCamera.value.position
          .copy(camera.value.position)
          .sub(controls.value.target)
          .setLength(15)
        axesCamera.value.lookAt(axesScene.value.position)

        renderer.value.render(axesScene.value, axesCamera.value)
        renderer.value.autoClear = true // 恢复自动清除
      }
    }
  }

  // 窗口大小调整处理
  const onResize = () => {
    if (!containerRef.value || !camera.value || !renderer.value) return

    const { width, height } = containerRef.value.getBoundingClientRect()
    cachedWidth = width
    cachedHeight = height

    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()

    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(window.devicePixelRatio)
  }

  // 生命周期钩子
  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)

    // 资源清理
    if (renderer.value) {
      renderer.value.dispose()
      renderer.value.forceContextLoss()
      const domElement = renderer.value.domElement
      if (domElement && domElement.parentNode) {
        domElement.parentNode.removeChild(domElement)
      }
    }

    if (controls.value) {
      controls.value.dispose()
    }
  })

  return {
    scene,
    camera,
    renderer,
    controls,
    onResize, // 暴露手动 resize 方法
  }
}
