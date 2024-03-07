<template>
	<div class="userTable-body">
		<page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader>
  	<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<message
				:model = "message"
				:type = "messageType"
				></message>
				<app-card
					customClasses="card-table"
					:fullBlock="true"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-card-title>
						<v-dialog  v-model="dialog" max-width="1000px" persistent>
							<v-btn  slot="activator" flot left color="#fff" class="btn-large">
		            <v-icon color="#4A7BAF">library_add</v-icon>
		            <span class="btn-font-color">新建人员</span>
		          </v-btn>
							<v-card class="v-card-table">
								<Loading v-if="isLoading" opacity="0.9"></Loading>
								<v-card-title>
			            <span class="card-title" >{{ formTitle }}</span>
			          </v-card-title>
								<v-card-text>
			            <v-container grid-list-md>
			              <v-layout wrap>
											<v-flex xs12 sm12 md12 v-show="false">
			                  <v-text-field clearable v-model="edited.editedItem.id" label="编号："></v-text-field>
			                </v-flex>
			                <v-flex xs12 sm12 md12>
			                  <v-text-field clearable autofocus required :rules="required.username" v-model="edited.editedItem.username" label="登陆用户名*："></v-text-field>
			                </v-flex>
			                <v-flex xs12 sm12 md12>
			                  <v-text-field clearable required :rules="required.full_name" v-model="edited.editedItem.full_name" label="真实姓名*："></v-text-field>
			                </v-flex>
											<v-flex xs12 sm12 md12>
												<v-select  hide-details v-bind:items="sexItem"  v-model="edited.editedItem.gender"  label="性别：" ></v-select>
			                </v-flex>
											<v-flex xs12 sm12 md12>
			                  <v-text-field clearable v-model="edited.editedItem.telephone" label="联系方式："></v-text-field>
			                </v-flex>
											<template v-for="(item,index) in edited.editedItem.project_data">
												<v-flex xs12 sm12 md4>
													<Search
														:key="index"
														@bindModel="loadProjectSearch"
														:payload="item"
														label="项目*(输入关键字模糊查询)"
														:loading="libraryLoading"
														:items="librarys"
														:vModelEdit="item.pid"
														item-value="id"
													></Search>
												</v-flex>
												<v-flex xs12 sm12 md3>
													<Search
														:key="index"
														@bindModel="loadRoleSearch"
														:payload="item"
														:clickHandler="loadRole"
														label="角色*(输入关键字模糊查询)"
														:loading="searchLoading"
														:items="item.roles"
														:vModelEdit="item.role"
														multiple
													></Search>
				                </v-flex>
												<v-flex xs12 sm12 md1 style="align-items:center;">
													<v-tooltip top>
														<v-icon
															slot="activator"
															@click.stop="edited.editedItem.project_data.push({pid: null, role: null})"
														>
				                      add
														</v-icon>
														<span>添加</span>
													</v-tooltip>
				                </v-flex>
											</template>

			                <!-- <v-flex xs12 sm6 md6>
			                  <v-text-field v-model="edited.editedItem.workType" label="工种"></v-text-field>
			                </v-flex>
			                <v-flex xs12 sm6 md6>
			                  <v-text-field v-model="edited.editedItem.phone" label="手机号"></v-text-field>
			                </v-flex>
											<v-flex xs12 sm6 md6>
			                  <v-text-field v-model="edited.editedItem.deflection" label="偏向产品"></v-text-field>
			                </v-flex>
											<v-flex xs12 sm6 md6>
			                  <v-text-field v-model="edited.editedItem.localtion" label="工作地"></v-text-field>
			                </v-flex>
											<v-flex xs12 sm6 md6>
			                  <v-text-field v-model="edited.editedItem.certification" label="证书"></v-text-field>
			                </v-flex> -->
			              </v-layout>
			            </v-container>
			          </v-card-text>
								<v-card-actions>
									<div class="v-card-actions-buttons">
										<v-btn :disabled="!$valid.checkInputArr(serializable)" flat @click.native="save">保存</v-btn>
										<v-btn color="blue darken-1" flat @click.native="close">取消</v-btn>
									</div>
		        	  </v-card-actions>
							</v-card>
						</v-dialog>
						<v-spacer></v-spacer>
						<v-text-field
							append-icon="search"
							:label="$t('message.TypeKeywordToSearch')"
							single-line
							hide-details
							v-model="search"
							@focus.once="searchClass.searchFocus"
							@input="searchClass.searchChange(search)"
						>
						</v-text-field>
					</v-card-title>
					<v-data-table
						v-model="selected"
						select-all
						:headers="headers"
						:items="((search || search !== '') && searchClass.response.status) ? searchClass.response.data.result : items"
						:search="search"
						:light="true"
						:loading="isLoad"
						:no-data-text="nodata"
						:no-results-text="noSeachResult"
						:pagination.sync="(search || search !== '' ) ? paginationAll : pagination"
						:rows-per-page-text="$t('message.searchPerpage')"
						:rows-per-page-items="pagination.rowsPerPage_item"
						class="elevation-1"
					>
						<template slot="headers" slot-scope="props">
							<tr>
								<!-- <th>
									<v-checkbox
										:input-value="props.all"
										:indeterminate="props.indeterminate"
										primary
										hide-details
										@click.native="toggleAll"
									></v-checkbox>
								</th> -->
								<th
									v-for="header in props.headers"
									:key="header.value"
									@click.stop="changeSort(header.value)"
									:class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
								  align="center"
								>
									{{ header.text }}
									<v-icon small>arrow_upward</v-icon>
								</th>
							</tr>
						</template>
						<template slot="items" slot-scope="props">
							<tr :active="props.selected" @click="props.selected = !props.selected">
								<!-- <td>
				          <v-checkbox
				            :input-value="props.selected"
				            primary
				            hide-details
				          ></v-checkbox>
				        </td> -->
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.id)"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.username)"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.full_name)"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.gender !== null ? (props.item.gender ? '男' : '女') : '')"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.telephone)"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.pid)"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.role)"></td>
								<!-- <td class="text-xs-center">{{ props.item.wx_user_name }}</td> -->
								<!-- <td class="text-xs-center">{{ props.item.email }}</td> -->
								<!-- <td class="text-xs-center">
									<v-tooltip top>
										<v-icon
											slot="activator"
										>
											{{ props.item.impower ? "done" : "clear"}}
										</v-icon>
										<span>{{ props.item.impower ? "已授权" : "未授权"}}</span>
									</v-tooltip>
								</td> -->
								<td>
									<v-switch
										@click.stop.prevent="changeStatus(props.item)"
										class="switch"
										v-model="!props.item.user_status"
									></v-switch>
								</td>
								<td class="text-xs-center justify-center px-0">
									<!-- <v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="authorize(props.item)"
										>
											done_outline
										</v-icon>
										<span>小程序授权</span>
									</v-tooltip> -->
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="setup(props.item)"
										>
											assignment
										</v-icon>
										<span>用户授权</span>
									</v-tooltip>
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="editItem(props.item)"
										>
											edit
										</v-icon>
										<span>修改</span>
									</v-tooltip>
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="deleteItem(props.item)"
										>
											delete
										</v-icon>
										<span>删除</span>
									</v-tooltip>
								</td>
								<!-- <td class="text-xs-center">{{ props.item.workType }}</td>
								<td class="text-xs-center">{{ props.item.phone }}</td>
								<td class="text-xs-center">{{ props.item.deflection }}</td>
								<td class="text-xs-center">{{ props.item.location }}</td>
								<td class="text-xs-center">{{ props.item.certification }}</td> -->
							</tr>
						</template>
						<template slot="pageText" slot-scope="props">
							<div v-show="!(search || search !== '' )">
								当前 {{ props.pageStart }} - {{ props.pageStop }} 条
							  总数：{{pagination.totalCount ? pagination.totalCount : props.itemsLength }}
							 	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp第 {{pagination.pageFake}} 页	&nbsp 共 {{getPageCountAll}} 页
							</div>
						</template>
					</v-data-table>

					<div v-show="!(search && search !== '' )" class="text-xs-center pt-2">
						<v-pagination v-model="pagination.pageFake" :length="getPageCountAll"></v-pagination>
					</div>
				</app-card>
			</v-layout>
  	</v-container>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Axios from 'axios'
