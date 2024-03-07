<template>
	<div>
    <!-- 邀请提示音 -->
    <toast-bgm :src="bmgSource" style="display:none;"></toast-bgm>
		<Calling :items="calledList" :dialog="showCalling" :done-context="doneContext">
      <template v-slot:actions>
        <template v-if="showClose">
          <v-btn color="blue darken-1" style=" margin:0 !important;" flat @click.native="callStreamer">{{ $t('message.replay') }}</v-btn>
          <v-btn style="background:#e74c3c !important; margin:0 !important;" flat @click.native="showCalling=false;showClose=false">{{ $t('message.close') }}</v-btn>
        </template>
        <v-btn v-else  style="background:#e74c3c !important;" flat @click.native="stopCalling">{{ $t('message.cancel') }}</v-btn>
      </template>
    </Calling>
		<div class="v-customizer">

			<!-- 右侧悬浮群组 -->
			<setting-toolbar
				@click="toggleCustomizer"
				@change="customizerChange"
				:customizerIn="customizerIn"
				background="#27ae60"
				color="#fff"
				icon="person"
				top="5"
				:badge="onlineList.length"
				:tooltip="$t('message.online') + $t('message.users')"
				customClass="customizer-setting-toolbar"
			>
			<v-list-tile>
				<v-list-tile-content>
					<h3 style="text-align:center;">{{$t('message.online') + $t('message.users')}}</h3>
				</v-list-tile-content>
			</v-list-tile>
			<div style="width:80%;margin:0 auto;">
				<v-spacer></v-spacer>
				<v-text-field
					append-icon="search"
					:label="$t('message.TypeKeywordToSearch')"
					single-line
					hide-details
					v-model="search"
					@input="searchOnlineUser(search)"
				>
				</v-text-field>
				<v-spacer></v-spacer>
			</div>
			<div style="margin-top: 10px;"></div>
			<v-list two-line>
        <template v-for="(user, uindex) in onlineList" :class="user.new && 'bounceOut new-item' ">
          <v-list-tile
            avatar
          >
            <v-list-tile-avatar>
              <img :src="$getImageLocation(user.avatar)" >
            </v-list-tile-avatar>

            <v-list-tile-content>
							<!-- <div>
								<div class="customizer-toast customizer-new-message"><v-icon small>fiber_new</v-icon>(新消息)</div>
								<div class="customizer-toast customizer-live-show"><v-icon small>live_tv</v-icon>(正在直播)</div>
							</div> -->
              <v-list-tile-title>
              	<span style="font-size: 12px;">{{ `${user.user_name}${user.full_name && ' (' + user.full_name +') '}` }}</span>
              </v-list-tile-title>
							<v-list-tile-sub-title>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon :color="user.new ? '#fff' : 'primary'" dark v-on="on">{{ user.client_type === 'web' ? 'computer' : 'phone_iphone' }}</v-icon>
                  </template>
                  <span>{{ user.client_type }}</span>
                </v-tooltip>
                <v-tooltip bottom v-if="user.user_id == $user.id">
                  <template v-slot:activator="{ on }">
                    <v-icon :color="user.new ? '#fff' : 'primary'" dark v-on="on">sentiment_satisfied</v-icon>
                  </template>
                  <span>{{ $t("message.self") }}</span>
                </v-tooltip>
                &nbsp
                <span style="color:#ccc;font-size: 10px;">{{ user.role }}</span>
              </v-list-tile-sub-title>
            </v-list-tile-content>
						<v-list-tile-action>
              <template v-if="user.client_type === 'mobile'">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon large @click.stop="call(user.user_id)">
                      <v-icon color="#27ae60">call</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('message.call') }}</span>
                </v-tooltip>
              </template>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider
            v-if="uindex !== onlineList.length - 1"
            :key="uindex"
            :inset="uindex !== onlineList.length - 1"
          ></v-divider>
        </template>
      </v-list>
			</setting-toolbar>
		</div>
	</div>
</template>

<script>
import Calling from '@/views/liveshow/calling.vue'
import { mapGetters } from "vuex";
import SettingToolbar from "@/components/settingToolbar"
import ToastBgm from '@/components/Toast/bgm.vue'
import User from '@/auth/user'

