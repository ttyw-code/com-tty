<template>
  <v-scale-screen :width="1920" :height="1080" :fullScreen="true">
    <div class="dashboard-container">
      <!-- 顶部标题栏 -->
      <header class="header">
        <div class="header-decoration left"></div>
        <h1 class="title">全流程条烟追溯管理可视化</h1>
        <div class="header-info">
          <div class="time-group">
            <div class="time">{{ timeString }}</div>
            <div class="date">{{ dateString }}</div>
          </div>
          <span class="weather">
            {{ weatherData.type }} {{ weatherData.low }}~{{ weatherData.high }}
          </span>
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
                  <span>件</span>
                </div>
                <div class="stat-label">今日入库总量</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  32
                  <span>件</span>
                </div>
                <div class="stat-label">当前库存总量</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  10000
                  <span>件</span>
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
                  <span>件</span>
                </div>
                <div class="stat-label">今日移入总量</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  9000
                  <span>件</span>
                </div>
                <div class="stat-label">当前堆放量</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  10000
                  <span>件</span>
                </div>
                <div class="stat-label">今日移出总量</div>
              </div>
            </div>
          </div>

          <!-- 模块3：分拣线库库存监控 -->
          <div class="panel flex-panel">
            <h3 class="panel-title">◇ 分拣线库库存监控</h3>
            <div class="progress-section">
              <div class="progress-text">
                <span>今日移入总量</span>
                <span class="highlight-text">1000件/50000条</span>
              </div>
              <div class="progress-outer">
                <span class="bar-label-right">分拣关联剩余</span>
                <div class="custom-progress">
                  <div class="progress-bar" style="width: 87%">
                    <span class="bar-val">43843条</span>
                  </div>
                  <div class="progress-remain">
                    <span class="bar-val-right">6157条</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="chart-box left-col-charts">
              <div class="chart-title-sm">
                各分拣线分拣关联量对比
                <span class="unit">单位：万条</span>
              </div>
              <div ref="chartLeft1" class="chart-instance"></div>
            </div>

            <div class="chart-box left-col-charts">
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
                  <div class="nums-row">
                    <span
                      v-for="(char, i) in '105.16'.split('')"
                      :key="i"
                      :class="char === '.' ? 'num-dot' : 'num-bg'"
                    >
                      {{ char }}
                    </span>
                  </div>
                  <span class="unit">万条</span>
                </div>
              </div>
              <div class="digital-item">
                <div class="label">当前库存总量</div>
                <div class="digital-box">
                  <div class="nums-row">
                    <span
                      v-for="(char, i) in '71.78'.split('')"
                      :key="i"
                      :class="char === '.' ? 'num-dot' : 'num-bg'"
                    >
                      {{ char }}
                    </span>
                  </div>
                  <span class="unit">万条</span>
                </div>
              </div>
              <div class="digital-item">
                <div class="label">今日出库总量</div>
                <div class="digital-box">
                  <div class="nums-row">
                    <span
                      v-for="(char, i) in '33.38'.split('')"
                      :key="i"
                      :class="char === '.' ? 'num-dot' : 'num-bg'"
                    >
                      {{ char }}
                    </span>
                  </div>
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
              <div class="flow-node node-5">客户签收</div>
            </div>
          </div>

          <!-- 底部两个图表 -->
          <div class="center-bottom">
            <div class="chart-box half">
              <div class="chart-title">
                ◇ 各类型条烟库存量
                <span class="unit">单位：件</span>
              </div>
              <div ref="chartCenterPie" class="chart-instance"></div>
            </div>
            <div class="chart-box half">
              <div class="chart-title">
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
                  <span>条</span>
                </div>
                <div class="stat-label">今日在途总量</div>
              </div>
              <div class="stat-item">
                <div class="stat-value text-white">
                  9821
                  <span>条</span>
                </div>
                <div class="stat-label">正在配送</div>
              </div>
              <div class="stat-item">
                <div class="stat-value text-white">
                  502
                  <span>条</span>
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
  </v-scale-screen>
</template>

<script setup>
import VScaleScreen from 'v-scale-screen'
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
// 注意：实际项目中需要引入地图JSON数据，这里假设已经有了或使用geoCoord模拟
// import chinaJson from '@/assets/china.json';
// echarts.registerMap('china', chinaJson);

const chartLeft1 = ref(null)
const chartLeft2 = ref(null)
const chartCenterPie = ref(null)
const chartCenterBar = ref(null)
const chartRightMap = ref(null)
const chartRightPie = ref(null)

const timeString = ref('')
const dateString = ref('')
const weatherData = ref({
  type: '晴',
  low: '24°C',
  high: '28°C',
  tip: '天气良好',
})
let timer = null

