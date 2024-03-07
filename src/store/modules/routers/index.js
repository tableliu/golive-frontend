export default {
  state: {
    to: '',
    from: '',
    params: {},
    vue: {}
  },

  getters: {
    getHistory: state => {
      return state
    },
    getParams: state => {
      return state.params
    },
    getCurrentVue: state => {
      return state.vue
    }
  },

  mutations: {
    setRouters(state, obj = {to: '', from: ''}) {
      state.to = obj.to
      state.from = obj.from
    },
    setParams(state, obj) {
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          state.params[i] = obj[i]
        }
      }
    },
    setCurrentVue(state, obj) {
      state.vue = obj
    }
  },
  actions: {
    setRouters(context, obj = {to: '', from: ''}) {
      context.commit('setRouters', obj)
    },
    setParams(context, obj) {
      context.commit('setParams', obj)
    },
    setCurrentVue(context, obj) {
      context.commit('setCurrentVue', obj)
    }
  }
}
