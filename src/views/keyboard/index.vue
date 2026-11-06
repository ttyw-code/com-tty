<template>
  <section ref="section" class="keyboard-page">
    <div ref="container" class="keyboard-page__canvas"></div>

    <!-- 叠在画布上的文案，随滚动进度淡入淡出 -->
    <div class="keyboard-page__copy">
      <article
        v-for="(item, index) in COPY"
        :key="item.title"
        class="keyboard-page__block"
        :style="{
          top: `${index * 100}vh`,
          opacity: blockOpacity(index),
        }"
      >
        <p class="keyboard-page__index">{{ item.index }}</p>
        <h2 class="keyboard-page__title">{{ item.title }}</h2>
        <p class="keyboard-page__desc">{{ item.desc }}</p>
      </article>
    </div>

    <p v-if="!ready" class="keyboard-page__hint">场景初始化中…</p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { useThree } from '@/utils/3DUtils/useThree'
import { createKeyboard, type KeyboardModel } from './keyboard'

const BG_COLOR = 0x0d1013

/** 四段文案，对应四个机位 */
const COPY = [
  {
    index: '01 / OVERVIEW',
    title: '60% 布局',
    desc: '62 键，把功能键收进 Fn 层，桌面只留一块 285mm 的铝坨。',
  },
  {
    index: '02 / PROFILE',
    title: '5° 倾角',
    desc: '从侧面看，键帽高度逐行递减，手指落下时几乎不用抬腕。',
  },
  {
    index: '03 / KEYCAPS',
    title: 'PBT 灰白',
    desc: '球帽字符居中，背光透过字符边缘，暗处也能读清。',
  },
  {
    index: '04 / BACKLIGHT',
    title: '逐键背光',
    desc: '点任意一颗键，或者让它自己敲一会儿。',
  },
]

/**
 * 四个相机机位（单位：米）
 * 0 → 正面 3/4，1 → 低角度侧面，2 → 俯视特写，3 → 背面英雄机位
 */
const SHOTS = [
  {
    pos: new THREE.Vector3(0.25, 0.17, 0.3),
    target: new THREE.Vector3(-0.05, 0.015, 0),
  },
  {
    pos: new THREE.Vector3(0.36, 0.05, 0.075),
    target: new THREE.Vector3(-0.06, 0.012, 0),
  },
  {
    pos: new THREE.Vector3(0.05, 0.42, 0.19),
    target: new THREE.Vector3(-0.05, 0.01, 0),
  },
  {
    pos: new THREE.Vector3(-0.24, 0.15, -0.28),
    target: new THREE.Vector3(-0.045, 0.015, 0),
  },
]

const section = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)
const ready = ref(false)

/** 0~1 的滚动进度，驱动机位插值 */
const progress = ref(0)

const { onReady, onBeforeRender } = useThree(container, {
  bgColor: BG_COLOR,
  // 产品特写用长焦，压扁透视更"摄影"
  fov: 35,
  cameraPosition: { x: SHOTS[0].pos.x, y: SHOTS[0].pos.y, z: SHOTS[0].pos.z },
  // 机位完全由滚动控制，关掉轨道控制器
  controls: false,
})

let keyboard: KeyboardModel | null = null
let scroller: HTMLElement | null = null
let rafId = 0

const cameraTarget = new THREE.Vector3()
const desiredPos = new THREE.Vector3()
const desiredTarget = new THREE.Vector3()

/** 指针位置（-1~1），用于轻微的视差 */
const pointer = { x: 0, y: 0 }
let pointerTarget = { x: 0, y: 0 }

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
/** 平滑插值曲线，避免匀速移动显得机械 */
const smoothstep = (t: number) => t * t * (3 - 2 * t)

/** 每块文案：进度落在自己那个机位上时最亮，离远了淡出 */
const blockOpacity = (index: number) => {
  // 4 段文案的中心正好是 0 / 0.33 / 0.67 / 1，和机位一一对应
  const center = index / Math.max(1, COPY.length - 1)
  const distance = Math.abs(progress.value - center)
  return clamp01(1 - distance / 0.24)
}

/** 读取滚动进度：用区块自身的位置算，比 main.scrollTop 更稳 */
const readProgress = () => {
  const element = section.value
  if (!element) return
  const rect = element.getBoundingClientRect()
  const scrollable = rect.height - window.innerHeight
  if (scrollable <= 0) return
  progress.value = clamp01(-rect.top / scrollable)
}

const onScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    readProgress()
  })
}

const onPointerMove = (event: PointerEvent) => {
  pointerTarget = {
    x: (event.clientX / window.innerWidth) * 2 - 1,
    y: (event.clientY / window.innerHeight) * 2 - 1,
  }
}

