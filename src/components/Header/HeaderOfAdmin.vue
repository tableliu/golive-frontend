<!-- Header Structure -->
<template>

	<div id="tour__navbar__1">

		<Alert></Alert>

		<v-toolbar
			class="Vuely-toolbar"
			app
			color="head head-warning"
			fixed
		>
			<div class="full-logo-bar">
				<img class="full-logo" src="/static/logo.png" alt="site logo" width="70" height="63">
				<h3 class="full-logo-appName" style="display: inline-block">{{ getAppName }}</h3>
			</div>
			<div id="tour__navbar__2" class="navbar-right">
				<!-- div-relative -->
				<v-tooltip bottom>
					<template slot="activator">
						<a class="cursor-pointer user-logo-block" @click="toUserInfo" href="javascript:void(0)">
							<img :src="aevterUrl || '/static/avatars/user-13.jpg'" alt="avatar" class="img-responsive user-logo" />
							<span style="margin-right:40px;color:#fff">{{ user.name || user.username }}</span>
						</a>
					</template>
					<span>{{ $t('message.personal') }}</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template slot="activator">
						<language-provider></language-provider>
					</template>
					<span>{{ $t('message.language') }}</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template slot="activator">
						<v-btn @click="help" icon class=" ma-0" dark>
							<v-icon style="font-size: 1.2rem;" color="#4A7CAF">help_outline</v-icon>
						</v-btn>
					</template>
					<span>{{ $t('message.help') }}</span>
				</v-tooltip>
				<v-menu
					v-model="pwdMenu"
					:close-on-content-click="false"
					:nudge-width="200"
					offset-y
				>
				<!-- <v-btn slot="activator" icon class=" ma-0" dark>
					<v-icon small>lock_open</v-icon>
				</v-btn> -->
				<v-btn slot="activator" icon class=" ma-0" dark>
					<v-tooltip bottom>
						<v-icon style="font-size: 1.2rem;" slot="activator">lock_open</v-icon>
						<span>{{ $t('message.changePassword') }}</span>
					</v-tooltip>
				</v-btn>
					<v-card>
						<v-list>
							<v-list-tile avatar>
								<v-list-tile-avatar>
									<img :src="this.aevterUrl || '/static/avatars/user-13.jpg'" alt="i-logo">
								</v-list-tile-avatar>
								<v-list-tile-content>
									<v-list-tile-title>{{ user.name || user.username }}</v-list-tile-title>
									<v-list-tile-sub-title>修改密码</v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>
						</v-list>
						<v-divider></v-divider>
						<v-list>
							<v-list-tile>
								<v-list-tile-action>
									<v-text-field type="password" clearable autofocus v-model="password" label="旧密码："></v-text-field>
								</v-list-tile-action>
							</v-list-tile>
							<v-list-tile>
								<v-list-tile-action>
									<v-text-field type="password" clearable autofocus v-model="passwordConfim" label="新密码："></v-text-field>
								</v-list-tile-action>
							</v-list-tile>
							<v-list-tile>
								<v-list-tile-action>
									<v-text-field type="password" clearable autofocus v-model="passwordConfim2" label="新密码(确认)："></v-text-field>
								</v-list-tile-action>
							</v-list-tile>
						</v-list>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" flat @click="savePwd">保存</v-btn>
						</v-card-actions>
					</v-card>
				</v-menu>
				<v-tooltip bottom>
					<template slot="activator">
						<v-btn @click="logOut" icon class=" ma-0" dark>
							<v-icon small color="#fff">ti-power-off</v-icon>
						</v-btn>
					</template>
					<span>{{ $t('message.logOut') }}</span>
				</v-tooltip>
				<user></user>
			</div>
		</v-toolbar>

	</div>
</template>

<script>
import Sidebar from "../Sidebar/Sidebar.vue";
import Alert from "./Alert.vue"
import LanguageProvider from "./LanguageProvider";
import Notifications from "./Notifications";
import QuickLinks from "./QuickLinks";
import { mapGetters } from "vuex";
import AppLogo from "Components/AppLogo/AppLogo"
import Auth from "@/auth/user"
import Axios from 'axios'
import Router from '@/router'
import AppConfig from "Constants/AppConfig"

