<template>
  <div class="dashboard-container">
    <!-- 顶部标题栏 -->
    <header class="header">
      <div class="header-decoration left"></div>
      <h1 class="title">全流程条烟追溯管理可视化</h1>
      <div class="header-info">
        <span class="time">{{ currentTime }}</span>
        <span class="weather">☀ 晴天 24~28℃</span>
      </div>
      <div class="header-decoration right"></div>
    </header>

    <div class="main-content">
      <!-- 左侧栏 -->
      <aside class="column left-col">
        <!-- 模块1：高架库库存监控 -->
        <div class="panel">
          <h3 class="panel-title">◇ 高架库库存监控</h3>
          <div class="stat-row">
            <div class="stat-item">
              <div class="stat-value">
                10032
                <span class="unit">件</span>
              </div>
              <div class="stat-label">今日入库总量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">
                32
                <span class="unit">件</span>
              </div>
              <div class="stat-label">当前库存总量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">
                10000
                <span class="unit">件</span>
              </div>
              <div class="stat-label">今日移出总量</div>
            </div>
          </div>
        </div>

        <!-- 模块2：三层货架库监控 -->
        <div class="panel">
          <h3 class="panel-title">◇ 三层货架库监控</h3>
          <div class="stat-row">
            <div class="stat-item">
              <div class="stat-value">
                10032
                <span class="unit">件</span>
              </div>
              <div class="stat-label">今日移入总量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">
                9000
                <span class="unit">件</span>
              </div>
              <div class="stat-label">当前堆放量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">
                10000
                <span class="unit">件</span>
              </div>
              <div class="stat-label">今日移出总量</div>
            </div>
          </div>
        </div>

        <!-- 模块3：分拣线库库存监控 -->
        <div class="panel">
          <h3 class="panel-title">◇ 分拣线库库存监控</h3>
          <div class="progress-section">
            <div class="progress-text">
              <span>今日移入总量</span>
              <span class="highlight-text">1000件/50000条</span>
            </div>
            <div class="custom-progress">
              <div class="progress-bar" style="width: 87%">
                <span class="bar-label-left">分拣关联完成</span>
                <span class="bar-val">43843条</span>
              </div>
              <div class="progress-remain">
                <span class="bar-val-right">6157条</span>
              </div>
            </div>
          </div>

          <div class="chart-box">
            <div class="chart-title-sm">
              各分拣线分拣关联量对比
              <span class="unit">单位：万条</span>
            </div>
            <div ref="chartLeft1" class="chart-instance"></div>
          </div>

          <div class="chart-box">
            <div class="chart-title-sm">
              各品规分拣关联量对比
              <span class="unit">单位：万条</span>
            </div>
            <div ref="chartLeft2" class="chart-instance"></div>
          </div>
        </div>
      </aside>

      <!-- 中间栏 -->
      <section class="column center-col">
        <!-- 中心库存概览 -->
        <div class="center-top">
          <h3 class="panel-title center-h3">◇ 全中心库存概览</h3>
          <div class="digital-row">
            <div class="digital-item">
              <div class="label">今日入库总量</div>
              <div class="digital-box">
                <span class="nums">105.16</span>
                <span class="unit">万条</span>
              </div>
            </div>
            <div class="digital-item">
              <div class="label">当前库存总量</div>
              <div class="digital-box">
                <span class="nums">71.78</span>
                <span class="unit">万条</span>
              </div>
            </div>
            <div class="digital-item">
              <div class="label">今日出库总量</div>
              <div class="digital-box">
                <span class="nums">33.38</span>
                <span class="unit">万条</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 库存流转监控 (模拟中间的复杂图示区域) -->
        <div class="center-map-area">
          <h3 class="panel-title center-h3">◇ 库存流转监控</h3>
          <!-- 这里通常是切图，这里用CSS模拟布局占位，实际开发建议使用设计师提供的背景图 -->
          <div class="flow-chart-placeholder">
            <div class="flow-node node-1">工业出库</div>
            <div class="flow-node node-2">商业高架库</div>
            <div class="flow-node node-3">三层货架</div>
            <div class="flow-node node-4">分拣线</div>
            <div class="flow-arrow arrow-1">>>> 工业运输 >>></div>
            <div class="flow-arrow arrow-2">>>> 内部移库 >>></div>
            <!-- 示意性内容 -->
            <div class="center-img-mock">
              <span style="color: #0ff; font-size: 12px; opacity: 0.7">
                (注：此处原图为3D等轴侧插画，需UI切图配合，
                <br />
                代码中使用布局模拟位置)
              </span>
            </div>
          </div>
        </div>

        <!-- 底部两个图表 -->
        <div class="center-bottom">
          <div class="chart-box half">
            <div class="chart-title-sm">
              ◇ 各类型条烟库存量
              <span class="unit">单位：件</span>
            </div>
            <div ref="chartCenterPie" class="chart-instance"></div>
          </div>
          <div class="chart-box half">
            <div class="chart-title-sm">
              ◇ TOP5 品规当前总库存
              <span class="unit">单位：件</span>
            </div>
            <div ref="chartCenterBar" class="chart-instance"></div>
          </div>
        </div>
      </section>

      <!-- 右侧栏 -->
      <aside class="column right-col">
        <!-- 在途数据监控 -->
        <div class="panel">
          <h3 class="panel-title">
            ◇ 在途数据监控
            <span class="tag">按总量</span>
          </h3>
          <div class="stat-row">
            <div class="stat-item">
              <div class="stat-value text-cyan">
                10323
                <span class="unit">条</span>
              </div>
              <div class="stat-label">今日在途总量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value text-white">
                9821
                <span class="unit">条</span>
              </div>
              <div class="stat-label">正在配送</div>
            </div>
            <div class="stat-item">
              <div class="stat-value text-white">
                502
                <span class="unit">条</span>
              </div>
              <div class="stat-label">配送完成</div>
            </div>
          </div>
        </div>

        <!-- 地图区域 -->
        <div class="panel map-panel">
          <h3 class="panel-title">◇ 在途数据监控</h3>
          <div ref="chartRightMap" class="chart-instance map-instance"></div>
        </div>

        <!-- 到户签收确认 -->
        <div class="panel">
          <h3 class="panel-title">◇ 到户签收确认</h3>
          <div
            ref="chartRightPie"
            class="chart-instance"
            style="height: 200px"
          ></div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
