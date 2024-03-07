<template>
	<div>
		<page-title-bar></page-title-bar>
		<message
		:model = "message"
		:type = "{model: 'alert'}"
		></message>
		<v-container fluid grid-list-xl pt-0>
			<v-layout row wrap>
				<v-flex xs12 md12 lg12 sm12 class="col-height-auto">
					<div>
						<div class="profile-head app-card mb-30">
				       <div class="profile-top">
				         <img src="/static/img/profile-banner.jpg" alt="logo" style="width:100%; min-height:165px;" />
				       </div>
				       <div class="profile-bottom border-bottom-light-1">
				         <div class="user-image text-xs-center mb-3">
									 <label class="logo-upload v-btn--left v-btn rounded-circle" for="uploadIpt">
										 <v-avatar
						           :size="100"
						           color="grey lighten-4"
						         >
										 <img
	 										 :src="edited.editedItem.avatar || '/static/avatars/user-13.jpg'"
	 										 class="hand" alt="user images"
		 								 />
						         </v-avatar>

	 								</label>
	 								<input v-show="false" id="uploadIpt" type="file" ref="uploadIpt" @change.prevent="uploadAvatar" name="" value="" >
				         </div>
				         <div class="user-list-content">
				           <div class="text-xs-center">
				             <h3 class="fw-bold" style="margin-left:1.5rem;">{{edited.editedItem.full_name}}</h3>
				           </div>
				         </div>
				       </div>
				     </div>
						<div class="profile-body">
							<v-layout row wrap>
								<v-flex xs12 md12 lg12>
									<app-card
									>
									<v-card-text>
										<v-container grid-list-md>
											<v-layout wrap v-if="!edit">
												<v-flex xs6 sm6 md6 v-show="false">
													<v-text-field readonly v-model="edited.editedItem.id" label="编号："></v-text-field>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-text-field readonly autofocus required v-model="edited.editedItem.username" label="登陆用户名(账号只能修改一次)*："></v-text-field>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-text-field readonly v-model="edited.editedItem.full_name" label="真实姓名*："></v-text-field>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-text-field readonly v-model="edited.editedItem.gender" label="性别："></v-text-field>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-text-field readonly v-model="edited.editedItem.wx_user_name" label="微信昵称*："></v-text-field>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-text-field readonly v-model="edited.editedItem.email" label="邮箱："></v-text-field>
												</v-flex>
											</v-layout>
											<v-layout wrap v-else>
												<v-flex xs6 sm6 md6 v-show="false">
													<v-text-field clearable v-model="edited.editedItem.id" label="编号："></v-text-field>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-text-field clearable autofocus required :rules="[required.username]" v-model="edited.editedItem.username" label="登陆用户名*："></v-text-field>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-text-field clearable required :rules="[required.full_name]" v-model="edited.editedItem.full_name" label="真实姓名*："></v-text-field>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-select  hide-details v-bind:items="sexItem"  v-model="edited.editedItem.gender"  label="性别" ></v-select>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-text-field clearable required :rules="[required.wx_user_name]" v-model="edited.editedItem.wx_user_name" label="微信昵称："></v-text-field>
												</v-flex>
												<v-flex xs6 sm6 md6>
													<v-text-field clearable :rules="[required.email]" v-model="edited.editedItem.email" label="邮箱："></v-text-field>
												</v-flex>
											</v-layout>
											<v-flex xs12 sm12 md12>
												<v-btn v-if="!edit" class="updateBtn" @click="toggle"  readonly primary>修 改</v-btn>
												<v-btn v-else class="updateBtn" @click="update"  primary>保 存</v-btn>
											</v-flex>
										</v-container>
									</v-card-text>
									</app-card>
								</v-flex>
							</v-layout>
						</div>
					</div>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
import User from '@/auth/user'
import Axios from 'axios'
import UploadFile from '@/tools/UploadFile.js'

import {mapGetters} from 'vuex'