const updateTime = () => {
  const now = new Date()
  dateString.value = now.toLocaleDateString().replace(/\//g, '/')
  timeString.value = now.toTimeString().slice(0, 8)
}

const getWeather = async () => {
  try {
    // 使用免费天气API，这里以贵阳为例
    const res = await axios.get('https://api.vvhan.com/api/weather', {
      params: {
        city: '贵阳',
      },
    })
    if (res.data && res.data.success) {
      const info = res.data.info
      weatherData.value = {
        type: info.type,
        low: info.low,
        high: info.high,
        tip: info.tip,
      }
    }
  } catch (error) {
    console.error('获取天气失败，使用默认数据', error)
  }
}

// ECharts 通用配置 - 深色主题
const commonOption = {
  textStyle: { fontFamily: 'Microsoft YaHei' },
  grid: {
    top: '20px',
    left: '10px',
    right: '10px',
    bottom: '30px',
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
      splitLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.1)', type: 'dashed' },
      },
      axisLabel: { color: '#9aa' },
    },
    series: [
      {
        name: '已分拣',
        type: 'bar',
        stack: 'total',
        barWidth: 25,
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
      splitLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.1)', type: 'dashed' },
      },
      axisLabel: { color: '#9aa' },
    },
    series: [
      {
        name: '已分拣',
        type: 'bar',
        stack: 'total',
        barWidth: 25,
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
      right: 50,
      top: 'center',
      textStyle: { color: '#ccc', fontSize: 10 },
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [
      {
        name: '库存量',
        type: 'pie',
        radius: ['0%', '90%'],
        center: ['35%', '50%'],
        roseType: false,
        label: { show: true, position: 'outer', formatter: '{c}' },
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
      splitLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.1)', type: 'dashed' },
      },
      axisLabel: { color: '#9aa' },
    },
    series: [
      {
        type: 'bar',
        barWidth: 25,
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

  // 5. 右侧：地图
  const myChartRightMap = echarts.init(chartRightMap.value)
  myChartRightMap.showLoading({
    text: '地图加载中...',
    color: '#00ffae',
    textColor: '#fff',
    maskColor: 'rgba(0, 0, 0, 0.2)',
  })

  fetch('/map/guizhou.json')
    .then((response) => response.json())
    .then((geoJson) => {
      myChartRightMap.hideLoading()
      echarts.registerMap('guizhou', geoJson)

      myChartRightMap.setOption({
        tooltip: { trigger: 'item' },
        geo: {
          map: 'guizhou',
          roam: true,
          zoom: 1.2,
          label: {
            show: true,
            color: '#fff',
            fontSize: 10,
          },
          itemStyle: {
            areaColor: 'rgba(13, 33, 41, 0.6)',
            borderColor: '#00ffae',
            borderWidth: 1,
            shadowColor: 'rgba(0, 255, 174, 0.2)',
            shadowBlur: 10,
          },
          emphasis: {
            itemStyle: {
              areaColor: '#2c7be5',
            },
            label: {
              color: '#fff',
            },
          },
        },
        series: [
          {
            name: '物流节点',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [
              { name: '贵阳', value: [106.630154, 26.647661] },
              { name: '遵义', value: [106.927389, 27.725654] },
              { name: '六盘水', value: [104.830359, 26.592666] },
              { name: '安顺', value: [105.9462, 26.25367] },
              { name: '毕节', value: [105.2916, 27.29847] },
              { name: '铜仁', value: [109.189998, 27.731582] },
              { name: '黔西南', value: [104.895465, 25.092056] },
              { name: '黔东南', value: [107.981404, 26.583035] },
              { name: '黔南', value: [107.517156, 26.258219] },
            ],
            symbolSize: 8,
            itemStyle: {
              color: '#00ffae',
            },
            label: {
              show: false,
            },
          },
          {
            type: 'lines',
            coordinateSystem: 'geo',
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3,
            },
            lineStyle: {
              color: '#00ffae',
              width: 1,
              opacity: 0.4,
              curveness: 0.2,
            },
            data: [
              {
                coords: [
                  [106.630154, 26.647661],
                  [106.927389, 27.725654],
                ],
              }, // 贵阳 -> 遵义
              {
                coords: [
                  [106.630154, 26.647661],
                  [104.830359, 26.592666],
                ],
              }, // 贵阳 -> 六盘水
              {
                coords: [
                  [106.630154, 26.647661],
                  [105.9462, 26.25367],
                ],
              }, // 贵阳 -> 安顺
              {
                coords: [
                  [106.630154, 26.647661],
                  [105.2916, 27.29847],
                ],
              }, // 贵阳 -> 毕节
              {
                coords: [
                  [106.630154, 26.647661],
                  [109.189998, 27.731582],
                ],
              }, // 贵阳 -> 铜仁
              {
                coords: [
                  [106.630154, 26.647661],
                  [104.895465, 25.092056],
                ],
              }, // 贵阳 -> 黔西南
              {
                coords: [
                  [106.630154, 26.647661],
                  [107.981404, 26.583035],
                ],
              }, // 贵阳 -> 黔东南
              {
                coords: [
                  [106.630154, 26.647661],
                  [107.517156, 26.258219],
                ],
              }, // 贵阳 -> 黔南
            ],
          },
        ],
      })
    })
    .catch((error) => {
      console.error('地图数据加载失败:', error)
      myChartRightMap.hideLoading()
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
        label: { show: true, position: 'outer', formatter: '{c}' },
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
  getWeather()
  timer = setInterval(updateTime, 1000)
  initCharts()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
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
  src: local('Arial');
  /* 如果有数字字体文件可引入，这里回退 */
}

.dashboard-container {
  width: 1920px;
  height: 1080px;
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
  background: linear-gradient(180deg, #000, #082722);
  background-size: cover;
  border-bottom: 1px solid #0f363f;
}

.title {
  font-size: 26px;
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
  top: 10px;
  font-size: 16px;
  color: var(--accent-cyan);
  display: flex;
  align-items: center;
}

.time-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 15px;
}

.header-info .time {
  color: #fff;
  font-family: 'LCD', sans-serif;
  font-size: 22px;
  line-height: 1;
}

.header-info .date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

/* 布局网格 */
.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 28% 44% 28%;
  padding: 10px 0;
  gap: 10px;
  min-height: 850px;
  /* 增加最小高度，防止非全屏下内容被过度压缩或遮挡 */
}

.column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #082722;
}

/* 通用面板样式 */
.panel {
  padding: 10px;
  position: relative;
}

.panel-title {
  margin: 0 0 15px 0;
  font-size: 24px;
  color: #e0ffff;
  font-weight: normal;
  display: flex;
  align-items: center;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
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
  margin-top: 10px;
  font-weight: 800;
}

/* 进度条部分 */
.progress-section {
  margin-bottom: 15px;
}

.progress-text {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  color: #00d4c7;
  margin-bottom: 5px;
}

.highlight-text {
  margin-left: 30px;
  color: #fff;
  font-size: 20px;
}

.progress-outer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #00d4c7;
  gap: 10px;
}

