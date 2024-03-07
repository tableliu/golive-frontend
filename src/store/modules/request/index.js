export default {
  state: {
    counter: 0,
    num: 1,
    valid: false,
    url: null,
    type: 'error',
    msg: null
  },
  getters: {
    getRequest: state => {
      return state
    }
  },
  mutations: {
    setRequest(state, result = {valid: false, msg: null}) {
      state.valid = result.valid
      state.url = result.url
      state.type = result.type
      state.msg = result.msg
      state.num++
    },
    countCounter(state, num) {
      num === '++' ? state.counter++ : state.counter--
    }
  },

  actions: {
    setRequest(context, obj) {
      context.commit('setRequest', obj)
    }
  }
}
