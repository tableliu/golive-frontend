export default {
  state: {
    watch: {}
  },

  getters: {
    getTourWatch: state => {
      return state.watch
    }
  },

  mutations: {
    tourWatchMutations(state, result) {
      state.watch = result
    }
  },

  actions: {
    tourWatchActions(context, obj = {}, ) {
      context.commit('tourWatchMutations', obj)
    }
  }
}