// 注意：实际项目中需要引入地图JSON数据，这里假设已经有了或使用geoCoord模拟
// import chinaJson from '@/assets/china.json';
// echarts.registerMap('china', chinaJson);

const chartLeft1 = ref(null)
const chartLeft2 = ref(null)
const chartCenterPie = ref(null)
const chartCenterBar = ref(null)
const chartRightMap = ref(null)
const chartRightPie = ref(null)

const currentTime = ref('')
let timer = null

const updateTime = () => {
  const now = new Date()
  const dateStr = now.toLocaleDateString().replace(/\//g, '/')
  const timeStr = now.toTimeString().slice(0, 8)
  currentTime.value = `${timeStr} ${dateStr}`
}

// ECharts 通用配置 - 深色主题
const commonOption = {
  textStyle: { fontFamily: 'Microsoft YaHei' },
  grid: {
    top: '30px',
    left: '10px',
    right: '10px',
    bottom: '10px',
    containLabel: true,
  },
}

const initCharts = () => {
  // 1. 左侧：各分拣线分拣关联量对比 (堆叠柱状图)
  const myChartLeft1 = echarts.init(chartLeft1.value)
  myChartLeft1.setOption({
    ...commonOption,
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: '#ccc' },
      itemWidth: 10,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: [
        '分拣线1',
        '分拣线2',
        '分拣线3',
        '分拣线4',
        '分拣线5',
        '分拣线6',
        '分拣线7',
      ],
      axisLabel: { color: '#9aa', fontSize: 10, interval: 0 },
      axisLine: { lineStyle: { color: '#333' } },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#222', type: 'dashed' } },
      axisLabel: { color: '#9aa' },
    },
    series: [
      {
        name: '已分拣',
        type: 'bar',
        stack: 'total',
        barWidth: 15,
        itemStyle: { color: '#2c7be5' }, // 蓝色
        data: [30, 90, 60, 80, 50, 60, 70],
      },
      {
        name: '未分拣',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#4db6ac' }, // 青绿色
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#68decb' },
            { offset: 1, color: '#4db6ac' },
          ]),
        },
        data: [20, 30, 10, 20, 60, 40, 90],
      },
    ],
  })

  // 2. 左侧：各品规分拣关联量对比 (逻辑同上，数据不同)
  const myChartLeft2 = echarts.init(chartLeft2.value)
  myChartLeft2.setOption({
    ...commonOption,
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: '#ccc' },
      itemWidth: 10,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      // 模拟长名称省略
      data: [
        '贵烟(金)',
        '贵烟(跨)',
        '贵烟(行)',
        '贵烟(奇)',
        '贵烟(蓝)',
        '贵烟(多)',
      ],
      axisLabel: { color: '#9aa', fontSize: 10, interval: 0 },
      axisLine: { lineStyle: { color: '#333' } },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#222', type: 'dashed' } },
      axisLabel: { color: '#9aa' },
    },
    series: [
      {
        name: '已分拣',
        type: 'bar',
        stack: 'total',
        barWidth: 15,
        itemStyle: { color: '#2c7be5' },
        data: [20, 60, 40, 60, 80, 80],
      },
      {
        name: '未分拣',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#4db6ac' },
        data: [10, 30, 40, 20, 20, 60],
      },
    ],
  })

  // 3. 中间底部：饼图 (各类型条烟库存量)
  const myChartCenterPie = echarts.init(chartCenterPie.value)
  myChartCenterPie.setOption({
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#ccc', fontSize: 10 },
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [
      {
        name: '库存量',
        type: 'pie',
        radius: ['0%', '75%'],
        center: ['35%', '50%'],
        roseType: false,
        label: { show: true, position: 'inner', formatter: '{c}' },
        itemStyle: { borderRadius: 0 },
        data: [
          { value: 494, name: '一类烟', itemStyle: { color: '#2c7be5' } },
          { value: 185, name: '二类烟', itemStyle: { color: '#00d4c7' } },
          { value: 764, name: '三类烟', itemStyle: { color: '#7a3ceb' } },
          { value: 386, name: '四类烟', itemStyle: { color: '#ffcc00' } },
          { value: 199, name: '五类烟', itemStyle: { color: '#6be6c1' } },
        ],
      },
    ],
  })

  // 4. 中间底部：柱状图 (TOP5)
  const myChartCenterBar = echarts.init(chartCenterBar.value)
  myChartCenterBar.setOption({
    grid: {
      top: '20px',
      left: '0',
      right: '10px',
      bottom: '20px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['贵烟(金)', '贵烟(跨)', '贵烟(行)', '贵烟(奇)', '贵烟(蓝)'],
      axisLabel: { color: '#9aa', fontSize: 10, interval: 0 },
      axisLine: { show: true, lineStyle: { color: '#333' } },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: true, lineStyle: { color: '#222', type: 'dashed' } },
      axisLabel: { color: '#9aa' },
    },
    series: [
      {
        type: 'bar',
        barWidth: 15,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#68decb' },
            { offset: 1, color: '#2f857d' },
          ]),
        },
        data: [900, 450, 780, 250, 60],
      },
    ],
  })

  // 5. 右侧：地图 (由于没有具体JSON，使用散点图+连线模拟视觉效果)
  const myChartRightMap = echarts.init(chartRightMap.value)
  // 模拟地图数据
  const mapData = [
    { name: 'Node1', value: [50, 50] },
    { name: 'Node2', value: [30, 70] },
    { name: 'Node3', value: [70, 30] },
    { name: 'Center', value: [50, 20] },
  ]
  myChartRightMap.setOption({
    // 如果有 geoJson: geo: { map: 'china', ... },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    grid: { top: 0, bottom: 0, left: 0, right: 0 },
    series: [
      // 模拟地图背景轮廓（实际应为 Geo 组件）
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 0,
        data: mapData, // 这里的点仅仅是为了撑开
        lineStyle: { color: '#00ffae', opacity: 0.3, curveness: 0.2 },
        links: mapData.map((item) => ({ source: 'Center', target: item.name })),
      },
      // 模拟飞线
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        effect: {
          show: true,
          period: 6,
          trailLength: 0.7,
          color: '#fff',
          symbolSize: 3,
        },
        lineStyle: { color: '#00ffae', width: 1, opacity: 0.4, curveness: 0.2 },
        data: [
          {
            coords: [
              [50, 20],
              [30, 70],
            ],
          },
          {
            coords: [
              [50, 20],
              [80, 80],
            ],
          },
          {
            coords: [
              [50, 20],
              [20, 40],
            ],
          },
          {
            coords: [
              [50, 20],
              [70, 60],
            ],
          },
          {
            coords: [
              [50, 20],
              [90, 30],
            ],
          },
        ],
      },
      // 模拟点
      {
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: [
          { value: [50, 20], itemStyle: { color: '#00ffae' } },
          { value: [30, 70], itemStyle: { color: '#fff' } },
          { value: [80, 80], itemStyle: { color: '#fff' } },
          { value: [20, 40], itemStyle: { color: '#fff' } },
          { value: [70, 60], itemStyle: { color: '#fff' } },
        ],
        symbolSize: 6,
      },
    ],
  })

  // 6. 右侧底部：饼图 (到户签收确认)
  const myChartRightPie = echarts.init(chartRightPie.value)
  myChartRightPie.setOption({
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: { color: '#ccc' },
      formatter: (name) => {
        return name
      },
    },
    series: [
      {
        name: '签收状态',
        type: 'pie',
        radius: ['0%', '80%'],
        center: ['35%', '50%'],
        label: { show: false },
        data: [
          { value: 500, name: '未签收', itemStyle: { color: '#68decb' } },
          { value: 200, name: '已签收', itemStyle: { color: '#2c7be5' } },
        ],
      },
    ],
  })

  // 响应式调整
  window.addEventListener('resize', () => {
    myChartLeft1.resize()
    myChartLeft2.resize()
    myChartCenterPie.resize()
    myChartCenterBar.resize()
    myChartRightMap.resize()
    myChartRightPie.resize()
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  initCharts()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 全局变量 */
:root {
  --bg-color: #0b1213;
  --panel-bg: rgba(6, 30, 35, 0.5);
  --text-main: #ffffff;
  --text-sub: #8fa0a5;
  --accent-cyan: #00ffff;
  --accent-green: #00ffae;
  --accent-blue: #2c7be5;
  --border-color: #1a4f5a;
}

@font-face {
  font-family: 'LCD';
  src: local('Arial'); /* 如果有数字字体文件可引入，这里回退 */
}

.dashboard-container {
  width: 100vw;
  height: 100vh;
  background-color: #050e11;
  background-image: radial-gradient(
    circle at 50% 50%,
    #09191d 0%,
    #030809 100%
  );
  color: #fff;
  font-family: 'Microsoft YaHei', sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 顶部标题 */
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxsaW5lIHgxPSIwIiB5MT0iNjAiIHgyPSIxMDAlIiB5Mj0iNjAiIHN0cm9rZT0iIzBhM2IzNCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc=');
  background-size: cover;
  border-bottom: 1px solid #0f363f;
}

.title {
  font-size: 24px;
  letter-spacing: 2px;
  background: linear-gradient(to bottom, #fff, #b3f6ff);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.header-info {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 12px;
  color: var(--accent-cyan);
}
.header-info .time {
  margin-right: 15px;
  color: #fff;
  font-family: 'LCD', sans-serif;
}

/* 布局网格 */
.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 28% 44% 28%;
  padding: 10px;
  gap: 10px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 通用面板样式 */
.panel {
  /* background: rgba(13, 33, 41, 0.3); */
  padding: 10px;
  position: relative;
}

.panel-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #e0ffff;
  font-weight: normal;
  display: flex;
  align-items: center;
}
.panel-title::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--accent-cyan);
  transform: rotate(45deg);
  margin-right: 8px;
}
.panel-title .tag {
  font-size: 10px;
  color: #a6c05a;
  background: rgba(166, 192, 90, 0.1);
  padding: 2px 4px;
  margin-left: 10px;
  border: 1px solid #a6c05a;
}