.custom-progress {
  width: 100%;
  height: 24px;
  background: #39534f;
  display: flex;
  position: relative;
  border-radius: 2px;
  overflow: hidden;
}

.bar-label-right {
  white-space: nowrap;
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
  /* height: 150px; */
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* 关键：允许flex子项收缩 */
}

.left-col-charts {
  margin-top: 30px;
}

.chart-instance {
  width: 100%;
  flex: 1;
  height: auto;
  min-height: 0;
}

.chart-title-sm {
  font-size: 12px;
  color: #fff;
  margin-bottom: 5px;
  flex-shrink: 0;
}

.chart-title {
  font-size: 24px;
  color: #e0ffff;
  margin-bottom: 30px;
  flex-shrink: 0;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

/* 中间列样式 */
.center-h3 {
  margin: 20px 0;
  justify-content: flex-start;
  font-size: 24px;
}

.digital-row {
  display: flex;
  justify-content: space-around;
}

.digital-item {
  text-align: left;
}

.digital-item .label {
  font-size: 12px;
  color: #00d4c7;
  margin-bottom: 16px;
  font-weight: 800;
}

.digital-box {
  display: flex;
  align-items: flex-end;
}

.nums-row {
  display: flex;
  gap: 4px;
}

.num-bg {
  display: inline-block;
  width: 30px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.5);
  box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.2);
  font-size: 28px;
  color: #fff;
  font-weight: 600;
}

.num-dot {
  font-size: 28px;
  font-weight: 600;
  color: #00d4c7;
  margin: 0 2px;
  line-height: 44px;
}

.center-map-area {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 620px;
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
  font-size: 20px;
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
  height: 240px;
  padding: 0 15px;
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.center-bottom .half {
  width: 50%;
}

/* 右侧样式 */
.map-panel {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.map-instance {
  flex: 1;
  width: 100%;
  height: auto;
  /* 地图高度 */
  background: url('');
  /* 可加入网格背景图 */
  background-size: cover;
}

.flex-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.4);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
</style>
