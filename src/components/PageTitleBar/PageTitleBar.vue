<template>
	<v-container fluid>
			<div id="navbartop" :class="'d-custom-flex align-items-center navbar-left navbar-bottom ' + NativeClass ">
				<!-- 页面顶部提示 -->
				<Alert></Alert>
				<v-navigation-drawer
					v-if="!horizontal"
					app
					fixed
					v-model="drawer"
					:mini-variant.sync="collapseSidebar"
					mini-variant-width="70"
					:width="250"
					class="Vuely-sidebar"
					:style="{backgroundImage: 'url(' + selectedSidebarBgImage.url + ')'}"
					:class="{'background-none': !backgroundImage}"
					:right="rtlLayout"
				>
					<!-- App Sidebar -->
					<app-sidebar></app-sidebar>
				</v-navigation-drawer>
				<v-toolbar
					v-show="false"
					class="Vuely-toolbar"
					app
				>
				</v-toolbar>
				<v-btn @click.stop="getBack" flat icon large color="#7F7F7F">
					<v-tooltip bottom>
						<v-icon slot="activator">keyboard_backspace</v-icon>
						<span>{{ $t('message.fullback') }}</span>
					</v-tooltip>
				</v-btn>
				<!-- <div v-if="!horizontal" >
					<v-tooltip bottom>
						<template slot="activator">
							<v-toolbar-side-icon icon large @click.stop="drawer = !drawer" class="v-step-0"></v-toolbar-side-icon>
						</template>
						<span>{{(drawer ? $t('message.close') : $t('message.open') ) +  $t('message.menus') }}</span>
					</v-tooltip>
				</div>
				<div class="site-logo-wrap d-custom-flex ml-0 align-items-center" v-else>
					<router-link to="/horizontal/dashboard/ecommerce" class="grayish-blue site-logo-img">
						<img src="/static/img/site-logo.png" alt="site logo" width="100" height="30">
					</router-link>
				</div> -->
				<v-tooltip bottom>
					<template slot="activator">
						<quick-links></quick-links>
					</template>
					<span>{{ $t('message.quickLinks') }}</span>
				</v-tooltip>
				<v-btn v-if="roles !== '检验员'" @click.stop="goHome" flat icon  large>
					<v-tooltip bottom>
						<v-icon  color="#7F7F7F" slot="activator">home</v-icon>
						<span>{{ $t('message.home') }}</span>
					</v-tooltip>
				</v-btn>

				<div class="spacer"></div>
				<h5 class="nav-title-text">{{pageBreadcrumb}}</h5>
				<div class="spacer"></div>
				<!-- <v-breadcrumbs>
					<div class="spacer"></div>
					<v-icon slot="divider">chevron_right</v-icon>
					<v-breadcrumbs-item>
						{{pageBreadcrumb}}
					</v-breadcrumbs-item>
				</v-breadcrumbs> -->
		</div>
	</v-container>

</template>

<script>
import {mapGetters} from 'vuex'
import Axios from 'axios'
import Router from '@/router'
import Sidebar from "../Sidebar/Sidebar.vue";
import Alert from "../Header/Alert.vue"

// components
import QuickLinks from "../Header/QuickLinks";

export default {
	props:["NativeClass"],
	components: {
		QuickLinks,
		Alert,
		appSidebar: Sidebar
	},
	data() {
		return {
			horizontal: false,
			drawer: false,
			roles: null
		}
	},
	mounted() {
		this.role()
	},
  computed: {
		...mapGetters([
			"activeHeaderFilter",
			"rtlLayout",
			"backgroundImage",
			"collapseSidebar",
			"activeHeaderFilter",
			"selectedSidebarBgImage",
			"getRole"
		]),
    // computed property to get page breadcrumbs
    pageTitle() {
      return this.$breadcrumbs[0].meta.title;
    },
    pageBreadcrumb() {
			let str = this.$breadcrumbs[0].meta.title
			const s18n = this.$t(str)
      return s18n;
    }
  },
	methods: {
		getBack() {
			Router.back()
		},
		goHome() {
			Router.push('/')
		},
		role() {
			let _this = this
			if (this.getRole) {
				this.roles = this.getRole.name
			}else {
				Axios.get('/auth/get-auth')
				.then(res => {
          if(res.data.code !== 1) return
					_this.roles = res.data.data[0]
				})
			}
		}
	}
};
</script>

<style media="screen">
	.navbar-bottom {
		margin-bottom: 20px;
	}
	.nav-title-text {
		font-size: 1.2rem;
		margin-right: 12%;
	}
</style>
