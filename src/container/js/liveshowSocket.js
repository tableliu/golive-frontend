import Socket from './socketConnect'
import { store } from '@/store/store'
import DateHandel from '@/tools/dateHandel'

const getPosition = function () {
  return new Promise(function(resolve, reject) {
    if(navigator.geolocation){
      //navigator.geolocation.getCurrentPosition这个方法里面有三个参数
      //这个会在界面拉出一个消息框，让用户确认是否允许获取位置,不过pc端我试了都是err，
      //参1，成功后执行的函数
      //参2，失败时执行的函数
      //参3，选项配置，下面是在6000毫秒内结束请求
      navigator.geolocation.getCurrentPosition(
        function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            resolve({
              latitude,
              longitude
            })
        },
        function (err) {
          reject('code: ' + err.code + 'message: ' + err.message)
        },
        {
          // 指示浏览器获取高精度的位置，默认为false
            // enableHighAccuracy: true,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            // timeout: 30000,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            maximumAge: 3000
        }
      )
    }
  });
}

export default function(socketBasePath) {
  const _topic = 'liveshow'
  //如果该socket实例已存在，则跳出执行
  const code = store.getters.getSocketCode(_topic)
  if (code) {
    return
  }
  const socket = new Socket(_topic, socketBasePath)
  socket.ready = e => {
    // 设置liveshow的订阅以及 liveshow socket的全局返回监听
    store.dispatch('subscribeActions', {
      name: _topic,
      subscribeName: 'iip_base',
      callback: handelFunc
    })
    //设置全局的sessioncode
    //name -> socket名称,  data -> 返回的sessioncode
    store.dispatch('setSocketCodeActions', {
      name: _topic,
      data: e
    })
    // 上传位置
    getPosition()
    .then(position => {
      store.dispatch('publishActions', {
        name: 'liveshow',
        publishName: 'rpc/live/update-location',
        data: {
          long: position.longitude,
          lat: position.latitude,
          wamp_session_id: e
        },
        callback: res => {}
      })
    })
    // .catch(err => {
    //   store.commit('setRequest', {
    //     valid: false,
    //     url: ``,
    //     type: 'error',
    //     msg: err
    //   })
    // })

    // 获取所有未注册的callback对象
    const uninstall = store.getters.getRegisterUnfinish(_topic)
    // 如果有未注册的列表,则全部注册
    if (uninstall) {
      uninstall.forEach(item => {
        store.dispatch('socketRegisterActions', {
          name: _topic,
          uri: item.uri,
          callback: item.callback
        })
      })
      // 清空未完成注册列表
      store.dispatch('setRegisterUnfinishEmptyActions', _topic)
    }
    // 获取所有socket连接完毕的callback对象
    const scsc = store.getters.getSocketConnectSuccessCallbacks('liveshow')
    // 如果有,则全部执行
    if (scsc) {
      scsc.forEach(item => {
        if (item.callback) {
          item.callback()
        }
      })
    }
    onCalled()
    onInvite()
    onCalledCancel()
  }
  // 监听socket处理事件
  //topic->订阅名 data->返回的数据
  const handelFunc = function(topic, res) {
    // res.uri = res.uri.toLowerCase()
    const {
      uri,
      data
    } = res
    console.log({
      name: uri,
      data
    })
    const callback = store.getters.getRegisterCallback(_topic, uri)
    if (callback) {
      callback(uri, data)
    }
  }

  // 注册监听:被手持设备呼叫
  const onCalled = function() {
    const _this = this
    store.dispatch('socketRegisterActions', {
      name: 'liveshow',
      uri: 'live/push/called',
      callback: (uri, dat) => {
        store.dispatch('beCalledActions', {
          interface: 'live/push/called',
          calledById: dat.call_user_id,
          calledByName: dat.call_user_name,
          time: DateHandel.getToday()
        })
      }
    })
  }

  // 注册监听:被手持设备呼叫
  const onCalledCancel = function() {
    const _this = this
    store.dispatch('socketRegisterActions', {
      name: 'liveshow',
      uri: 'live/push/called-canceled',
      callback: (uri, dat) => {
        store.dispatch('beCalledCancelActions', {
          interface: 'live/push/called-canceled',
          calledById: dat.call_user_id,
          calledByName: dat.call_user_name,
          time: DateHandel.getToday()
        })
      }
    })
  }

  // 注册监听:PC端被邀请参与观看
  const onInvite = function() {
    const _this = this
    store.dispatch('socketRegisterActions', {
      name: 'liveshow',
      uri: 'live/push/invited',
      callback: (uri, dat) => {
        store.dispatch('beCalledActions', {
          interface: 'live/push/invited',
          room_id: dat.room_id,
          invite_user_wamp_session_id: dat.invite_user_wamp_session_id,
          invite_user_id: dat.invite_user_id,
          calledByName: dat.invite_user_name,
          time: DateHandel.getToday()
        })
      }
    })
  }
}
