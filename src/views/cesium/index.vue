<template>
  <section class="cesium-scene">
    <div ref="cesiumContainer" class="cesium-scene__viewer"></div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

/**
 * ⚠️ 底图说明：这里用的是 OpenStreetMap 公开瓦片，**仅适合本地开发自用**。
 * 它的中国边界 / 藏南 / 台湾标注不符合国家标准，属于地图合规红线，
 * 对外发布前必须换成合规服务（天地图 WMTS / 腾讯 / 高德），天地图需要申请 tk。
 */

/** 初始视角中心：湖南（约 111.53°E / 27.38°N） */
const HUNAN_CENTER = { lon: 111.525, lat: 27.38 }

/** 初始视高：湖南南北跨度约 610km，600km 视高刚好覆盖全省并留少量余量 */
const INITIAL_HEIGHT = 600_000

const cesiumContainer = ref<HTMLElement | null>(null)
let cesiumViewer: Cesium.Viewer | null = null

onMounted(() => {
  if (!cesiumContainer.value) return

  cesiumViewer = new Cesium.Viewer(cesiumContainer.value, {
    // 关掉整条默认工具栏，只留地球本身
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    selectionIndicator: false,
    baseLayer: new Cesium.ImageryLayer(
      new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/',
      }),
    ),
  })

  // 只是把初始机位放在湖南上空正俯视；
  // 之后拖动、缩放、旋转都交给 Cesium 默认行为，不做任何限制
  cesiumViewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      HUNAN_CENTER.lon,
      HUNAN_CENTER.lat,
      INITIAL_HEIGHT,
    ),
    orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 },
  })
})

onBeforeUnmount(() => {
  // destroy() 会一并释放 WebGL 上下文与内部的 DOM，不复用会泄漏
  cesiumViewer?.destroy()
  cesiumViewer = null
})
</script>

<style scoped lang="scss">
.cesium-scene {
  width: 100%;
  height: 100%;
  position: relative;
}

.cesium-scene__viewer {
  width: 100%;
  height: 100%;
}
</style>
