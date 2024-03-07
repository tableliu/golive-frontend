<template lang="html">
  <div id="map" :style="{height: (height || getMapHeight) + 'px'}">
    <loading-span :show="noLoading ? false : loading">
      <h3>加载地图中</h3>
    </loading-span>
  </div>
</template>

<script>
import MapResginter from '@/tools/mapHandel'
import LoadingSpan from '@/components/Loading/loading2'
import Axios from 'axios'

export default {
  props: {
    // 是否显示地图加载遮盖
    noLoading: Boolean,
    // 地图高度(不设置默认为屏幕高度-120)
    height: Number,
    // 地图显示中心点(变更后自动聚焦)
    // x: longitude; y: latitude;
    center: {
      type: Object,
      default: {x: null, y: null}
    },
    // 图层等级(数字越大范围越小)
    zoom: {
      type: Number,
      default: 17
    },
    // 缩放层级(默认缩放4层)
    zoomOut: {
      type: Number,
      default: 4
    },
    // 地图上展示的点
    point: {
      type: Array,
      default: () => []
    },
    // 是否展示信息窗口
    showInfoWindow: {
      type: Boolean,
      default: false
    },
    /*
    `<div class="map-info">
      <h5 class="map-info-title">打卡记录</h5><a class="map-info-history map-info-more" data-uid="${obj.user_id}" class="map-info-more">历史记录»</a>
      <img class='mapimg' src=${obj.images || obj.images !== '' ? this.$API + '/' + obj.images : '/static/no-img.png'} title='查看大图'/>
      <p class="map-info-time">
        姓名：${obj.full_name}
      </p>
      <p class="map-info-time">
        时间：${obj.created_at}
      </p>
      <p class="map-info-time">
        地址：${obj.formatted_address}
      </p>
    </div>`
    */
    // 自定义渲染信息窗口元素模板
    renderDialog: Function,
    // 自定义渲染点模板
    renderPonit: Function,
    // 自定义渲染点介绍文字模板
    renderLabel: Function,
    // 自定义事件(信息窗口打开后监听)
    listener: Array,
    // 信息窗口宽高
    optsSize: {
      type: Object,
      default: {
        width : 250,     // 信息窗口宽度
        height: 350     // 信息窗口高度
      }
    }
  },
  components: {
    LoadingSpan
  },
  data() {
    return {
      x: null,
      y: null,
      loading: false,
      items: [],
      defaultDom: {
        title: '打卡记录',
        a: '历史记录»',
        img: 'images',
        line1_title: '姓名：',
        line1_text: 'full_name',
        line2_title: '时间：',
        line2_text: 'created_at',
        line3_title: '地址：',
        line3_text: 'formatted_address'
      }
    }
  },
  watch: {
    point() {
      this.items = this.point
      this.init()
    },
    center() {
      if (this.$map) {
        const { x, y } = this.center
        const centerPoint = new BMap.Point(x, y)
        , zoom = this.getZoom
        this.$map.centerAndZoom(centerPoint, zoom);
      }
    }
  },
  mounted() {
    this.init()
    // window.onunload = this.clearMapStorage
  },
  computed:{
    getMapHeight() {
      const h = document.body.clientHeight
      return h - 120 - 1
    },
    getArrayAVG() {
      const points = this.items
      if (points.length < 1) {
        return {
          x: 0,
          y: 0
        }
      }
      const avg = points.reduce((total, next) => {
        return {
          x: parseFloat(total.x) + parseFloat(next.x),
          y: parseFloat(total.y) + parseFloat(next.y)
        }
      })
      return {
        x: avg.x / points.length,
        y: avg.y / points.length
      }
    },
    getMathCoo() {
      const points = [...this.items]
      let xArr = [], yArr = []
      points.map((item, index) => {
        xArr.push(parseFloat(item.x))
        yArr.push(parseFloat(item.y))
      })
      const xMax = Math.max(...xArr),
      xMin = Math.min(...xArr),
      yMax = Math.max(...yArr),
      yMin = Math.min(...yArr)
      return {
        x: {
          max: xMax,
          min: xMin
        },
        y: {
          max: yMax,
          min: yMin
        }
      }
    },
    getZoom() {
      const obj = this.getMathCoo,
      max = {
        x: obj.x.max,
        y: obj.y.max
      },
      min = {
        x: obj.x.min,
        y: obj.y.min
      },
      difference = {
        x: max.x - min.x,
        y: max.y - min.y
      }
      if ((difference.x > 0.005 && difference.x < 0.015) || (difference.y > 0.005 && difference.y < 0.01) ) {
        return 18
      }
      else if ((difference.x > 0.01 && difference.x < 0.05) || (difference.y > 0.01 && difference.y < 0.03)) {
        return 18
      }
      else if ((difference.x > 0.02 && difference.x < 0.05) || (difference.y > 0.015 && difference.y < 0.03)) {
        return 17
      }
      else if ((difference.x > 0.03 && difference.x < 0.05) || (difference.y > 0.02 && difference.y < 0.03)) {
        return 16
      }
      else if ((difference.x > 0.04 && difference.x < 0.06) || (difference.y > 0.03 && difference.y < 0.04)) {
        return 15
      }
      return 10
    }
  },
  methods:{
    init() {
      const _this = this
      this.loading = true
      MapResginter(_this.$MAPAPI)
      .then(BMap => {
        _this.loadMap(BMap)
      })
    },
    loadMap(BMap) {
      const _this = this
      this.loading = false
      var map = new BMap.Map("map");//初始化MAP构造函数
      this.$map = map
      // 初始化信息窗口
      const allPoints = this.items,
      cp = allPoints.length === 1 ? allPoints[0] : this.getArrayAVG,
      centerPoint = new BMap.Point(this.center ? this.center.x : cp.x, this.center ? this.center.y : cp.y),
      zoom = this.getZoom

      map.centerAndZoom(centerPoint, zoom);
      for (let i = 0; i < this.items.length; i++) {
        const point = new BMap.Point(_this.items[i].x, _this.items[i].y)
        ,dom = _this.getDialogDom(_this.items[i])
        let marker
        if (_this.renderPonit) {
          const ponitResult = _this.renderPonit(_this.items[i])
          const myIcon = new BMap.Icon(ponitResult.src, new BMap.Size(ponitResult.width,ponitResult.height));
          marker = new BMap.Marker(point, {
            icon: myIcon || null
          })    // 创建标注(自定义图标)
        }else {
          marker = new BMap.Marker(point)    // 创建标注
        }
        marker.setAnimation(BMAP_ANIMATION_BOUNCE) //跳动的动画
        map.addOverlay(marker)
        /*
          如果有地图文本渲染
          renderLabel:
            type: Function,
            result: {
              text: "欢迎使用百度地图，这是一个简单的文本标注哦~",
              offset: {
                left: 30,
                top: -30
              },
              style: {
               color : "red",
               fontSize : "12px",
               height : "20px",
               lineHeight : "20px",
               fontFamily:"微软雅黑"
             }
            }
        */
        if (_this.renderLabel) {
          const labelResult = _this.renderLabel(_this.items[i])
          const opts = {
            position: point,    // 指定文本标注所在的地理位置
            offset: new BMap.Size(labelResult.offset.left, labelResult.offset.top)    //设置文本偏移量
          }
          const label = new BMap.Label(labelResult.text, opts);  // 创建文本标注对象
          label.setStyle(labelResult.style);  //设置文本样式
          map.addOverlay(label)  //添加文本到地图中
        }
        if(!_this.showInfoWindow) {
          continue;
        }
        let infoWindow = new BMap.InfoWindow(dom, _this.optsSize) //创建信息窗口
        // 信息窗口打开时触发
        infoWindow.addEventListener('open', function() {
          const history =  document.querySelector('.map-info-history'),
          img = document.querySelector('.mapimg')

          if (history) {
            history && history.addEventListener('click', _this.dialogClickHandel)
          }
          if (img) {
            img.addEventListener('click', _this.viewBigImg)
            //图片加载完毕重绘infowindow
            img.onload = function (){
              infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
            }
          }
          if (_this.listener) {
            if (_this.listener.length > 0) {
              _this.listener.forEach((item, i) => {
                const { dom, type, func } = item
                const bearer = document.querySelector(dom)
                if (bearer) {
                  bearer.addEventListener(type, func)
                }
              });
            }
          }
        })
        if (_this.items.length === 1) {
          marker.openInfoWindow(infoWindow)
        }
        marker.addEventListener("click", function(){          //添加标注到地图
      	   this.openInfoWindow(infoWindow);
      	})
      }
      // 缩放层级
      for (let i = 0; i < this.zoomOut; i++) {
        map.zoomOut()
      }            // 将标注添加到地图中
      map.enableScrollWheelZoom(true); //设置鼠标放大
      var top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }); // 左上角，添加比例尺
      var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
      map.addControl(top_left_control);
      map.addControl(top_left_navigation);

    },
    addLabelLayout() {

    },
    clearMapStorage() {
      window.localStorage.removeItem('MapItems')
    },
    getDialogDom(obj) {
      if (Object.keys(obj).length < 1) {
        return
      }
      if (this.renderDialog) {
        return this.renderDialog(obj)
      }
      let dom = `<div class="map-info">
    	<h5 class="map-info-title">打卡记录</h5><a class="map-info-history map-info-more" data-uid="${obj.user_id}" class="map-info-more">历史记录»</a>
    	<img class='mapimg' src=${obj.images || obj.images !== '' ? this.$API + '/' + obj.images : '/static/no-img.png'} title='查看大图'/>
      <p class="map-info-time">
        姓名：${obj.full_name}
      </p>
      <p class="map-info-time">
        时间：${obj.created_at}
      </p>
      <p class="map-info-time">
        地址：${obj.formatted_address}
      </p>
    	</div>`
      return dom
    },
    dialogClickHandel(event) {
      const _this = this,
      uid = event.currentTarget.dataset.uid,
      request = Axios.get(`punch-in/index?user_id=${ uid }`)
      this.loading = false
      request.then(res => {
				_this.loading = false
				if (res.data.code === 1) {
					const {result} = res.data.data
					_this.items = result === '' ? [] : result
          _this.items.map(item => {
            item.x = item.longitude
    				item.y = item.latitude
          })
          _this.init()
				}
			})
    },
    viewBigImg(event) {
      const url = event.currentTarget.currentSrc
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="css">
  #map{
  }
  #map .map-info {
    /* width: 330px;
    min-height: 250px; */
  }
  #map .map-info-title {
    margin:0 0 5px 0;
    padding:0.2em 0;
    font-size: 14px;
    color: rgb(77, 77, 77);
    font-weight: bold;
    text-decoration: none;
    display: inline-block;
  }
  #map .map-info-more {
    font-size: 12px;
    color: rgb(61, 109, 204);
    margin-left: 5px;
    text-decoration: none;
  }
  #map .map-info-more:hover {
    text-decoration: underline;
  }
  #map .mapimg {
    display: block;
    width: 100%;
    max-height: 220px;
    margin:0 0 5px 0;
    padding:0.2em 0;
    border-style: none;
    background-repeat: no-repeat;
    box-sizing: inherit;
    cursor: pointer;
    border-radius: 4px;
    object-fit: cover;
    background-size: cover;
  }
  #map .map-info-time {
    margin:0 0 5px 0;
    padding:0.1em 0;
    line-height: 18px;
    font-size: 12px;
    color: rgb(77, 77, 77);
  }
</style>
