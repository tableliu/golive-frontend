<!-- 组件 -->
<!-- liveshow 地图/表格展示 -->
<template>
  <div id="myMap" :style="{width: '700px', height: getContainerHeight + 'px'}" class="liveshow-myChart">
    <Map
      showInfoWindow
      :height="getContainerHeight"
      noLoading
      :point="points"
      :center="locale"
      :renderDialog="renderCloudDialog"
      :renderPonit="renderPonit"
      :renderLabel="renderLabel"
      :optsSize="{width : 250,height: 160}"
      :listener="listener"
    >
    </Map>
  </div>
</template>
<script>
let _this
import Map from '@/components/Map'
import { mapGetters } from 'vuex'
import User from '@/auth/user'

export default {
  components: {
    Map
  },
  props: {
  },
  data: () => ({
    locale: {
      x: null,
      y: null
    },
    points: [],
    listener: []
  }),
  computed: {
    getContainerHeight() {
      const h = document.body.clientHeight
      return h / 2
    },
		...mapGetters(['getOnlineUsersPoints'])
  },
  watch: {
    getOnlineUsersPoints() {
      _this.initMap()
    }
  },
  mounted() {
    _this = this
    _this.getUserInfo()
  },
  methods: {
    initMap() {
      const onlineList = _this.getOnlineUsersPoints
      onlineList.forEach((item, i) => {
        item.x = item.long
        item.y = item.lat
      });

      _this.points = onlineList
      const self = onlineList.find(item => item.user_id == _this.$user.id)
      if (self) {
        _this.locale = {
          x: self.long,
          y: self.lat
        }
      }else {
        _this.locale = {
          x: onlineList[0].long,
          y: onlineList[0].lat
        }
      }

      _this.startListener()
      // this.point = this.locale = this.getQuery
    },
    startListener() {
      this.listener.push({
        dom: '.liveshow_home_map',
        type: 'click',
        func: _this.callUser
      })
    },
    renderCloudDialog(obj) {
      return `<div class="map-info">
        <img class="mapimg" style="max-width:40px;max-height:40px;" src="${_this.$getImageLocation(obj.avatar, 'avatar')}" alt="头像" />
        <p class="map-info-time">
          用户/姓名：${obj.user_name + (obj.full_name ? ` (${obj.full_name}) ` : '')}
        </p>
        <p class="map-info-time">
          角色：${obj.role}
        </p>
        <p class="map-info-time">
          类型：${obj.client_type === 'web' ? 'PC端' : '手持设备端'}
        </p>
        ${ obj.client_type === 'mobile' ? `<a class="liveshow_home_map map-info-more" data-uid="${obj.user_id}" style="display: flex;align-items: center;margin: auto;"><img class="cursor-pointer" src=${"/static/img/call_black.png"} alt="" /> 呼叫»</a>` : ''}
      </div>`
    },
    renderPonit(obj) {
      let src
      if (obj.client_type === 'web') {
        src = '/static/flag-icons/PC.png'
      }else {
        src = '/static/flag-icons/phone.png'
      }
      return {
        src,
        width: 32,
        height: 32
      }
    },
    renderLabel(obj) {
      return {
        text: obj.user_name + (obj.full_name ? ` (${obj.full_name}) ` : ''),
        offset: {
          left: -40,
          top: 25
        },
        style: {
         color : "#3EA8C2",
         fontSize : "12px",
         height : "18px",
         lineHeight : "16px",
         fontFamily:"微软雅黑",
         border: 'none'
       }
      }
    },
    callUser(event) {
      try {
        const user_id = event.currentTarget.dataset.uid
        _this.$store.dispatch('callStreamerActions', user_id)
      } catch (e) {

      }
    },
    getUserInfo() {
			const auth = new User()
			const user = auth.getUser()
			this.$user = user
    }
  }
}
</script>
<style lang="scss" scoped>
  .liveshow-myChart {
    display: inline-block;
  }
  .liveshow-myChart > div {
    border-radius: 10px;
  }
</style>
