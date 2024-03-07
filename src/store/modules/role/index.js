  import Axios from 'axios'
  export default {
  state: {
    role: null
  },
  getters: {
    getRole: state => {
      return state.role
    }
  },
  mutations: {
    roleMutations(state, result) {
      state.role = result
    }
  },

  actions: {
    //颜色切换
    roleActions(context, obj = {}, ) {
      // themes:1蓝色,2黄色,3绿色,4红色,5靓蓝,6浅蓝
      // filters:1红色,2白色,3黄色,4绿色,5蓝色,6浅蓝
      const themes = this.getters.themes
      const filters = this.getters.headerFilters

      // 暂时关闭切换颜色
      this.dispatch('changeHeaderFilter', filters[6])
      this.dispatch("changeTheme", themes[0])

      context.commit('roleMutations', obj)
      return


      switch (obj.name) {
        case '系统管理员':
          this.dispatch('changeHeaderFilter', filters[0])
          this.dispatch("changeTheme", themes[5])
          obj.vue.$vuetify.theme = themes[3].theme
        break
        case '委托方':
          this.dispatch('changeHeaderFilter', filters[5])
          this.dispatch("changeTheme", themes[5])
          obj.vue.$vuetify.theme = themes[5].theme
        break
        case '项目经理':
          this.dispatch('changeHeaderFilter', filters[3])
          this.dispatch("changeTheme", themes[2])
          obj.vue.$vuetify.theme = themes[2].theme
        break
        case '协调员':
          this.dispatch('changeHeaderFilter', filters[3])
          this.dispatch("changeTheme", themes[2])
          obj.vue.$vuetify.theme = themes[2].theme
        break
        case '检验员':
          this.dispatch('changeHeaderFilter', filters[2])
          this.dispatch("changeTheme", themes[1])
          obj.vue.$vuetify.theme = themes[1].theme
        break
      }
    }
  }
}