export default {
  components: {
  },
	data() {
    return {
			edit: false,
      required: {
				username: v => !!v || `请输入用户名`,
				password: v => !!v || `请输入密码`,
				full_name: v => !!v || `请输入姓名`,
				email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || '邮箱格式不正确.'
          }
			},
			edited: {
				editedIndex: -1,
				editedItem: {
					id: 0,
					username: '',
					password: '',
					gender: '',
					wx_user_name: '',
					email: '',
					full_name: ''
				},
				defaultItem: {
					id: 0,
					username: '',
					avatar: null,
					gender: '',
					wx_user_name: '',
					email: '',
					full_name: ''
				}
			},
			message: {
				show: false,
				type: '',
				title: '',
				msg: ''
			},
			sexItem: [
				{ text: '男' },
				{ text: '女' }
			]
    }
  },
	computed: {
		...mapGetters(['getLogoChange'])
	},
	created() {
		const user = new User()
		this.userinfo = user.getUser().user || user.getUser()
		this.getUserInfo()
	},
	methods: {
		toggle(){
			this.edit = !this.edit
			return this.edit
		},
		getUserInfo(e = false) {
			let _this = this
			Axios.get(`/user/view?id=${this.userinfo.id}`)
			.then(res => {
				const dat = res.data.data
				_this.edited.editedItem = dat
				_this.edited.editedItem.gender = _this.edited.editedItem.gender === 0 ? '女' : '男'
				_this.edited.editedItem.avatar = _this.$getImageLocation(dat.avatar)
				if (e) {
					_this.$store.dispatch('setUserInfo', {
			      id: dat.id,
			      name: dat.username,
			      aevterUrl: _this.$getImageLocation(dat.avatar),
			      loginStatus: _this.userInfo.loginStatus
			    })
					localStorage.setItem('aevterUrl', dat.avatar)
				}
			})
			.catch(err => {
			})
		},
		update() {
			let _this = this
			if(this.edit) {
				const editItem = this.edited.editedItem
				const sendData = {
					username: editItem.username || '',
					new_password : editItem.password || '',
					wx_user_name: editItem.wx_user_name || '',
					email: editItem.email || '',
					full_name: editItem.full_name || '',
					gender: editItem.gender === '女' ? 0 : 1
				}
				Axios.post(`user/personal-setting?id=${editItem.id}`, sendData)
				.then(res => {
					let message = {}
					switch(res.data.code){
						case 0:
						 message= {
							show: true,
							type: 'faild',
							title: '修改失败',
							msg: `修改失败`
						}
							break
						case 1:
							if(res.data.data.code > 0) {
								message = {
									show: true,
									type: 'success',
									title: '修改成功',
									msg: `个人资料修改成功`
								}
							}else{
								message = {
									show: true,
									type: 'success',
									title: '修改成功',
									msg: `个人资料修改成功,账号超过修改限制次数`
								}
							}
							_this.edit = false
							break
					}
					_this.message = message
					setTimeout(() =>{
						_this.message.show = false
					}, 3000)
				})
			}
		},
		// uploadAvatar() {
	  // 	let _this = this
		// 	const target = this.$refs.uploadIpt
		// 	this.files = target.files[0]
		// 	const sizeCheck = new ValidFile(this.files, 5)
		// 	if (!sizeCheck.result.valid) {
		// 		_this.$store.commit('setRequest', {
		// 			valid: false,
		// 			url: ``,
		// 			type: 'warning',
		// 			msg: sizeCheck.result.text
		// 		})
		// 		target.value = null
		// 		return
		// 	}
    //   const fileReader = new FileReader()
		// 	fileReader.onload = function(e) {
		// 		const fileBase = e.target.result
		// 		const equipment_id = Array.from(new Set(_this.selectedIds))
		// 		Axios.post(`user/change-avatar`, {
		// 			id: _this.userinfo.id,
		// 			images: fileBase
		// 		})
		// 		.then(res => {
		// 			target.value = null
		// 			if (res.data.code === 1) {
		// 				_this.getUserInfo(true)
		// 				_this.$store.commit('setRequest', {
		// 					valid: false,
		// 					url: `user/change-avatar`,
		// 					type: 'success',
		// 					msg: '修改成功.'
		// 				})
		// 				_this.$store.dispatch('setLogoChange', {
		// 					status: true,
		// 					src: res.data.data.avatar
		// 				})
		// 			} else if(res.data.code === 2) {
		// 				_this.$store.commit('setRequest', {
		// 					valid: false,
		// 					url: `user/change-avatar`,
		// 					type: 'error',
		// 					msg: '上传失败.'
		// 				})
		// 			}
		// 		})
		// 		.finally(() => {})
		// 	}
		// 	fileReader.readAsDataURL(this.files)
		// },
		uploadAvatar() {
	  	const _this = this
			, target = this.$refs.uploadIpt
			, bucket = 'user_avatar'
			, _instance = new UploadFile({target, bucket})
			, cloundFiles = _instance.defaultUpload(['jpg','jpeg','png','gif','bmp'])

			cloundFiles.then(files => {
				files.forEach((item, index) => {
					_this.uploadToBackend(item)
				})
			})
		},

		// obj: {
		// 	ajaxStatus: true,
		// 	cos,
		// 	url: file.url,
		// 	bucket: file.bucket,
		// 	region: file.region,
		// 	path_name: file.path_name
		// }
		uploadToBackend(obj) {
			const _this = this
			Axios.post(`user/change-avatar`, {
				id: this.userinfo.id,
				images: obj.url
			})
			.then(res => {
				if (res.data.code === 1) {
					_this.getUserInfo(true)
					_this.$store.commit('setRequest', {
						valid: false,
						url: `user/change-avatar`,
						type: 'success',
						msg: _this.$t("message['success']")
					})
					_this.$store.dispatch('setLogoChange', {
						status: true,
						src: _this.$getImageLocation(res.data.data.avatar)
					})
				} else if(res.data.code === 2) {
					_this.$store.commit('setRequest', {
						valid: false,
						url: `user/change-avatar`,
						type: 'error',
						msg: _this.$t("message['faild']")
					})
				}
			})
		}
	}
}
</script>
<style media="screen">
	.updateBtn {
		width: 30%;
		margin: 0 35%;
	}
	.img-logo {
		max-width: 8%;
	}
	.hand{
		cursor: pointer;
		border-radius: 50%;
		width: 100px !important;
		height: 100px !important;
	}
	.logo-upload {
		width: 100px !important;
		height: 100px !important;
	}
</style>
