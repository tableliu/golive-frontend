<!-- /video-library/index -->
<!-- 现场作业 -> 视频作业 -->
<template>
	<div>
		<page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader>
  	<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<v-dialog  v-model="dialog" max-width="600px" persistent>
					<v-btn  slot="activator" flot left color="#fff" class="btn-large">
            <v-icon color="#4A7BAF">library_add</v-icon>
            <span class="btn-font-color">{{ $t("message['Create Job']") }}</span>
          </v-btn>
					<v-card class="v-card-table">
						<Loading v-if="isLoading"></Loading>
						<v-card-title>
	            <span class="card-title" >{{ formTitle }}</span>
	          </v-card-title>
						<v-card-text>
	            <v-container grid-list-md>
	              <v-layout wrap>
	                <v-flex xs12 sm12 md12>
	                  <v-text-field clearable autofocus required :rules="required.name" v-model="edited.editedItem.name" :label="$t('message.name') + '*：'"></v-text-field>
	                </v-flex>
									<v-flex xs12 sm12 md12>
	                  <v-text-field clearable v-model="edited.editedItem.remark" :label="$t('message.remark') + '：'"></v-text-field>
	                </v-flex>
	                <v-flex xs12 sm12 md12>
										<v-radio-group v-model="edited.editedItem.status" row>
											<label class="theme--light v-label">{{$t('message.status') + '：'}}</label>
											<v-spacer></v-spacer>
								      <v-radio :label="$t('message.enable')" value="1" color="green"></v-radio>
								      <v-radio :label="$t('message.disable')" value="0" color="red"></v-radio>
								    </v-radio-group>
	                </v-flex>
	              </v-layout>
	            </v-container>
	          </v-card-text>
						<v-card-actions>
	            <div class="v-card-actions-buttons">
								<v-btn :disabled="!$valid.checkInputArr(serializable)" color="blue darken-1" flat @click.native="save">{{ $t("message.save") }}</v-btn>
								<v-btn color="blue darken-1" flat @click.native="close">{{ $t("message.cancel") }}</v-btn>
							</div>
          </v-card-actions>
					</v-card>
				</v-dialog>
				<message
				:model = "message"
				:type = "messageType"
				></message>
				<app-card
					customClasses="card-table custom-app-card"
					:fullBlock="true"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-card-title>
						<v-spacer></v-spacer>
						<v-text-field
							append-icon="search"
							:label="$t('message.TypeKeywordToSearch')"
							single-line
							hide-details
							v-model="search"
						>
						</v-text-field>
					</v-card-title>
					<v-data-table
						v-model="selected"
						select-all
						:headers="formatHeaders"
						:items="items"
						:search="search"
						:light="true"
						:loading="isLoad"
						:no-data-text="nodata"
						:no-results-text="noSeachResult"
						:pagination.sync="(search || search !== '' ) ? paginationAll : pagination"
						:rows-per-page-text="$t('message.searchPerpage')"
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
									@click="changeSort(header.value)"
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
								<td class="text-xs-center justify-center px-0">

									<v-tooltip top>
											<v-switch
												 slot="activator"
												class="switch"
												v-model="props.item.status === '0' ? false : true"
												@change="swapSatus(props.item)"
											></v-switch>
		                <span>{{ $t("message.status") + "：" +  (props.item.status === '0' ? $t("message.disable") : $t("message.enable"))}}</span>
		              </v-tooltip>
								</td>
								<td class="text-xs-center">
									<v-tooltip top>
										<template slot="activator">
											<a @click="checkDetail(props.item)">
												<span>{{ props.item.name }}</span>
												<v-icon light>mode_edit</v-icon>
											</a>
										</template>
										<span>{{ $t("message['Click to edited step details']") }}</span>
									</v-tooltip>

								</td>
								<td class="text-xs-center">{{ props.item.remark }}</td>
								<td class="text-xs-center">{{ props.item.created_by }}</td>
								<td class="text-xs-center">{{ props.item.created_at }}</td>
								<td class="text-xs-center justify-center px-0">
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="edit(props.item)"
										>
                      assignment
										</v-icon>
										<span>{{ $t("message['Check/View']") }}</span>
									</v-tooltip>
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="deleted(props.item)"
										>
                      delete
										</v-icon>
										<span>{{ $t("message.delete") }}</span>
									</v-tooltip>
								</td>
							</tr>
						</template>
						<template slot="pageText" slot-scope="props">
							<div v-show="!(search || search !== '' )">
								{{ $t('message.now') }} {{ props.pageStart }} - {{ props.pageStop }} {{ $t('message.searchNum') }}
								{{ $t('message.searchSum') }}：{{pagination.totalCount ? pagination.totalCount : props.itemsLength }}
								&nbsp	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp {{ $t('message.searchAt') }} {{pagination.pageFake}} {{ $t('message.searchPages') }}	&nbsp {{ $t('message.searchTotal') }} {{getPageCountAll}} {{ $t('message.searchPages') }}
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
import Router from '@/router'
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
			dialog: false,
			pagination: {
				getFullPage: false,
        sortBy: 'name',
				totalCount: 4,
				rowsPerPage: 10,
				perPage: 10,
				page: 1,
				pageFake: 1
      },
      selected: [],
			isLoad: true,
      loader: false,
      serializable: {
				name: [{
					status: false,
					text: `请输入作业名称`,
					rule: v => !!v
				}]
			},
      search: "",
			nodata: '暂无数据',
			noSeachResult: '暂无搜索结果',
      headers: [
        { text: "状态", value: "status", sortable: true },
        { text: "作业名称", value: "name", sortable: true },
        { text: "备注", value: "remark", sortable: true },
        { text: "创建人", value: "created_by", sortable: true },
        { text: "创建时间", value: "created_at", sortable: true },
        { text: "操作", value: "null", sortable: false }
      ],
			headersEnglish: [
        { text: "status", value: "status", sortable: true },
        { text: "name", value: "name", sortable: true },
        { text: "remark", value: "remark", sortable: true },
        { text: "created_by", value: "created_by", sortable: true },
        { text: "created_at", value: "created_at", sortable: true },
        { text: "operational", value: "null", sortable: false }
      ],
      items: [
				// {
				// 	v_id: 1,
				// 	status: 0,
				// 	name: '储罐检查',
				// 	remark: '储罐检查备注',
				// 	created_by: '张三',
				// 	created_at: '2020-03-20'
				// },
				// {
				// 	v_id: 2,
				// 	status: 1,
				// 	name: '煤气检查',
				// 	remark: '煤气检查备注',
				// 	created_by: '李四',
				// 	created_at: '2020-03-20'
				// }
			],
			edited: {
				editedIndex: -1,
				editedItem: {
					v_id: null,
					status: '0',
					name: '',
					remark: ''
				},
				defaultItem: {
					v_id: null,
					status: '0',
					name: '',
					remark: ''
				}
			},
			message: {
				show: false,
				type: '',
				title: '',
				msg: ''
			},
			messageType: {model: 'confim', func: this.checked},
			itemId: '',
			isLoading: false
    }
  },
  mounted() {
		this.getPageData()
  },
	computed: {
		formTitle() {
			// dialog标题
			const locale = this.selectedLocale.locale
			, newJob = locale === 'en' ? 'Create New Job' : '新建视频作业'
			, editJob = locale === 'en' ? 'Edited Job' : '编辑视频作业'
      return this.edited.editedIndex === -1 ? newJob : editJob
	  },
		...mapState({
			loadDone: state => state.usertable.loadDone,
			queryTable: state => state.usertable.queryTable
		}),
		getPageCountAll() {
			return	Math.ceil(this.pagination.totalCount / (this.pagination.rowsPerPage > -1 ? this.pagination.rowsPerPage : this.pagination.totalCount))
		},
		required() {
			// 测试this.serializable中所有对象的rule规则，返回对象{name:true/false, xxx: true/false}
			// this.$valid.checkInput()检测this.serializable对象是否全部为true，返回true/false
			return this.$valid.requiredArr(this.serializable)
		},
		formatHeaders() {
			return this.selectedLocale.locale === 'en' ? this.headersEnglish : this.headers
		},
		...mapGetters(['getParams', "selectedLocale"])
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
    }
	},
  methods: {
		toggleAll () {
			// 选中/取消选中 所有table行
        if(this.selected.length) {
				  this.selected = []
				}
        else{
					this.selected = this.items.slice()
				}
    },
		changeSort (column) {
			// 根据列更改table排序，参数：column--列名
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
			// 获取主table数据
			let _this = this
			//table加载条打开
			this.isLoad = true
			//获取url参数，(如果是次级页返回本页面将带有访问二级页前的pagination数据,以及pagination.back为true)
			const params = this.getParams.videoLibrary
			if(params && params.back) this.pagination = params
			if(this.pagination.getFullPage){
        Axios.get(`video-job/index?sort=${(_this.pagination.descending ? '-' : '') + this.pagination.sortBy}&page=${this.pagination.pageFake}&per-page=-1`)
        .then(res => {
					if (res.data.code === 1) {
		          const dat = res.data.data
		          _this.items = dat === '' ? [] : dat
		          _this.isLoad = false
		          // _this.pagination.totalCount = dat.paging.count
							_this.$store.dispatch('setParams', {scene: {}})
					}
        })
			}else{
        Axios.get(`video-job/index?page=${this.pagination.pageFake}&per-page=${this.pagination.rowsPerPage}`)
        .then(res => {
					if (res.data.code === 1) {
		          const dat = res.data.data
		          _this.items = dat === '' ? [] : dat
		          _this.isLoad = false
		          // _this.pagination.totalCount = dat.paging.count
							_this.$store.dispatch('setParams', {scene: {}})
					}
        })
			}
		},
		checkDetail(item) {
			//访问作业详情二级页，将目前的pagination保存到vuex，并设置back为true
			// 参数item.name：作业名称
			let pagination = this.pagination
			pagination.back = true
			this.$store.dispatch('setParams', {scene: pagination})
      Router.push({
        path: `/scene/video-library/setup/${item.v_id}/${item.name}`
      })
		},
		add() {
			// 添加作业
			// 参数：作业基本信息数据this.edited.editedItem
			// 返回：0失败，1成功
			let _this = this
			Axios.post('video-job/create', this.edited.editedItem)
			.then(res => {
        switch(res.data.code){
					case 0:
					_this.$store.commit('setRequest', {
						valid: false,
						url: `video-job/create`,
						type: 'error',
						msg: '添加作业失败.'
					})
						break
					case 1:
						_this.close()
						_this.$store.commit('setRequest', {
							valid: false,
							url: `video-job/create`,
							type: 'success',
							msg: '添加作业成功.'
						})
						_this.getPageData()
						break
				}
				// code2返回错误提示
				_this.$valid.formInputErrorHandel({
					code: res.data.code,
					serializable: _this.serializable,
					errObj: res.data.errdata
				})
			})
			.catch(err => {
				let _this = this
				_this.$store.commit('setRequest', {
					valid: false,
					url: `video-job/create`,
					type: 'error',
					msg: err.message
				})
			})
		},
		deleted(item) {
			// 删除作业check(并非删除操作，而是check操作，删除在this.checked())
			this.itemId = item.v_id
      this.messageType = {model: 'confim', func: this.checked}
      this.message = {
				show: true,
				type: 'confim',
				title: '确认删除',
				msg: '确认删除此作业？'
			}
		},
		edit(item) {
			// 修改作业前的数据加载
			// 参数：作业名称
			this.edited.editedItem = item
			this.edited.editedIndex = this.items.indexOf(item)
      this.dialog = true
    },
		update(item) {
			// 修改作业
			// 参数：作业id，作业基本信息数据this.edited.editedItem
			// 返回：1成功，0失败
			let _this = this
			const edited = item ? item : this.edited.editedItem
			const sendData = {
				name: edited.name,
				status: edited.status,
				remark: edited.remark
			}
			Axios.post(`video-job/update?id=${edited.v_id}`, sendData)
			.then(function(data){
				switch(data.data.code){
					case 0:
					_this.$store.commit('setRequest', {
						valid: false,
						url: `video-job/update`,
						type: 'error',
						msg: _this.$t("message['Add failed']")
					})
						break
					case 1:
						_this.close()
						_this.$store.commit('setRequest', {
							valid: false,
							url: `video-job/update`,
							type: 'success',
							msg: _this.$t("message['Add Successfully']")
						})
						_this.getPageData()
						break
				}
				// code2返回错误提示
				_this.$valid.formInputErrorHandel({
					code: data.data.code,
					serializable: _this.serializable,
					errObj: data.data.errdata
				})
			})
			.catch(err => {
				let _this = this
				_this.$store.commit('setRequest', {
					valid: false,
					url: `video-job/create`,
					type: 'error',
					msg: err.message
				})
			})
		},
		swapSatus(item) {
			item.status = parseInt(item.status) ? 0 : 1
			this.update(item)
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
			// dialog【保存】按钮点击时触发
			// 如果是修改数据则editedIndex为修改的数据的下标，否则添加数据
			if (this.edited.editedIndex > -1) {
				// 修改
				this.update()
			} else {
				// 添加
				this.add()
			}
		},
		checked(e) {
			// 删除作业 this.deleted()结果为true时执行
			let _this = this
			// 关闭confim对话框
      this.message.show = false
      if(e) {
				// 删除作业
				// 参数：作业id
				// 返回：1成功，0失败
        Axios.post(`video-job/delete?id=${this.itemId}`)
        .then(res => {
					switch(res.data.code){
						case 0:
						_this.$store.commit('setRequest', {
							valid: false,
							url: `video-job/delete`,
							type: 'error',
							msg: _this.$t("message['Delete Failed']")
						})
							break
						case 1:
							_this.close()
							_this.$store.commit('setRequest', {
								valid: false,
								url: `video-job/delete`,
								type: 'success',
								msg: _this.$t("message['Delete Successfully']")
							})
							_this.getPageData()
							break
					}
        })
      }
    }
  }
}
</script>
<style media="screen" scoped>
</style>
<style media="screen">
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
</style>