/** 点击键帽：射线拾取后按一下 */
const onClick = (event: PointerEvent) => {
  if (!keyboard || !container.value) return
  const renderer = container.value.querySelector('canvas')
  if (!renderer) return

  const rect = renderer.getBoundingClientRect()
  const ndc = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  )

  // 只有键帽参与拾取，壳体/定位板不响应
  const raycaster = new THREE.Raycaster()
  const meshes = keyboard.keycaps.map((keycap) => keycap.mesh)
  raycaster.setFromCamera(ndc, cameraRef)
  const hit = raycaster.intersectObjects(meshes, false)[0]
  if (!hit) return

  const keycap = keyboard.keycaps.find((item) => item.mesh === hit.object)
  if (keycap) keyboard.press(keycap)
}

let cameraRef: THREE.PerspectiveCamera

onReady(({ scene, camera, renderer }) => {
  cameraRef = camera as THREE.PerspectiveCamera

  // 金属外壳的质感全靠环境反射
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture
  pmrem.dispose()

  scene.add(new THREE.AmbientLight(0xffffff, 0.35))
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.3)
  keyLight.position.set(0.3, 0.5, 0.35)
  scene.add(keyLight)
  // 冷色轮廓光，勾出壳体边缘
  const rimLight = new THREE.DirectionalLight(0x8fb6ff, 0.8)
  rimLight.position.set(-0.45, 0.2, -0.3)
  scene.add(rimLight)

  keyboard = createKeyboard()
  scene.add(keyboard.group)

  // 接地阴影：一张径向渐变贴图，比真阴影便宜且更"产品图"
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 256
  shadowCanvas.height = 256
  const ctx = shadowCanvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(0,0,0,0.55)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
  }
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas)
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.34),
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.0175
  scene.add(shadow)

  cameraTarget.copy(SHOTS[0].target)
  camera.lookAt(cameraTarget)

  ready.value = true
  readProgress()
})

onBeforeRender(({ elapsed, delta, camera }) => {
  if (!keyboard) return

  const frameDelta = Math.min(delta, 0.05)

  // 自动打字：让键盘一直是"活"的
  keyboard.pressRandom(elapsed)
  keyboard.update(elapsed, frameDelta)

  // ---- 机位插值 ----
  // progress 0~1 映射到 3 段，段内用 smoothstep 缓动
  const segments = SHOTS.length - 1
  const scaled = progress.value * segments
  const index = Math.min(Math.floor(scaled), segments - 1)
  const t = smoothstep(clamp01(scaled - index))

  desiredPos.lerpVectors(SHOTS[index].pos, SHOTS[index + 1].pos, t)
  desiredTarget.lerpVectors(SHOTS[index].target, SHOTS[index + 1].target, t)

  // 指针视差：目标点轻微偏移，制造"随手移动观察"的感觉
  pointer.x += (pointerTarget.x - pointer.x) * Math.min(1, frameDelta * 4)
  pointer.y += (pointerTarget.y - pointer.y) * Math.min(1, frameDelta * 4)
  desiredTarget.x += pointer.x * 0.012
  desiredTarget.y += pointer.y * 0.008

  // 阻尼跟随：滚动停止后镜头还会滑一小段，比硬绑定顺滑
  const damping = 1 - Math.exp(-6 * frameDelta)
  camera.position.lerp(desiredPos, damping)
  cameraTarget.lerp(desiredTarget, damping)
  camera.lookAt(cameraTarget)
})

onMounted(() => {
  scroller = document.querySelector('main')
  scroller?.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  container.value?.addEventListener('pointerdown', onClick)
  readProgress()
})

onBeforeUnmount(() => {
  scroller?.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointermove', onPointerMove)
  container.value?.removeEventListener('pointerdown', onClick)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped lang="scss">
.keyboard-page {
  position: relative;
  width: 100%;
  // 4 段文案 = 4 屏滚动距离
  height: 400vh;
}

.keyboard-page__canvas {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
}

.keyboard-page__copy {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.keyboard-page__block {
  position: absolute;
  left: 8vw;
  // 每段文案落在自己那一屏的视觉中心偏上
  padding-top: 16vh;
  max-width: 26rem;
  color: var(--text);
  will-change: opacity;
}

.keyboard-page__index {
  margin: 0 0 0.6rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  color: var(--muted);
}

.keyboard-page__title {
  margin: 0 0 0.6rem;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.keyboard-page__desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-2);
}

.keyboard-page__hint {
  position: sticky;
  top: 50vh;
  margin: 0;
  text-align: center;
  color: var(--muted);
  font-size: 0.85rem;
}
</style>
