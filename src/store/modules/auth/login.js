
export default  {
  //初始化用户信息
  state: {
    user: {
      id: '',
      name: '',
      aevterUrl:'',
      loginStatus: {
        code: -1,
        status: false
      }
    },
    token : '',
    msg: '',
    changeLogo: {
      status: false,
      src: null
    },
    libraryStatus: true,
    kick: null
  },
  getters: {
    userInfo: state => {
      return state.user
    },
    getMsg: state => {
      return state.msg
    },
    getLoginStatus: state => {
      return state.user.loginStatus
    },
    getLogoChange: state => {
      return state.changeLogo
    },
    getLibraryStatus: state => {
      return state.libraryStatus
    },
    getKickMessage: state => {
      return state.kick
    },
  },
  mutations: {
    setUserInfo(state,obj) {
      state.user = obj
    },
    setMsg(state, newMsg) {
      state.msg = newMsg
    },
    setLoginStatus(state, status) {
      state.user.loginStatus = status
    },
    setLogoChange(state, status) {
      state.changeLogo.status = status.status
      state.user.aevterUrl = state.changeLogo.src = status.src
      localStorage.setItem('aevterUrl', status.src)
    },
    setLibraryStatus(state, status) {
      state.libraryStatus = status
    },
    setKickMessageMutation(state, obj) {
      if(obj) {
        const { status, title, msg } = obj
        state.kick = {
          status,
          title,
          msg
        }
        return
      }
      state.kick = null
    }
  },
  actions: {
    setUserInfo(context, obj = {name: '', aevterUrl: ''}) {
      context.commit('setUserInfo',obj)
    },
    setLoginStatus(context, status) {
      context.commit('setLoginStatus', status)
    },
    setLogoChange(context, status) {
      context.commit('setLogoChange', status)
    },
    setLibraryStatus(context, status) {
      context.commit('setLibraryStatus', status)
    },
    setKickAction(context, obj) {
      context.commit('setKickMessageMutation', obj)
    }
  }
}
