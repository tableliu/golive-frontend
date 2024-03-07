import { store } from '@/store/store'
export default class {
  constructor(name, socketBasePath) {
    this.socketBasePath = socketBasePath
    this.name = name
    this.connectSuccess = false
    this.connect()
  }
  connect() {
    const _this = this
    store.dispatch('socketActions', {
      name: this.name,
      url: this.socketBasePath,
      then(e) {
        _this.connectSuccess = true
        _this.ready(e)
        console.log('Socket Connect Success!')
      },
      close(code, detail) {
        console.warn("Socket Disconnect ErrorCode------" + code)
        if (code === 2) {
          store.commit('setRequest', {
            valid: false,
            url: ``,
            type: 'error',
            msg: `连接socket服务器失败(在线功能不可使用).`
          })
        }else {
        }
        // alert('socket connect error!')
      },
      error(code) {
        console.error("socket connect fail")
        // chrome不支持
        // store.commit('setRequest', {
        //   valid: false,
        //   url: ``,
        //   type: 'error',
        //   msg: `连接socket服务器失败(在线功能不可使用).`
        // })
      }
    })
  }
  publish({ name, data }) {
    const publishName = name
    if (this.connectSuccess) {
      //name -> socket名称, publishName -> 推送名称, data -> 推送内容
      store.dispatch('publishActions', {
        name: this.name,
        publishName,
        data
      })
    }
  }
  subscribe({ name, callback }) {
    const subscribeName = name
    if (this.connectSuccess) {
      //name -> socket名称, subscribeName -> 订阅名称, callback -> 订阅内容更新回调
      store.dispatch('subscribeActions', {
        name: this.name,
        subscribeName,
        callback
      })
    }
  }
  ready(e) {

  }
}
