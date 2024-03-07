import Axios from 'axios'

export default {
  state: {
    queryTable: {},
    loadDone: false
  },

  getters: {
    getQueryTable: state => {
      return state.queryTable
    },
    getTableLoadStatus: state => {
      return state.loadDone
    }
  },

  mutations: {
    queryTableHandler(state, result) {
      state.queryTable = result
      state.loadDone = true
    }
  },

  actions: {
    getUserList(context, obj = {sort: '', page: null, "per-page": null}) {
      const querys = `?sort=${obj.sort}&page=${obj.page}&per-page=${obj["per-page"]}`
      Axios.get(`/user/index${querys}`)
      .then(function(data) {
        if(data) context.commit('queryTableHandler', data.data.data)
      })
      .catch(function(err) {
        throw new Error(err.message)
      })
    }
  }
}
