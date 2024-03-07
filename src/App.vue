<script type="text/javascript" src='http://api.map.baidu.com/api?v=3.0&ak=y6V4zc7U8r6uQOPopEqtxFZByP8FdUbW'></script>
<template>
  <v-app
	:dark="darkMode"
	id="inspire"
	:class="[{
		'box-layout': boxLayout,
		'collapse-sidebar': collapseSidebar,
		'rtl-layout': rtlLayout
	}]"
  >
    	<router-view></router-view>
      <notifications
        group="loggedIn"
        position="top right"
        animation-type="velocity"
      />
  </v-app>
</template>


<script>
import { mapGetters } from "vuex";
import Axios from 'axios'

export default {
  data() {
    return {
    }
  },
  mounted() {
    // debugger
    document.cookie = 'XDEBUG_SESSION=PHPSTORM;'
    let _this = this
    if (
      this.selectedLocale.locale === "he" ||
      this.selectedLocale.locale === "ar"
    ) {
      this.$store.dispatch("rtlLayout");
    }
		// if (!this.getRole) {
		// 	Axios.get('/top-menu/index')
		// 	.then(res => {
		// 		const roles = res.data.data.assignments[0]
		// 		_this.$store.dispatch('roleActions', {name: roles, vue: _this})
		// 	})
		// }
  },
  computed: {
    ...mapGetters([
      "darkMode",
      "collapseSidebar",
      "boxLayout",
      "rtlLayout",
      "selectedLocale",
      "getRole"
    ])
  }
};
</script>