import Search from '@/components/SearchInput'
export default {
	components: {
		Search
	},
  data() {
    return {
			dialog: false,
			pagination: {
				getFullPage: false,
        sortBy: '-id',
				totalCount: 4,
				rowsPerPage: 15,
				perPage: 1,
				page: 1,
				pageFake: 1,
				rowsPerPage_item: [ 15, 30, 50, 100, 1000, { "text": "全部", "value": -1 } ]
      },
      selected: [],
			isLoad: true,
      loader: false,
      serializable: {
				username: [{
					status: false,
					text: `请输入用户名`,
					rule: v => !!v
				}],
				full_name: [{
					status: false,
					text: `请输入姓名`,
					rule: v => !!v
				}]
			},
      tmp: "",
      search: "",
			nodata: '暂无数据',
			noSeachResult: '暂无搜索结果',
      headers: [
        {
          text: "编号ID*",
          sortable: true,
          value: "id"
        },
        { text: "账号*", value: "username" },
				{ text: "真实姓名*", value: "full_name" },
				{ text: "性别*", value: "gender" },
        { text: "联系方式*", value: "telephone" },
				{ text: "所属项目*", value: "pid" },
				{ text: "角色*", value: "role" },
				// { text: "微信昵称*", value: "wx_user_name" },
        // { text: "邮箱", value: "email" },
				// { text: "小程序授权", value: "impower" },
				{ text: "使用状态", value: "user_status" },
				{ text: "操作", value: "name", sortable: false}
        // { text: "工种", value: "workType" },
        // { text: "手机号*", value: "phone" },
        // { text: "偏向产品", value: "deflection" },
        // { text: "居住地", value: "location" },
				// { text: "证书", value: "certification" }
      ],
      items: [],
			edited: {
				editedIndex: -1,
				editedItem: {
					id: 0,
					username: '',
					gender: '',
					// wx_user_name: '',
					telephone: '',
					// email: '',
					full_name: '',
					project_data: [{
						pid: null,
						unit: null,
						role: null
					}],
					selectedLibrary: []
					// workType: '',
					// phone: '',
					// deflection: '',
					// location: '',
					// certification: ''
				},
				defaultItem: {
					id: 0,
					username: '',
					gender: '',
					// wx_user_name: '',
					telephone: '',
					project_data: [{
						pid: null,
						unit: null,
						role: null
					}],
					// email: '',
					full_name: '',
					selectedLibrary: []
					// workType: '',
					// phone: '',
					// deflection: '',
					// location: '',
					// certification: ''
				}
			},
			message: {
				show: false,
				type: '',
				title: '',
				msg: ''
			},
			sexItem: [
				{
				  text: '男',
				  value: 1
				},
				{
				  text: '女',
				  value: 0
				}
			],
			roles: [],
			queryCount: 0,
			isLoading: false,
			searchLoading: false,
			active: {
				roles: {}
			},
			librarys: [],
			libraryLoading: false,
			selectedLibrarySwitch: false
    }
  },
	beforeMount() {
		this.searchClass = new this.$Search({
			type: 'get',
			path: `/user/index?iipsearch=true`,
			body: {}
		}, 5000)
		this.paginationAll = this.searchClass.getDefaultPagination()
	},
  mounted() {
		this.getPageData()
  },
	computed: {
		formTitle() {
      return this.edited.editedIndex === -1 ? '新建人员' : '编辑人员'
	  },
		...mapState({
			loadDone: state => state.usertable.loadDone,
			queryTable: state => state.usertable.queryTable
		}),
		getPageCountAll() {
			return	Math.ceil(this.pagination.totalCount / (this.pagination.rowsPerPage > -1 ? this.pagination.rowsPerPage : this.pagination.totalCount))
		},
		required() {
			return this.$valid.requiredArr(this.serializable)
		},
		selectAllLibrary() {
			return this.edited.editedItem.selectedLibrary.length === this.librarys.length
		},
		selectSomeLibrary () {
      return this.edited.editedItem.selectedLibrary.length > 0 && !this.selectAllLibrary
    },
		icon () {
      if (this.selectAllLibrary) return 'mdi-close-box'
      if (this.selectSomeLibrary) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
	},
	watch: {
		'pagination.pageFake': function() {
			this.selected = []
			if(!this.pagination.getFullPage) {
				this.getPageData()
			}else{
				this.pagination.page = this.pagination.pageFake
			}
		},
    'pagination.rowsPerPage': function() {
      if(!this.pagination.getFullPage) {
				this.getPageData()
			}
    },
		dialog() {
			if (this.dialog) {
				this.loadLibrarys()
			}
		}
	},
  methods: {
		toggleAll () {
        if(this.selected.length) {
				  this.selected = []
				}
        else{
					this.selected = this.items.slice()
				}
    },
		changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
			this.getPageData()
    },
		pagetools() {
			// pagination:{
			// 	page: '第几页',
			// 	rowsPerPage: '每页多少条',
			// 	sortBy: '根据那个字段排序'
			if (!this.pagination.getFullPage) this.getPageData()
		},
		getPageData() {
			const _this = this
			this.isLoad = true
			if(this.pagination.getFullPage){
				const querys = `?sort=${(_this.pagination.descending ? '-' : '') + _this.pagination.sortBy}&page=${_this.pagination.pageFake}&per-page=-1`
	      Axios.get(`/user/index${querys}`)
	      .then(function(res) {
					if (res.data.code === 1) {
						const dat = res.data.data
						const list = dat.result && dat.result !== '' ? dat.result : []
						list.forEach(item => {
							let role = '', pid = ''
							item.project_data.forEach((n, index) => {
								role += n.role + ((index + 1) === item.project_data.length ? '' : '；')
								pid += n.name + ((index + 1) === item.project_data.length ? '' : '，')
							})
							item.role = role
							item.pid = pid
						})
						_this.items = list
						_this.pagination.rowsPerPage = 5
						_this.isLoad = false
					}
	      })
			}else{
				const querys = `?sort=${(_this.pagination.descending ? '-' : '') + _this.pagination.sortBy}&page=${_this.pagination.pageFake}&per-page=${_this.pagination.rowsPerPage}`
	      Axios.get(`/user/index${querys}`)
				.then(res => {
					if (res.data.code === 1) {
						const dat = res.data.data
						const list = dat.result && dat.result !== '' ? dat.result : []
						list.forEach(item => {
							let role = '', pid = ''
							if (item.project_data) {
								item.project_data.forEach((n, index) => {
									role += n.role + ((index + 1) === item.project_data.length ? '' : '；')
									pid += n.name + ((index + 1) === item.project_data.length ? '' : '；')
								})
							}
							item.role = role
							item.pid = pid
						})
						_this.items = list
						_this.items = dat.result && dat.result !== '' ? dat.result : []
						_this.pagination.totalCount = dat.paging ? dat.paging.count : 0
						_this.isLoad = false
					}
				})
			}
		},
		close () {
			const _this = this
			// 关闭dialog，并将this.edited.editedItem初始化
			 this.dialog = false
		 	setTimeout(() => {
			 	_this.edited.editedItem = Object.assign({}, _this.edited.defaultItem)
				_this.edited.editedIndex = -1
			}, 300)
		},
		save () {
			if (this.edited.editedIndex > -1) {
				// 修改
				this.update()
			} else {
				// 添加
				this.addUser()
			}
		},
    addUser() {
			const _this = this
			// 添加
			const dat = this.edited.editedItem
			const projects = dat.project_data.filter(item => {
				return item.pid && item.role
			})
			if (projects.length < 1) {
				_this.$store.commit('setRequest', {
					valid: false,
					url: `user/update?id=${_this.edited.editedItem.id}`,
					type: 'warning',
					msg: `至少需要添加一个 项目/检验单位/角色信息`
				})
				return
			}
			let project_data = []
			projects.forEach(item => {
				project_data.push({
					pid: item.pid,
					role: item.role
				})
			})
			let obj ={
				id: dat.id,
				username: dat.username,
				gender: dat.gender,
				telephone: dat.telephone,
				full_name: dat.full_name,
				project_data: project_data
			}
      Axios.post(`user/create`, obj)
      .then(function(data) {
        switch(data.data.code){
					case 2:
						_this.$valid.formInputErrorHandel({
							code: data.data.code,
							serializable: _this.serializable,
							errObj: data.data.errdata
						})
						break
					case 1:
						_this.close()
						_this.$store.commit('setRequest', {
							valid: false,
							url: `user/create`,
							type: 'success',
							msg: `编号为${data.data.data}的人员添加成功`
						})
						_this.getPageData()
						break
				}
      })
    },
		update() {
			let project_data = []
			this.edited.editedItem.project_data.forEach(item => {
				project_data.push({
					pid: item.pid,
					role: item.role
				})
			})
			const sendData = {
				username: this.edited.editedItem.username || '',
				telephone: this.edited.editedItem.telephone || '',
				full_name: this.edited.editedItem.full_name || '',
				gender: this.edited.editedItem.gender,
				project_data
			}
			let _this = this
			Axios.post(`user/update?id=${this.edited.editedItem.id}`, sendData)
			.then(function(data){
				switch(data.data.code){
					case 0:
					_this.$store.commit('setRequest', {
						valid: false,
						url: `user/update?id=${_this.edited.editedItem.id}`,
						type: 'error',
						msg: `用户修改失败`
					})
						break
					case 1:
						_this.close()
						_this.$store.commit('setRequest', {
							valid: false,
							url: `user/update?id=${_this.edited.editedItem.id}`,
							type: 'success',
							msg: `编号为${data.data.data.id}的人员修改成功`
						})
						_this.getPageData()
						break
					case 2:
						_this.$valid.formInputErrorHandel({
							code: data.data.code,
							serializable: _this.serializable,
							errObj: data.data.errdata
						})
						break
				}
			})
		},
		editItem (item) {
			let _this = this
      this.dialog = true
			this.isLoading = true
			Axios.post(`user/update?id=${item.id}`)
			.then(res => {
				const dat = Object.assign(res.data.data.model_profile, res.data.data.model_user)
				_this.edited.editedIndex = _this.items.indexOf(item)
				_this.edited.editedItem = {
					id: dat.id,
					username: dat.username,
					gender: dat.gender,
					telephone: dat.telephone,
					full_name: dat.full_name,
					project_data: dat.project_data
				}
				setTimeout(() => {
					_this.isLoading = false
				}, 2000)
			})
    },
    deleteItem (item) {
      const index = this.items.indexOf(item)
			let _this = this
			const checked = function(e) {
				if(e) {
					Axios.post(`user/delete?id=${item.id}`)
					.then(function(data) {
						switch(data.data.code){
							case 0:
								_this.$store.commit('setRequest', {
									valid: false,
									url: `user/delete?id=${item.id}`,
									type: 'error',
									msg: data.data.msg
								})
								break
							case 1:
								_this.close()
								_this.$store.commit('setRequest', {
									valid: false,
									url: `user/delete?id=${item.id}`,
									type: 'success',
									msg: `删除成功`
								})
								_this.getPageData()
								break
						}
						_this.message = {
							show: false,
							type: 'alert',
							title: '',
							msg: ''
						}
					})
				}else {
					_this.message = {
						show: false,
						type: 'alert',
						title: '',
						msg: ''
					}
				}
			}
			this.messageType = {model: 'confim', func: checked}
      this.message = {
				show: true,
				important: true,
				type: 'confim',
				title: '确认删除',
				msg: '确认删除此人员？(删除后该人员将无法登陆系统)'
			}
    },
		authorize(item) {
			const _this = this
			Axios.post(`user/impower?id=${item.id}`)
			.then(res => {
				if(res.status === 200) {
					if(res.data.code === 1) _this.$store.commit('setRequest', {
						valid: false,
						url: `user/delete?id=${item.id}`,
						type: 'success',
						msg: `授权成功`
					})
					_this.getPageData()
				}
			})
		},
		setup(item) {
			let stepList = this.pagination
			stepList.back = true
			this.$store.dispatch('setParams', {userTable: stepList})
			this.$router.push(`/control/assign/${item.id}/${item.full_name}`)
		},
		changeStatus(item) {
			let _this = this
			const tempStatus = item.user_status
			item.user_status = !item.user_status
			Axios.post(`user/user-status`, {
				id: item.id,
				type: item.user_status ? 0 : 1
			})
			.then(res => {
				if (res.data.code !== 1) {
					item.user_status = tempStatus
				}
			})
		},
		loadRole(e) {
			if (!e || !e.pid) {
				return
			}
			const _this = this,
			request = Axios.get(`user/get-role-list?pid=${e.pid}`)
			_this.searchLoading = true
			request.then(res => {
				if (res.data.code === 1) {
					const dat = res.data.data
					let arr = [], id = 1
					arr.push({ header: '所有角色' })
					dat.map(item => {
						dat.map(item => {
							arr.push({
								id: id++,
								name: item,
								group: ''
							})
						})
					})
					e.roles = arr
					_this.searchLoading = false
				}
			})
		},
		loadRoleSearch(e, payload) {
			payload.role = e
		},
		loadProjectSearch(e, payload) {
			payload.pid = e
			if (!e || e === '') {
				payload.role = []
			}
			this.loadRole(payload)
		},
		libraryToggle() {
			this.selectedLibrarySwitch = !this.selectedLibrarySwitch
			if (this.selectedLibrarySwitch) {
				this.edited.editedItem.selectedLibrary = [...this.librarys]
			} else {
				this.edited.editedItem.selectedLibrary = []
			}
			this.$nextTick(() => {
      })
		},
		loadLibrarys() {
			let _this = this
			this.libraryLoading = true
			Axios.get(`project/get-project`)
			.then(res => {
				if (res.data.code === 1) {
					const dat = res.data.data
					let arr = []
					arr.push({ header: '所有项目' })
					dat.map(item => {
						arr.push({
							id: item.pid,
							name: item.name
						})
					})
					_this.librarys = arr
					_this.libraryLoading = false
				}
			})
		}
  }
}
</script>
<style scoped media="screen">
	i{
		margin-bottom: 0.15rem !important
	}
	.text-xs-center {
		text-align: center !important
	}
	.card-title {
		width: 100%;
		font-size: 2rem;
		color: rgba(0,0,0,0.54) !important;
		text-align: center !important
	}
	.v-datatable__actions {
		/* display: none !important; */
	}
	.userTable-body .v-input--selection-controls__input,.userTable-body .v-input--switch .v-input__control {
		margin: 0 auto;
	}
</style>
