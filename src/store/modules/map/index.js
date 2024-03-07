  const _this = this
  export default {
  state: {
    map: null
  },
  getters: {
    getMaps: state => {
      if (!state.map) {
        const storage = window.localStorage,
        result = JSON.parse(storage.getItem('MapItems'))
        return result
      }
      return state.map
    }
  },
  mutations: {
    mapMutations(state, result) {
      state.map = result
    }
  },

  actions: {
    mapActions(context, arr = [], ) {
      const json = JSON.stringify(arr),
      storage = window.localStorage
      storage.setItem('MapItems',json)
      context.commit('mapMutations', arr)
    }
  }
}