export default {
  components: {
		Calling,
		ToastBgm,
		SettingToolbar
  },
  data() {
    return {
	    bmgSource: '',
      customizerIn: false,
			showClose: false,
			onlineList: [
				// {
				//   id: 1,
				//   user_id: 1,
				//   name: 'zhangsan',
				//   full_name: '张三',
				//   client_type: 'web',
				//   avatar: 'https://cdn.vuetifyjs.com/images/john.jpg'
				// }
			],
			// 在线用户数组(原数组,不可改变)
			originOnlineList: [],
	    calledList: [],
	    showCalling: false,
	    currentUser: null,
	    search: null,
	    searchStatus: false,
	    doneContext: ''
    };
  },
  mounted() {
    this.getUserInfo()
    this.getOnlineUsers()
    this.onCalled()
    this.onUserOnlineOrNot()
  },
  watch: {
    originOnlineList() {
      if (!this.searchStatus) {
        this.onlineList = [...this.originOnlineList]
      }
      this.setOnlinePonits(this.originOnlineList)
    },
    getCallStreamer() {
			if (!this.getCallStreamer) {
				return
			}
      this.call(this.getCallStreamer)
    }
  },
	computed: {
	},
  methods: {
    // toggle customizer
    toggleCustomizer() {
      this.customizerIn = !this.customizerIn;
    },
		customizerChange(v) {
			this.customizerIn = v
		},
		getUserInfo() {
			const auth = new User()
			const user = auth.getUser()
			this.$user = user
    },
    call(userId) {
      this.currentUser = userId
      this.callStreamer()
    },
    getOnlineUsers() {
      const _this = this
      this.$axios.get(`live/get-online-users`)
      .then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          _this.onlineList = dat
          _this.originOnlineList = [..._this.onlineList]
        }else {
          _this.$store.commit('setRequest', {
            valid: false,
            url: ``,
            type: 'error',
            msg: _this.$t("message['Failed To Load Room List']")
          })
        }
      })
    },
    setOnlinePonits(list) {
      this.$store.dispatch('onlineUsersPonitsActions', list)
    },
    callStreamer() {
      const _this = this
      const userId = this.currentUser
      const sessionCode = this.getSocketCode('liveshow')
      this.openBgm()
      this.$axios.post(`live/call-streamer`, {
        called_user_id: userId,
        call_user_wamp_session_id: sessionCode
      })
      .then(res => {
        if (res.data.code === 1) {
          _this.showCalling = true
          const obj = _this.originOnlineList.find(item => {
            return item.user_id === parseInt(userId)
          })
          if (obj) {
            _this.calledList = [{
              id: obj.user_id,
              name: obj.user_name,
              state: 0,
              avatar: _this.$getImageLocation(obj.avatar, 'avatar'),
              user_id: obj.user_id
            }]
          }
        }else {
          _this.showCalling = false
          _this.$store.commit('setRequest', {
            valid: false,
            url: ``,
            type: 'error',
            msg: _this.$t("message['ServerConnectFail']")
          })
          _this.closeBgm()
        }
      })
      _this.$store.dispatch('callStreamerActions', null)
    },
    stopCalling() {
      const _this = this
      const userId = this.currentUser
      const sessionCode = this.getSocketCode('liveshow')
      this.hangupBgm()
      this.$axios.post(`live/call-streamer-cancel`, {
        called_user_id: userId,
        call_user_wamp_session_id: sessionCode
      })
      .then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          if (dat === 1) {
            _this.$store.commit('setRequest', {
    					valid: false,
    					url: ``,
    					type: 'success',
    					msg: _this.$t("message['Cancel the call successfully']")
    				})
          }else {
            _this.$store.commit('setRequest', {
    					valid: false,
    					url: ``,
    					type: 'error',
    					msg: _this.$t("message['Cancel the call Failed']")
    				})
          }
        }else {
          _this.$store.commit('setRequest', {
            valid: false,
            url: ``,
            type: 'error',
            msg: _this.$t("message['ServerConnectFail']")
          })
        }
        _this.closeBgm()
      })
      _this.showCalling = false
    },
    onCalled() {
      const _this = this
      this.$store.dispatch('socketRegisterActions', {
        name: 'liveshow',
        uri: 'live/push/streamer-respond-call',
        callback: (uri, data) => {
          _this.closeBgm()
          // 查看是否被邀请人员，是则修改被邀请人员的进入状态
          let r = _this.calledList.find(item => {
            return item.id === data.called_user_id
          })
          if (r) {
            r.state = data.is_accept ? 1 : -1
          }
          if (data.is_accept === 1) {
            _this.onlineMenu = false
            _this.createLiveRoom(data.created_room_id)
            _this.changeCalledStatus(data)
          }else {
            _this.doneContext = _this.$t("message['The other side rejected your call']")
						_this.showClose = true
          }
        }
      })
    },
		createLiveRoom(room_id) {
			this.$store.dispatch('addLiveshowRoomListActions', room_id)
			if (this.$router.history.current.fullPath !== '/liveshow/index') {
				this.$router.push('/liveshow/index')
			}
		},
    onUserOnlineOrNot() {
      const _this = this
      this.$store.dispatch('socketRegisterActions', {
        name: 'liveshow',
        uri: 'live/push/user-online-offline',
        callback: (uri, data) => {
          // 查看是否被邀请人员，是则修改被邀请人员的进入状态
          let uindex
          let targetUser = _this.originOnlineList.find((item, index) => {
            if (item.user_id === data.user_id) {
              uindex = index
              return true
            }
            return false
          })
          // 如果这个用户是上线的情况
          if (data.is_online > 0) {
            // 如果这个用户不在在线用户列表中,则添加到列表
            if (!targetUser) {
              data.new = true
              _this.originOnlineList.unshift(data)
              setTimeout(() => {
                data.new = false
              }, 3000)
            }
          }else {
            // 如果这个用户是下线的情况，并且用户在列表中，则在列表中删除
            if (targetUser) {
              _this.originOnlineList.splice(uindex, 1)
            }
          }

        }
      })
    },
    // 更改被呼叫者状态(被呼叫者应答后)
    changeCalledStatus(res) {
      const _this = this
      const list = this.calledList
      const noAnswerList = list.filter((item, index) => {
        if (item.id === parseInt(res.called_user_id)) {
          list[index] = {
            id: res.called_user_id,
            name: res.called_user_name,
            avatar: res.called_user_avatar,
            state: res.is_accept ? 1 : -1
          }
        }
        return item.is_accept < 0
      })
      if (noAnswerList.length < 1) {
        _this.showCalling = false
      }
    },
    searchOnlineUser(search) {
      const keyword = search ? search.replace(/\s+/g,"") : null
      if (!keyword || keyword === '') {
        this.onlineList = [...this.originOnlineList]
        this.searchStatus = false
        return
      }
      this.searchStatus = true
      // const list = this.originOnlineList = [...this.onlineList]
      const list = this.originOnlineList, range = ['full_name', 'user_name', 'role']

      const result = list.filter((item, index) => {
        if (item) {
          return Object.keys(item).find((key, i) => {
            if (range.find(r => r === key)) {
              return (item[key] + '').indexOf(keyword) > -1
            }
            return
          })
        }
        return
      })
      this.onlineList = [...result]
    },
    openBgm() {
      // 打开呼叫音乐
      this.bmgSource = "/static/sound/calling.mp3"
    },
    closeBgm() {
      // 关闭呼叫音乐
      this.bmgSource = ""
    },
    hangupBgm() {
      // 打开挂断音乐,并在1秒后关闭
      const _this = this
      this.bmgSource = "/static/sound/hangup.wav"
      setTimeout(() => {
        _this.closeBgm()
      },1000)
    }
  },
  computed: {
    ...mapGetters(["getSocketCode", "getSocket", "getCallStreamer"])
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
</style>
<style media="screen">
.v-customizer .customizer-setting-toolbar {
	z-index: 9999;
}
.new-item {
	-webkit-animation-name: deepToShallow;
	animation-name: deepToShallow;
	-webkit-animation-duration: 5s;
	animation-duration: 5s;
	color: #fff !important;
}
@keyframes deepToShallow {
	from {
		background: none;
	}

	to {
		background: #2c3e50;
	}
}
</style>