export default {
	props: {
		horizontal: {
			default: false,
			type: Boolean
		}
	},
	data() {
		return {
			user: {},
			roles: null,
			pwdMenu: false,
			password: null,
			passwordConfim: null,
			passwordConfim2: null,
			appLogo: AppConfig.darkLogo,
			aevterUrl: null,
			librarys: [],
			activeLibrary: {},
			librarysPersistent: false
		}
	},
	mounted() {
		this.tourStart()
		this.getLibrarys()
		const auth = new Auth()
		const user = auth.getUser()
		this.user = user.user ? user.user : user
		this.aevterUrl = this.userInfo.user ? this.userInfo.user.aevterUrl : this.userInfo.aevterUrl
		if (this.aevterUrl && !(this.aevterUrl.split('/')[0] === 'https:')) {
			this.aevterUrl = this.$API + '/' + this.aevterUrl
		}else if(!this.aevterUrl){
			this.aevterUrl = null
		}
		this.user.aevterUrl = user.aevterUrl || '/static/avatars/user-13.jpg'
		this.role()
	},
	computed: {
		...mapGetters([
			"activeHeaderFilter",
			"getRole",
			"userInfo",
			"getLogoChange",
			"getCurrentVue"
		]),
		requestValid() {
			return this.$store.state.request.num
		},
		getAppName() {
			return AppConfig.appNameOfAdmin
		}
	},
	watch: {
		pwdMenu() {
			if (!this.pwdMenu) {
				this.password = this.passwordConfim = this.passwordConfim2 = null
			}
		},
		'getLogoChange.src'() {
			if (this.getLogoChange.status) {
				this.aevterUrl = this.$API + '/' + this.getLogoChange.src
			}
		}
	},
	methods: {
		toggleSearchForm() {
			this.$store.dispatch('toggleSearchForm');
		},
		logOut() {
			let _this = this
			const auth = new Auth()
			Axios.post('/user/logout')
			.then(res => {
				if(res.data.code === 1) {
					auth.clearStorage()
					// 清空角色信息
					_this.$store.dispatch('roleActions', '')
					if (this.$router.history.current.fullPath === '/home') {
						this.$router.replace('/session/login')
					}else {
						this.$router.replace('/')
					}
				}
			})
		},
		getBack() {
			Router.back()
		},
		goHome() {
			Router.push('/')
		},
		toUserInfo() {
			Router.push('/default/users/user-profile')
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
		},
		savePwd() {
			let _this = this
			const oldPassword = this.password, newPassword = this.passwordConfim, retypePassword = this.passwordConfim2
			if (newPassword !== retypePassword) {
				_this.$store.commit('setRequest', {
					valid: false,
					url: `/user/change-password`,
					type: 'error',
					msg: _this.$t("message['The two new password entries are inconsistent']")
				})
				return
			}
			Axios.post(`/user/change-password`,{
				oldPassword,
				newPassword,
				retypePassword
			})
			.then(res => {
				if (res.data.code === 1) {
					_this.$store.commit('setRequest', {
						valid: false,
						url: `/user/change-password`,
						type: 'success',
						msg: _this.$t("message['Password reset complete']")
					})
					_this.pwdMenu = false
					setTimeout(()=>{
						_this.logOut()
					}, 3000)
				}
			})
		},
		help() {
			window.open('/static/doc/qualisafe检验智能平台产品用户手册.pdf','_blank')
		},
		getLibrarys() {
			const _this = this
			Axios.get(`project/index`)
			.then(res => {
				if (res.data.code === 1) {
					const dat = res.data.data
					_this.librarys = dat
					const obj = dat.find(item => {
						return item.select === true
					}) || {}
					_this.activeLibrary = obj
					_this.$store.dispatch('libraryActions', dat)
					// _this.libraryChange(obj)
				}
			})
		},
		tourStart() {
			const _this = this
				_this.$tours.start('navbar', _this)
		}
	},
	components: {
		appSidebar: Sidebar,
		LanguageProvider,
		Notifications,
		Alert,
		QuickLinks
	}
};
</script>
<style media="screen">
.user-logo{
	border-radius: 50%;
	margin:0 10px -12px 0;
	width: 40px !important;
	height: 40px !important;
}
.user-logo-name {
	margin-right:40px;
	color:#fff;
}
.full-logo{
	display: inline-block;
	margin: 0 20px 0 10px;
	vertical-align:middle;
}
.full-logo-bar {
	display: flex;
	align-items: center;
	height: 100%;
}
.full-logo-bar h3{
	height: 100%;
	line-height: 4.5rem;
	letter-spacing: 5px !important;
}
#tour__navbar__1 .overflow-library {
	box-shadow: none ;
	color: #fff;
}
.accent--text label {
	color: #82b1ff !important;
	caret-color: #82b1ff !important;
}
@media(max-width:960px){
	.full-logo{
		margin: 0 !important;
	}
	.user-logo-block {
		display: none;
	}
	.full-logo-bar h3{
		letter-spacing: 0 !important;
	}
	.full-logo-bar img {
		width: 50px;
		height: 43px;
	}
	.full-logo-appName {
		font-size: 1rem;
	}
}
</style>
