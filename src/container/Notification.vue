
<!-- Notification -->
<template>
  <div>
    <message
    :model = "message"
    :type = "messageType"
    ></message>
    <toast-bgm :src="bmgSource"></toast-bgm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Auth from "@/auth/user"
import ToastBgm from '@/components/Toast/bgm.vue'
import DateHandel from '@/tools/dateHandel'
let _this
export default {
  components: {
    ToastBgm
  },
  data() {
    return {
      beCalled: false,
      permissionNow: null,
      bmgSource: '',
			message: {
				show: false,
				type: '',
				title: '',
				msg: ''
			},
      languageFormat: [
				{
					backend: 'en-US',
					frontend: 'en'
				},
				{
					backend: 'zh-CN',
					frontend: 'cn'
				}
			],
			messageType: { model: 'confim', func: this.checked }
    };
  },
	computed: {
		...mapGetters(["getCalled", "getCalledCancel", "getSocketCode", "selectedLocale", "languages"])
	},
  beforeMount() {
    _this = this
  },
  mounted() {
    this.init()
  },
	watch: {
		getCalled() {
      const { calledByName } = this.getCalled
      if (this.permissionNow === 'granted') {
        this.notifi(calledByName)
      }
      this.beCalled = true
			this.message = {
				show: true,
				type: 'confim',
				title: _this.$t("message['Job Calling']"),
        confimText: _this.$t("message['accept']"),
        cancelText: _this.$t("message['reject']"),
				msg: _this.beCalledMessage(calledByName)
			}
      this.messageType = { model: 'confim', func: this.checked }
      this.bmgSource = '/static/sound/calling2.wav'
		},
    getCalledCancel() {
      if (!this.beCalled) {
        return
      }
      const itf = this.getCalledCancel.interface
      const cancelByName = this.getCalledCancel.cancelByName
      let title, text
      switch (itf) {
        case 'live/push/Invited-canceled':
          title = _this.$t("message['Invitation']")
          text = _this.$t("message['WatchInvitation']")
          break;
        default:
          title = _this.$t("message['Calling']")
          text = _this.$t("message['AssistCalling']")
      }
			this.message = {
				show: true,
				type: 'alert',
				title: title + _this.$t("message['cancel']"),
				msg: _this.$t("message['cancel']") + text
			}
      this.messageType = { model: 'alert' }
      this.closeBgm()
    }
	},
	methods: {
    init() {
      this.getLanguages()
      this.onKick()
      this.checkNotifiLicense()
      this.onInviteCancel()
    },
    onKick() {
      const _this = this
      // 人员被踢出时触发函数
      this.$store.dispatch('socketRegisterActions', {
        name: 'liveshow',
        uri: 'base/push/kicked',
        callback: (uri, dat) => {
          _this.notifi2()
          _this.logOut()
          _this.$store.dispatch(`setKickAction`, {
            status: true,
            title: _this.$t("message['remind']"),
            msg: _this.$t("message['Your account has been logged in elsewhere, please log in again']")
          })
        }
      })
    },
		logOut() {
			let _this = this
			const auth = new Auth()
			this.$axios.post('/user/logout')
			.then(res => {
				if(res.data.code === 1) {
					auth.clearStorage()
					// 清空角色信息
					_this.$store.dispatch('roleActions', null)
					if (_this.$router.history.current.fullPath === '/home') {
            _this.$router.replace('session/login')
					}else {
						this.$router.replace('/')
					}
				}
			})
		},
    checkNotifiLicense() {
      const _this = this
      const NotificationInstance = Notification || window.Notification
      if (!!NotificationInstance) {
        const setPermission = function(){
          //请求获取通知权限
          NotificationInstance.requestPermission(function (PERMISSION) {
            if (PERMISSION === 'granted') {
              _this.permissionNow = PERMISSION
            } else {
              console.log('用户无情残忍的拒绝了你!!!');
            }
          })
        }
        const permissionNow = this.permissionNow = NotificationInstance.permission;
        //允许通知
        if (permissionNow === 'granted') {
            // CreatNotification();
        } else if (permissionNow === 'denied') {
            console.log('用户拒绝了你!!!');
        } else {
            setPermission();
        }
      }
    },
    notifi(name) {
      const n = new Notification('Qualisafe检验智能平台', {
        body: `${name} ${_this.$t("message['is calling you, click to view']")}`,
        tag: 'beCalled',
        icon: '/static/img/call.png',
        data: {
            url: 'http://localhost:8080/liveshow/index'
        },
        timestamp: 1000
      });
      n.onshow = function () {
          // console.log('通知显示了！');
      }
      n.onclick = function (e) {
          //可以直接通过实例的方式获取data内自定义的数据
          //也可以通过访问回调参数e来获取data的数据
          // window.open(n.data.url, '_blank');
          window.focus()
          n.close();
      }
      n.onclose = function () {
          console.log('你墙壁了我！！！');
      }
      n.onerror = function (err) {
          console.log('出错了，小伙子在检查一下吧');
          throw err;
      }
      // 延时5秒关闭notifi,若不关闭则会进入windows提醒待处理列表,后面的notifi不会生效
      setTimeout(() => {
        n.close();
      }, 5000)
    },
    notifi2() {
      const n = new Notification('Qualisafe检验智能平台', {
        body: _this.$t("message['Your account has been logged in elsewhere, please log in again']"),
        tag: 'beKick',
        icon: '/static/img/warning.png',
        data: {
            url: 'http://localhost:8080'
        },
        timestamp: 1000
      });
      n.onshow = function () {
          // console.log('通知显示了！');
      }
      n.onclick = function (e) {
          //可以直接通过实例的方式获取data内自定义的数据
          //也可以通过访问回调参数e来获取data的数据
          // window.open(n.data.url, '_blank');
          n.close();
      }
      n.onclose = function () {
      }
      n.onerror = function (err) {
          throw err;
      }
      // 延时5秒关闭notifi,若不关闭则会进入windows提醒待处理列表,后面的notifi不会生效
      setTimeout(() => {
        n.close();
      }, 5000)

    },
		checked(e) {
      this.beCalled = false
      // e-> true/false 接受或拒绝
      if (e) {
        this.closeBgm()
      }else {
        this.hangupBgm()
      }
      switch(this.getCalled.interface) {
        case 'live/push/called':
          this.calledHandel(e)
        break
        case 'live/push/invited':
          this.inviteHandel(e)
        break
      }
		},
    calledHandel(e) {
      const _this = this
      this.message.show = false
      // 呼叫人相关信息
      const { calledById } = this.getCalled
      const code = this.getSocketCode('liveshow')
      const request = this.$axios.post('live/respond-streamer-call', {
        call_user_id: calledById,
        is_accept: e ? 1 : 0,
        respond_user_wamp_session_id: code
      })
      request.then(res => {
        // 如果接受邀请,进入liveshow页面,创建房间
        if (e) {
          if (res.data.code === 1) {
            const dat = res.data.data
            const room_id = dat.created_room_id
            _this.$store.dispatch('addLiveshowRoomListActions', room_id)
            if (_this.$router.history.current.fullPath !== '/liveshow/index') {
              _this.$router.push('/liveshow/index')
            }
          }
        }
      })
      request.catch(res => {
        _this.$store.commit('setRequest', {
          valid: false,
          url: ``,
          type: 'error',
          msg: _this.$t("message['Failed to join the room, you have already joined the room or the room does not exist']")
        })
      })
    },
    inviteHandel(e) {
      const _this = this
      this.message.show = false
      const { room_id, invite_user_wamp_session_id } = this.getCalled
      const code = this.getSocketCode('liveshow')
      const request = this.$axios.post('live/respond-attend-invite', {
        room_id: room_id,
        is_accept: e ? 1 : 0,
        invited_user_wamp_session_id: code,
        invite_user_wamp_session_id: invite_user_wamp_session_id
      })
      request.then(res => {
        if (e) {
          if (res.data.code === 1) {
            const dat = res.data.data
            _this.$store.dispatch('addLiveshowRoomListActions', room_id)
            if (_this.$router.history.current.fullPath !== '/liveshow/index') {
              _this.$router.push('/liveshow/index')
            }
          }
        }
      })
    },
    openBgm() {
      // 打开呼叫音乐
      this.bmgSource = "/static/sound/calling2.wav"
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
    },
    onInviteCancel() {
      const _this = this
      // 人员离开或加入时的socket触发函数
      this.$store.dispatch('socketRegisterActions', {
        name: 'liveshow',
        uri: 'live/push/invited-canceled',
        callback: (uri, dat) => {
          const { room_id, invite_user_wamp_session_id, invite_user_id } = this.getCalled
          const bool = dat.room_id === room_id && dat.invite_user_wamp_session_id === invite_user_wamp_session_id && dat.invite_user_id === invite_user_id
          if (bool) {
            _this.$store.dispatch('beCalledCancelActions', {
              interface: 'live/push/Invited-canceled',
              cancelById: dat.invite_user_id,
              cancelByName: '对方',
              time: DateHandel.getToday()
            })
          }
        }
      })
    },
    beCalledMessage(calledByName) {
      const locale = this.selectedLocale.locale
      return locale === 'en' ? `You are being called by ${calledByName}, do you accept the answer? (Automatically enter the room after accepting)` : `您正在被 ${calledByName} 呼叫,是否接受应答?(接受后自动进入房间)`
    },
		getLanguages() {
			_this.$axios.get("user/get-language-list")
			.then(res => {
				if (res.data.code === 1) {
					const dat = res.data.data
					dat.forEach((item, i) => {
						const language = _this.languageFormat.find(lan => {
							return lan.backend === item.language
						})
						const target = _this.languages.find(lan => {
							return lan.locale === language.frontend
						})
						if (item.select) {
							_this.$i18n.locale = target.locale;
							_this.$store.dispatch("changeLanguage", target);
						}
					});
				}
			})
		}
	}
};
</script>

<style scoped>
.vAlert{
	z-index:9999;
	position:fixed !important;
	width:100%;
	top:0;
}
.app-default-layout {
  height: 100vh;
}
</style>
