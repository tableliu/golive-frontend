/**
 * Auth Module
 */

const state = {
  library: null
}

// getters
const getters = {
  getLibrarys() {
    return state.library
  }
}

// mutations
const mutations = {
  libraryMutations(state, payload) {
    state.library = payload
  }
}

// actions
const actions = {
  libraryActions(context, payload) {
    context.commit('libraryMutations', payload)
  }
}

export default {
    state,
    getters,
    actions,
    mutations
}
