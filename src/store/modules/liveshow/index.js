
export default {
  state: {
    called: null,
    calledCancel: null,
    createRoomList: [],
    onlineUsersPoints: [],
    onlineUsersLocale: {
      x: null,
      y: null
    },
    callStreamer: null
  },
  getters: {
    getCalled: state => {
      return state.called
    },
    getCalledCancel: state => {
      return state.calledCancel
    },
    getLiveShowCreateRoomList: state => {
      return state.createRoomList
    },
    getOnlineUsersPoints: state => {
      return state.onlineUsersPoints
    },
    getOnlineUsersLocale: state => {
      return state.onlineUsersLocale
    },
    getCallStreamer: state => {
      return state.callStreamer
    },
  },
  mutations: {
    beCalledMutations(state, obj) {
      state.called = obj
    },
    beCalledCancelMutations(state, obj) {
      state.calledCancel = obj
    },
    addLiveshowRoomListMutations(state, room_id) {
      state.createRoomList.push(room_id)
    },
    delLiveshowRoomListMutations(state, room_id) {
      const index = state.createRoomList.indexOf(room_id)
      if (index > -1) {
        state.createRoomList.splice(index, 1)
      }
    },
    onlineUsersLocaleMutations(state, obj = {x: null, y: null}) {
      state.onlineUsersLocale = obj
    },
    onlineUsersPointsMutations(state, arr) {
      state.onlineUsersPoints = arr
    },
    callStreamerMutations(state, uid) {
      state.callStreamer = uid
    }
  },

  actions: {
    beCalledActions(context, obj = {} ) {
      context.commit('beCalledMutations', obj)
    },
    addLiveshowRoomListActions(context, room_id ) {
      context.commit('addLiveshowRoomListMutations', room_id)
    },
    delLiveshowRoomListActions(context, room_id ) {
      context.commit('delLiveshowRoomListMutations', room_id)
    },
    beCalledCancelActions(context, obj = {} ) {
      context.commit('beCalledCancelMutations', obj)
    },
    onlineUsersLocaleActions(context, obj) {
      context.commit('onlineUsersLocaleMutations', obj)
    },
    onlineUsersPonitsActions(context, arr) {
      context.commit('onlineUsersPointsMutations', arr)
    },
    callStreamerActions(context, uid) {
      context.commit('callStreamerMutations', uid)
    }
  }
}
