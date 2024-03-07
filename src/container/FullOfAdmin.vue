
<!-- App Main Structure -->
<template>
	<div id="fullContainer" class="app-default-layout">
		<load-model v-if="loading" @done="done"></load-model>
		<template v-else>
			<!-- Global Notifi -->
			<Notifi></Notifi>
			<!-- App Header -->
			<app-header></app-header>
			<!-- App Main Content -->
			<v-content>
				<s-tour></s-tour>
				<!-- App Router -->
				<transition name="router-anim" :enter-active-class="`animated ${selectedRouterAnimation}`">
					<router-view></router-view>
				</transition>
			</v-content>
			<!-- app customizer -->
			<app-customizer></app-customizer>
			<OnlineUser></OnlineUser>
			<HistoryRoom></HistoryRoom>
			<!-- User Tour -->
			<!-- <tour></tour> -->
		</template>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "Components/Header/HeaderOfAdmin.vue";
import Customizer from "Components/Customizer/Customizer";
import OnlineUser from "Components/Customizer/OnlineUser";
import HistoryRoom from "Components/Customizer/HistoryRoom";
import Tour from "Components/Tour/Tour";
import AppConfig from "Constants/AppConfig";
import TM from "Components/Transition";
import Notifi from './Notification';
import LoadModel from './Loading.vue';

export default {
  data() {
    return {
      loading: true
    };
  },
  components: {
    appHeader: Header,
    OnlineUser,
    HistoryRoom,
    Tour,
		TM,
		Notifi,
		LoadModel,
		"app-customizer": Customizer
  },
  computed: {
    ...mapGetters(["selectedRouterAnimation"])
  },
	methods: {
		done() {
			this.loading = false
		}
	}
};
</script>

<style scoped>
.app-default-layout {
  height: 100vh;
}
</style>
