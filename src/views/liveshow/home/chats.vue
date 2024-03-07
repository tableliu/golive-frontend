<!-- 组件 -->
<!-- liveshow 地图/表格展示 -->
<template>
  <div id="myChart" :style="{width: '700px', height: getContainerHeight + 'px'}" class="liveshow-myChart"></div>
</template>
<script>
let _this
// 引入百度地图
import MapResginter from '@/tools/mapHandel'

// 按需引入柱状图组件
// import Echars from 'vue-echarts/components/ECharts'
import Echarts from 'echarts'
import 'echarts-gl'
import 'echarts/map/js/world.js'


// 引入提示框、标记线和title组件
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

// 引入地图相关组件
require('echarts/lib/chart/scatter')
// 散点图放大
require('echarts/lib/chart/effectScatter')
// 地图
require('echarts/lib/chart/map')
// 地图BMap
require('echarts/extension/bmap/bmap.js')
// 引入地理坐标数据


export default {
  props: {},
  data: () => ({
    chatOptions: null,
    temp: [
      [
        [104.411103,34.876586],
        [113.094628,35.360325]
      ],
      [
        [104.411103,34.876586],
        [79.243601,38.317244]
      ],
      [
        [104.411103,34.876586],
        [68.646758,49.588653]
      ],
      [
        [104.411103,34.876586],
        [113.021038,63.858633]
      ],
      [
        [104.411103,34.876586],
        [25.597084,68.105826]
      ],
      [
        [104.411103,34.876586],
        [-41.737023,69.230892]
      ],
      [
        [104.411103,34.876586],
        [-41.737023,69.230892]
      ]
    ]
  }),
  computed: {
    getContainerHeight() {
      const h = document.body.clientHeight
      return h / 2
    }
  },
  mounted() {
    _this = this
    _this.Echarts = Echarts
    window.echarts = _this.Echarts
    //   _this.initChat()
    MapResginter(_this.$MAPAPI)
    .then(BMap => {
      window.BMap = BMap
      _this.getChartData()
      // const flights = async function getBrand(){
      //    const json = await require('./flights.json')
      //    return json
      // }
      // flights()
      // .then(data => {
      //   // _this.initChat(data)
      // })
    })
  },
  methods: {
    getChartData(data) {
      _this.$axios.get('live/online-room-chart')
      .then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          let routes = []
          dat.forEach(item => {
            const peoples = item.peoples
            const streamer = item.streamer
            if ((peoples && peoples.length > 0) && streamer) {
              const position = _this.getRoutes({ streamer, peoples })
              routes.push(...position)
            }
          })
          _this.initChat(routes)
        }
      })
    },
    getRoutes({ streamer, peoples }) {
      const arr = peoples.map((item, i) => {
        return [[parseFloat(streamer.lang), parseFloat(streamer.lat)], [parseFloat(item.long), parseFloat(item.lat)]]
        // return [[streamer.lat, streamer.long], [item.lat, item.long]]
      });
      return arr
    },
    initChat(data) {
      const myChart = _this.Echarts.init(document.getElementById('myChart'))
      myChart.hideLoading();
      // const routes = _this.temp
      const routes = data
      // function getAirportCoord(idx) {
      //   return [data.airports[idx][3], data.airports[idx][4]];
      // }
      // var routes = data.routes.map((airline, index) => {
      //
      //   return [
      //     getAirportCoord(airline[1]),
      //     getAirportCoord(airline[2])
      //   ]
      // });
      myChart.setOption({
        geo3D: {
          map: 'world',
          shading: 'realistic',
          silent: true,
          environment: '#333',
          realisticMaterial: {
            roughness: 1,
            metalness: 0
          },
          postEffect: {
            enable: true
          },
          groundPlane: {
            show: false
          },
          light: {
            main: {
              intensity: 0.5,
              alpha: 30
            },
            ambient: {
              intensity: 0
            }
          },
          viewControl: {
            distance: 70,
            alpha: 89,

            panMouseButton: 'left',
            rotateMouseButton: 'right'
          },

          itemStyle: {
            areaColor: '#000'
          },

          regionHeight: 1
        },
        series: [{
          type: 'lines3D',
          coordinateSystem: 'geo3D',

          effect: {
            show: true,
            trailWidth: 5,
            trailOpacity: 1,
            trailLength: 1,
            constantSpeed: 5,
            trailColor: 'green'
          },

          blendMode: 'lighter',

          lineStyle: {
            width: 5,
            opacity: 1,
            color: 'red'
          },

          data: routes
        }]
      });

      window.addEventListener('keydown', function() {
        myChart.dispatchAction({
          type: 'lines3DToggleEffect',
          seriesIndex: 0
        });
      });
      setTimeout(function (){
  	    window.onresize = function () {
  	    	myChart.resize();
  	    }
    	},200)
    }
  }
}
</script>
<style lang="scss">
  .liveshow-myChart {
    display: inline-block;
  }
  #myChart canvas {
    border-radius: 10px;
  }
</style>