/* 文本统计行 */
.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.stat-item {
  text-align: center;
  flex: 1;
}
.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  font-family: 'Arial', sans-serif;
}
.text-cyan {
  color: var(--accent-cyan);
}
.unit {
  font-size: 12px;
  font-weight: normal;
  margin-left: 2px;
  color: #8fa0a5;
}
.stat-label {
  font-size: 12px;
  color: #00d4c7;
  margin-top: 5px;
}

/* 进度条部分 */
.progress-section {
  margin-bottom: 15px;
}
.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--accent-cyan);
  margin-bottom: 5px;
}
.highlight-text {
  color: #fff;
  font-size: 14px;
}
.custom-progress {
  height: 24px;
  background: #0f272c;
  display: flex;
  position: relative;
  border-radius: 2px;
  overflow: hidden;
}
.progress-bar {
  background: linear-gradient(90deg, #00f0ff, #00ffae);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  color: #000;
  font-size: 12px;
  font-weight: bold;
}
.progress-remain {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5px;
  color: #8fa0a5;
  font-size: 12px;
}
.bar-label-left {
  font-size: 10px;
}

/* 图表容器 */
.chart-box {
  flex: 1;
  min-height: 150px;
  margin-top: 10px;
}
.chart-instance {
  width: 100%;
  height: 180px;
}
.chart-title-sm {
  font-size: 12px;
  color: #8fa0a5;
  margin-bottom: 5px;
}

/* 中间列样式 */
.center-h3 {
  justify-content: center;
  font-size: 18px;
}
.digital-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
.digital-item {
  text-align: center;
}
.digital-item .label {
  font-size: 12px;
  color: #00d4c7;
  margin-bottom: 5px;
}
.digital-box {
  border: 1px solid rgba(0, 255, 255, 0.3);
  background: rgba(0, 255, 255, 0.05);
  padding: 5px 15px;
  box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.1);
}
.digital-box .nums {
  font-size: 32px;
  font-weight: bold;
  font-family: 'Impact', sans-serif;
  color: #fff;
  letter-spacing: 2px;
}

.center-map-area {
  flex: 1;
  position: relative;
  /* border: 1px dashed #1a4f5a; */
  min-height: 300px;
  display: flex;
  flex-direction: column;
}
.flow-chart-placeholder {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 模拟流转图节点 */
.flow-node {
  position: absolute;
  padding: 5px 10px;
  border: 1px solid #00ffae;
  background: rgba(0, 255, 174, 0.1);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 255, 174, 0.2);
}
/* 手动定位模拟截图中的位置 */
.node-1 {
  top: 20%;
  left: 10%;
}
.node-2 {
  top: 15%;
  left: 45%;
  border-color: #ffcc00;
  color: #ffcc00;
}
.node-3 {
  top: 40%;
  right: 10%;
}
.node-4 {
  bottom: 30%;
  right: 20%;
  border-color: #00f0ff;
}
.center-img-mock {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 50%;
}

.center-bottom {
  height: 200px;
  display: flex;
  gap: 10px;
}
.center-bottom .half {
  width: 50%;
}

/* 右侧样式 */
.map-panel {
  flex: 1;
  position: relative;
}
.map-instance {
  height: 300px; /* 地图高度 */
  background: url(''); /* 可加入网格背景图 */
  background-size: cover;
}

/* 滚动条隐藏 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
