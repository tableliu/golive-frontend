<template>
	<div class="session-wrapper login-bg" >
			<message
			:model = "alert"
			:type = "{model: 'alert'}"
			></message>
		<!-- <Loading v-if="isLoading"></Loading> -->
		<div class="session-right text-xs-center">
			<div class="session-table-cell">
				<div class="session-content">
					<div>
						<img class="login-logo" src="/static/logo.png" alt="site logo" width="70" height="63">
						<h1 class="login-logo-appName" style="display: inline-block">{{ getAppName }}</h1>
					</div>
					<!-- <img
						:src="appLogo"
						class="img-responsive mb-3"
						width="300"
						height="78"
					/> -->
					<!-- <h2 class="mb-3 login-font-white">{{$t('message.loginToAdmin')}}</h2>
					<p class="fs-14 login-font-white">{{$t('message.enterUsernameAndPasswordToAccessControlPanelOf')}} {{brand}}.</p> -->
					<v-form v-model="valid" class="mb-4 login-form">
						<v-text-field
							color="#fff"
							@keyup.enter="submit"
							label="账户"
							v-model="email"
							:rules="emailRules"
							required
						></v-text-field>
						<v-text-field
							@keyup.enter="submit"
							label="密码"
							v-model="password"
							type="password"
							:rules="passwordRules"
							required
						></v-text-field>
						<v-checkbox
							color="primary"
							label="记住密码"
							v-model="rememberAccont"
							class="remember-checkbox"

						></v-checkbox>
						<div class = "waring">{{msg}}</div>
						<!-- <router-link to="">{{$t('message.termsOfService')}}</router-link> -->
						<div>
							<v-btn :loading="isLoading" large @click="submit" block  class="login-btn">{{$t('message.loginNow')}}</v-btn>
						</div>
					</v-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex"
import AppConfig from "@/constants/AppConfig"
import Axios from 'axios'
import Router from '@/router'
export default {
  data() {
    return {
			alert: {
				show: false,
				type: '',
				title: '',
				msg: ''
			},
      isLoading: false,
      valid: false,
      email: "",
			emailRules: [
        v => !!v || "请输入账号"
      ],
      password: "",
      passwordRules: [v => !!v || "请输入密码"],
      appLogo: AppConfig.appLogo2,
      brand: AppConfig.brand,
			rememberAccont: false,
			msg: '',
    };
  },
	computed: {
		getAppName() {
			return AppConfig.appName
		},
		...mapGetters(['getRole', 'getKickMessage'])
	},
	beforeMount() {
		this.closeSocket()
		this.getAlert()
	},
	mounted: function() {
		const _this = this
		const uname = localStorage.getItem('uname')
		const password  = localStorage.getItem('password')
		const remember = localStorage.getItem('remember')
		if(uname && remember) {
			this.email = uname
			this.password = password
			this.rememberAccont = true
		}
		Axios.get('/user/try')
	},
  methods: {
		getAlert() {
			const kick = this.getKickMessage
			if (!kick) {
				return
			}
			this.alert = {
				show: true,
				type: '',
				title: kick.title,
				msg: kick.msg
			}
			this.$store.dispatch(`setKickAction`, null)
		},
		submit() {
			let _this = this
			_this.msg = ""
			const sendData = {
				username: this.email,
				password: this.password,
				remember_me: this.rememberAccont ? 1 : 0
			}
			if(sendData.username === '' || sendData.password === ''  || sendData.pid === '') {
				return
			}
			_this.isLoading = true
			Axios.post('/user/login', sendData)
			.then(function(data){
				//发送成功，接收数据
				const _data = data.data
				switch(_data.code) {
					case 1:
						_data.data.password = sendData.password
						localStorage.setItem('uname', _data.data.staff_name)
						localStorage.setItem('remember', sendData.remember)
						localStorage.setItem('aevterUrl', _data.data.avatar_url)
						localStorage.setItem('userId', _data.data.user_id)
						localStorage.setItem('loginStatus', true)
						_this.$store.dispatch('setUserInfo', {
							user: {
								id: _data.data.user_id,
								username: sendData.username,
								password: sendData.password,
								name: _data.data.staff_name,
								aevterUrl: _data.data.avatar_url,
								library: sendData.pid
							},
							remember: _this.rememberAccont
						})
						_this.msg = ''
						_this.$store.dispatch('setLoginStatus', true)
						if (!_this.getRole) {
							Axios.get('/auth/get-auth')
							.then(res => {
			          if(res.data.code !== 1) return
								const roles = res.data.data[0]
								_this.$store.dispatch('roleActions', {name: roles, vue: _this})
							})
						}
						const history = _this.$store.getters.getHistory
						history.from.fullPath !== '' && history.to.fullPath !== '' && history.from.fullPath !== history.to.fullPath
					  ? Router.push(history.from.fullPath) : Router.replace('/home')
					break
					case 2:
						_this.msg = data.data.msg || '用户名或密码错误'
				}
				setTimeout(() => {
					_this.isLoading = false
				}, 2000)
			})
			.catch(function(err) {
				alert(err)
				_this.isLoading = false
				_this.msg = '登陆失败'
			})

		},
		closeSocket() {
			this.$store.dispatch('setSocketCloseActions', 'liveshow')
		}
  }
};
</script>
<style>
	.v-messages__message {
		line-height: 1.2
	}
	.waring {
		color: #ff5252 !important;
		font-size: 1.2rem;
	}
	.login-btn {
		border-radius: 4px;
	  background: -webkit-linear-gradient(left, #4A6696 , #3EA8C2); /* Safari 5.1 - 6.0 */
	  background: -o-linear-gradient(right, #4A6696, #3EA8C2); /* Opera 11.1 - 12.0 */
	  background: -moz-linear-gradient(right, #4A6696, #3EA8C2); /* Firefox 3.6 - 15 */
	  background: linear-gradient(to right, #4A6696 , #3EA8C2); /* 标准的语法 */
	}
	.login-btn .v-btn__content , .login-btn .v-btn__loading, .v-select__selection {
		color: #fff;
	}
	.remember-checkbox .v-input--selection-controls__input {
		margin: 0 10px 0 0;
	}
	.login-form .v-select-list .v-list__tile__title {
		caret-color: #4b6797 ;
		color: #4b6797 ;
	}
	.login-form .v-select-list .primary--text .v-list__tile__title {
		color: #ccc;
	}
	.login-logo {
		vertical-align: middle;
	}
	.login-logo-appName {
		line-height: 75px;
		color: #fff;
		letter-spacing: 8px;
		vertical-align: middle;
    margin: auto;
	}
</style>
