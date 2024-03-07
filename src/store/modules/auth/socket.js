// import autobahn from 'autobahn'
import '../../../helpers/autobahn'
export default {
  state: {
    baseSocketPath: null,
    socket: {},
    installUnfinish: {},
    callBackList: {}
  },
  getters: {
    getSocket: state => {
      return state.socket
    },
    getSocketCode: state => name => {
      const s = state.socket[name]
      return s ? s.code : null
    },
    // 获取监听uri的处理事件, name->socket对象名  uri->分发名
    getRegisterCallback: state => (name, uri) => {
      const socket = state.socket[name]
      const topicList = socket.uris
      const register = topicList.find(item => {
        return item.name === uri
      })
      return register ? register.callback : null
    },
    // 未安装列表, name->socket对象名
    getRegisterUnfinish: state => name => {
      return state.installUnfinish[name]
    },
    // 未安装列表, name->socket对象名
    getSocketBasePath: state => {
      return state.baseSocketPath
    },
    getSocketConnectSuccessCallbacks: state => (name, callbackName) => {
      const s = state.callBackList[name]

      return callbackName ? s.find(item => {
        return item.callbackName === callbackName
      })
      :
      s
    }
  },
  mutations: {
    socketMutations(state, { name, url, then, close }) {
      const session = new ab.Session
      (
        url,
        then,
        close,
        {'skipSubprotocolCheck': true}
      )
      state.socket[name] = session
      // const connection = new autobahn.Connection({
      //   url: url,
      //   realm: name,
      //   protocols: ['wamp', 'web']
      // })
      // connection.onopen = (session, details) => {
      //   debugger
      //   session.register(name, then);
      // }
      // connection.onclose = close
      // connection.open()
      // state.socket[name] = connection
    },
    // 订阅
    // name -> socket名称, subscribeName -> 需要订阅的对象名称, callback -> 订阅内容更新回调
    subscribeMutations(state, { name, subscribeName, callback }) {
      const session = state.socket[name]
      session.subscribe(subscribeName, callback)
    },
    // 推送
    // name -> socket名称, publishName -> 需要推送的对象名称, data -> 推送的数据
    publishMutations(state, { name, publishName, data, callback }) {
      const session = state.socket[name]
      // session.publish(publishName, JSON.stringify(data))
      const arg = Object.values(data)
      const pro = session.call(publishName, ...arg)
      if (callback) {
        pro.promise.then(res => {
          res = JSON.parse(res)
          callback(res)
        })
      }
    },
    //设置socket的SessionCode
    setSocketCodeMutations(state, { name, data }) {
      const session = state.socket[name]
      session.code = data
    },
    //分发监听uri的处理事件
    socketRegisterMutations(state, { name, uri, callback }) {
      const session = state.socket[name]
      // 如果尚未完成socket连接,则把处理事件放入未完成对象中
      if (!session) {
        let arr = state.installUnfinish[name]
        arr
        ?
        state.installUnfinish[name].push({ uri, callback })
        :
        state.installUnfinish[name] = [{ uri, callback }]
        return
      }
      // 如果有已经有uris监听数组,则往数组添加,否则新建数组添加
      if (session.uris) {
        // 查看uris监听数组内是否含有当前监听,有则重写,无则添加
        const hasUris = session.uris.find(item => {
          return item.name === uri
        })
        if (hasUris) {
          const index = session.uris.indexOf(hasUris)
          session.uris[index] = {
            name: uri,
            callback
          }
        }else {
          session.uris.push({
            name: uri,
            callback
          })
        }
      }else {
        session.uris = [{
          name: uri,
          callback
        }]
      }
    },
    //清空对应名称的未完成注册列表
    setRegisterUnfinishEmptyMutations(state, name) {
      if (state.installUnfinish[name]) {
        state.installUnfinish[name] = null
      }
    },
    setSocketCloseMutations(state, name) {
      if (state.socket.hasOwnProperty(name)) {
        state.socket[name].close()
        delete state.socket[name]
      }
    },
    setSocketBasePathMutations(state, path) {
      state.baseSocketPath = path
    },
    setSocketConnectSuccessMutations(state, { name, callbackName, callback }) {
      const list = state.callBackList
      list[name] = list[name] || []
      const haveCallback = list[name].find((item) => {
        return item.callbackName === callbackName
      })
      if (haveCallback) {
        const index = list[name].indexOf(haveCallback)
        list[name][index] = { callbackName, callback}
      }else {
        list[name].push({ callbackName, callback})
      }
    }
  },

  actions: {
    // 连接socket
    //url->'ws://xxxx:8080', then=>成功回调function, error=>失败回调function
    socketActions(context, obj ) {
      //ab -> autobahn产生的变量,session -> scoket对象
      context.commit('socketMutations', obj)
    },
    // 订阅
    subscribeActions(context, obj) {
      context.commit('subscribeMutations', obj)
    },
    // 推送
    publishActions(context, obj) {
      context.commit('publishMutations', obj)
    },
    //设置socket的code
    setSocketCodeActions(context, val) {
      context.commit('setSocketCodeMutations', val)
    },
    // 设置socket通信监听
    socketRegisterActions(context, obj) {
      context.commit('socketRegisterMutations', obj)
    },
    // 清空所有注册的未执行监听
    setRegisterUnfinishEmptyActions(context, name) {
      context.commit('setRegisterUnfinishEmptyMutations', name)
    },
    // 设置socket关闭
    setSocketCloseActions(context, name) {
      context.commit('setSocketCloseMutations', name)
    },
    // 设置socket域名地址
    setSocketBasePathActions(context, path) {
      context.commit('setSocketBasePathMutations', path)
    },
    // 设置socket连接完成后执行的回调函数
    setSocketConnectSuccessActions(context, obj) {
      context.commit('setSocketConnectSuccessMutations', obj)
    }
  }
}
