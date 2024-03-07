<template>
	<div class="v-customizer">
		<template v-for="item in destroyMessage">
		  <message
		  :model = "item.message"
		  :type = "item.messageType"
		  ></message>
		</template>
		<!-- 右侧悬浮群组 -->
		<setting-toolbar
			@click="toggleCustomizer"
			@change="customizerChange"
			:customizerIn="customizerIn"
			background="#e67e22"
			color="#fff"
			icon="history"
			top="13"
			:badge="roomHistory.length"
			:tooltip="$t('message.room') + $t('message.history')"
			customClass="customizer-setting-toolbar"
		>
			<v-list-tile>
				<v-list-tile-content>
					<h3>{{ $t('message.room') + $t('message.history') }}</h3>
				</v-list-tile-content>
			</v-list-tile>
			<div style="margin-bottom: 10px;"></div>
			<v-list two-line>
        <template v-for="(item, index) in roomHistory">
					<v-tooltip top>
						<template slot="activator">
							<v-card class="elevation-6 customizer-history-card">
		          <v-list-tile
		            :key="item.title"
		            @click="createLiveRoom(item.id)"
		            avatar
		          >
		            <v-list-tile-avatar>
		              <img src="/static/img/tvroom.png" alt="">
		            </v-list-tile-avatar>
		            <v-list-tile-content>
									<div>
										<div v-if="item.newMessage" class="customizer-toast customizer-new-message"><v-icon small>fiber_new</v-icon>(新消息)</div>
										<div v-if="item.liveShow" class="customizer-toast customizer-live-show"><v-icon small>live_tv</v-icon>(正在直播)</div>
									</div>
		              <v-list-tile-title v-html="item.name"></v-list-tile-title>
		            </v-list-tile-content>
		          </v-list-tile>
							</v-card>
		          <!-- <v-divider
		            v-if="item.divider"
		            :key="index"
		            :inset="item.inset"
		          ></v-divider> -->
						</template>
					<span>{{ $t("message['Click to enter the room']")  }}</span>
				</v-tooltip>
        </template>
      </v-list>
		</setting-toolbar>
		<go-top class="app-customizer fixed-back-top"></go-top>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import SettingToolbar from "@/components/settingToolbar"

let _this
export default {
  components: {
		SettingToolbar
  },
  data() {
    return {
      customizerIn: false,
      settings: {
        maxScrollbarLength: 160
      },
			search: '',
      destroyMessage: [],
			message: {
				show: false,
				type: '',
				title: '',
				msg: ''
			},
			messageType: { model: 'alert' },
			roomHistory: []
    };
  },
	mounted() {
		_this = this
    // 加载历史记录
    this.loadRoomHistory()
		this.onRoomDestroy()
	},
  methods: {
    // toggle customizer
    toggleCustomizer() {
      this.customizerIn = !this.customizerIn;
    },
		customizerChange(v) {
			this.customizerIn = v
		},
		createLiveRoom(room_id) {
			// 获取当前用户的socket sessionId
			const sessionId = this.getSocketCode('liveshow')
			// 请求返回房间
			const request = this.$axios.get(`live/back?room_id=${room_id}&wamp_session_id=${sessionId}`)
			request.then(res => {
				if (res.data.code === 1) {
					_this.$store.dispatch('addLiveshowRoomListActions', room_id)
					if (_this.$router.history.current.fullPath !== '/liveshow/index') {
						_this.$router.push('/liveshow/index')
					}
				}else {
					_this.message = {
						show: true,
						type: 'alert',
						title: _this.$t("message.ServerConnectFail"),
						msg: _this.$t("message.FailedToGetBackRoom")
					}
					_this.messageType.model = 'alert'
				}
			})
		},
    // 获取房间历史列表
    loadRoomHistory() {
      const historyOptions = {
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "application/x-mpegURL",
          src: "" //你的m3u8地址（必填）
        }],
        poster: "poster.jpg", //你的封面地址
        width: 150,
        notSupportedMessage: '无法连接到视频服务器，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      }

      this.$axios.get('live/living-room-history')
      .then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          let arr = []
          dat.forEach(({id, name, url}) => {
            historyOptions.sources.src = url
            arr.push({
              id,
              name,
              playerOptions: historyOptions,
							divider: true,
							inset: true
            })
          })
          _this.roomHistory = arr
        }
      })
    },
		/**
		 * 房间被销毁
		 */
		onRoomDestroy() {
			const _this = this
			// 发送消息时候触发的函数
			this.$store.dispatch('socketRegisterActions', {
				name: 'liveshow',
				uri: 'live/push/room-destroy',
				callback: (uri, dat) => {
					debugger
					const roomId = parseInt(dat.room_id)
					const target = _this.roomHistory.find(item => {
						return item.id === roomId
					})
					if (target) {
						_this.loadRoomHistory()
					}
				}
			})
		}
  },
  computed: {
    ...mapGetters(["selectedLocale", "getSocketCode"])
  }
};
</script>

<style scoped>
.customizer-scroll-area {
  position: relative;
  height: 80vh;
}
.fixed-back-top {
	top: 90% !important;
	z-index: 9999;
}
/* .customizer-new-message:after {
	margin-left: 1rem;
	content: "(新消息)";
	font-size: 0.8rem;
	position: absolute;
	color: red;
} */
.customizer-toast {
	margin-right: 0.5rem;
	font-size: 0.8rem;
	display: inline-block;
	align-items: center;
	vertical-align: middle;
}
.customizer-toast i {
	margin-bottom: 2px;
}
.customizer-new-message {
	color: #e74c3c;
}
.customizer-live-show {
	color: #3498db;
}
.customizer-history-card {
	margin: 4px 0;
}
</style>

<style media="screen">
.v-customizer .customizer-setting-toolbar {
	z-index: 9999;
}
</style>
