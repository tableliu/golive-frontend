<template>
	<div class="theme-color">
		<h5 class="text-xs-center mb-3">{{$t('message.selectTheme')}}</h5>
		<v-list>
			<v-list-tile v-for="theme in themes" :key="theme.id" @click="changeTheme(theme)" :class="{'active-theme': selectedTheme === theme}">
				<span :class="theme.bgColor"></span>
			</v-list-tile>
		</v-list>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import Axios from 'axios'

export default {
  computed: {
    ...mapGetters(["themes", "selectedTheme"])
  },
  methods: {
    changeTheme(theme) {
			// theme:1蓝色,2黄色,3绿色,4红色,5靓蓝6浅蓝
      switch (theme.id) {
        case 1:
          this.$store.dispatch("changeTheme", theme);
          this.$vuetify.theme = theme.theme;
          break;
        case 2:
          this.$store.dispatch("changeTheme", theme);
          this.$vuetify.theme = theme.theme;
          break;
        case 3:
          this.$store.dispatch("changeTheme", theme);
          this.$vuetify.theme = theme.theme;
          break;
        case 4:
          this.$store.dispatch("changeTheme", theme);
          this.$vuetify.theme = theme.theme;
          break;
        case 5:
          this.$store.dispatch("changeTheme", theme);
          this.$vuetify.theme = theme.theme;
          break;
        case 6:
          this.$store.dispatch("changeTheme", theme);
          this.$vuetify.theme = theme.theme;
          break;
        default:
          this.$store.dispatch("changeTheme", theme);
          this.$vuetify.theme = theme.theme;
          break;
      }
    }
  }
};
</script>
