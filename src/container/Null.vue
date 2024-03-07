
<!-- App Main Structure -->
<template>
	<div id="nullContainer" class="app-default-layout">
		<Notifi></Notifi>
		<load-model v-if="loading" @done="loadingDone = true;done()"></load-model>
		<template v-else>
			<Alert></Alert>
      <router-view></router-view>
		</template>
	</div>
</template>

<script>
import Alert from '@/components/Header/Alert.vue'
import Notifi from './Notification';
import { mapGetters } from 'vuex'
import LoadModel from './Loading.vue'
export default {
  data() {
    return {
      loading: true,
			loadingDone: false,
			rules: [
				{
					name: 'liveshow',
					callbackName: 'onSocketUp',
					callback: this.socketConnectFunc
				}
			]
    };
  },
  components: {
		Alert,
		Notifi,
		LoadModel
  },
	computed: {
    ...mapGetters(["getSocketCode"])
	},
	mounted() {
		this.listener()
	},
	methods: {
		done() {
			this.loadingDone && (this.loading = false)
		},
		listener() {
			this.routeRulesTest()
		},
		routeRulesTest() {
			const _this = this
			const rules = _this.rules
			rules.forEach((item, i) => {
				_this.$store.dispatch('setSocketConnectSuccessActions', item)
			});

		},
		socketConnectFunc() {
			const testPath = ['/liveshow/index']
			, currentPagePath = this.$route.fullPath
			, isTestPath = testPath.find(item => item === currentPagePath)

			if(isTestPath) {
				this.loadingDone && this.done()
			}
		}
	}
};
</script>

<style scoped>
.app-default-layout {
  height: 100vh;
}
</style>
