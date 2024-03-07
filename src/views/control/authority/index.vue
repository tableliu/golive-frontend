<!-- /control/authority -->
<!-- 权限管理 -->
<template>
	<div>
		<page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader>
  	<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<message
				:model = "message"
				:type = "messageType"
				></message>
				<app-card
					customClasses="card-table custom-app-card"
					:fullBlock="true"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<Librarys @selected="librarySelected"></Librarys>
					<v-card-title>

						<v-dialog  v-model="dialog" max-width="600px" persistent>
							<v-btn  slot="activator" flot left color="#fff" class="btn-large">
		            <v-icon color="#4A7BAF">library_add</v-icon>
		            <span class="btn-font-color">新建权限</span>
		          </v-btn>
							<v-card class="v-card-table">
								<Loading v-if="isLoading"></Loading>
								<v-card-title>
			            <span class="card-title" >{{ formTitle }}</span>
									<span class="card-subtitle">(项目：{{ activeProject.name }})</span>
			          </v-card-title>
								<v-card-text>
			            <v-container grid-list-md>
			              <v-layout wrap>
			                <v-flex xs12 sm12 md12>
			                  <v-text-field clearable autofocus required :rules="required.name" v-model="edited.editedItem.name" label="权限名称*："></v-text-field>
			                </v-flex>
			                <v-flex xs12 sm12 md12>
			                  <v-text-field clearable v-model="edited.editedItem.ruleName" label="规则名称："></v-text-field>
			                </v-flex>
											<v-flex xs12 sm12 md12>
			                  <v-text-field clearable v-model="edited.editedItem.description" label="权限描述："></v-text-field>
			                </v-flex>
			              </v-layout>
			            </v-container>
			          </v-card-text>
								<v-card-actions>
			            <div class="v-card-actions-buttons">
										<v-btn color="blue darken-1" flat @click.native="save">保存</v-btn>
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
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.name)"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.ruleName)"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.description)"></td>
								<td class="text-xs-center justify-center px-0">
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="check(props.item)"
										>
                      assignment
										</v-icon>
										<span>编辑/查看</span>
									</v-tooltip>
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="edit(props.item)"
										>
                      edit
										</v-icon>
										<span>修改权限</span>
									</v-tooltip>
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="deleted(props.item)"
										>
                      delete
										</v-icon>
										<span>删除权限</span>
									</v-tooltip>
								</td>
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
import Router from '@/router'
import {mapGetters} from 'vuex'
import Librarys from '@/components/Librarys/librarys'
export default {
	components: {
		Librarys
	},
  data() {
    return {
			dialog: false,
			pagination: {
				getFullPage: true,
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
				name:
				[{
					status: false,
					text: `请输入权限名称`,
					rule: v => !!v
				}]
			},
      search: "",
			nodata: '暂无数据',
			noSeachResult: '暂无搜索结果',
      headers: [
        { text: "权限名称", value: "name", sortable: true },
				{ text: "规则名称", value: "ruleName", sortable: true },
        { text: "描述", value: "description", sortable: true },
        { text: "操作", value: "name", sortable: false }
      ],
      items: [
				// {
				// 	name: '炒鸡权限',
				// 	ruleName: '炒鸡权限',
				// 	description: '炒鸡权限描述',
				// 	data: null
				// }
			],
			edited: {
				editedIndex: -1,
				editedItem: {
					name: '',
					ruleName: '',
					description: ''
				},
				defaultItem: {
					name: '',
					ruleName: '',
					description: ''
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
			isLoading: false,
			activeProject: {}
    }
  },
	beforeMount() {
		this.searchClass = new this.$Search({
			type: 'get',
			path: `permission/index?iipsearch=true`,
			body: {}
		}, 5000)
		this.paginationAll = this.searchClass.getDefaultPagination()
	},
  mounted() {
  },
	computed: {
		formTitle() {
			// dialog标题
      return this.edited.editedIndex === -1 ? '新建权限' : '编辑权限'
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
		...mapGetters(['getParams'])
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
			const params = this.getParams.authority
			if(params && params.back) this.pagination = params
			if(this.pagination.getFullPage){
        Axios.get(`permission/index?pid=${this.activeProject.pid}&sort=${this.pagination.sortBy}&page=${this.pagination.pageFake}&per-page=-1`)
        .then(res => {
          let dat = res.data.data
					dat = _this.setResultId(dat)
          _this.items = dat.result
          _this.isLoad = false
          _this.pagination.totalCount = dat.paging.count
        })
			}else{
        Axios.get(`permission/index?pid=${this.activeProject.pid}&sort=${(_this.pagination.descending ? '-' : '') + this.pagination.sortBy}&page=${this.pagination.pageFake}&per-page=${this.pagination.rowsPerPage}`)
        .then(res => {
          let dat = res.data.data
					dat = _this.setResultId(dat)
          _this.items = dat.result
          _this.isLoad = false
          _this.pagination.totalCount = dat.paging.count
					_this.$store.dispatch('setParams', {authority: {}})
        })
			}
		},
		check(item) {
			//访问权限详情二级页，将目前的pagination保存到vuex，并设置back为true
			// 参数item.name：权限名称
			let pagination = this.pagination
			pagination.back = true
			this.$store.dispatch('setParams', {authority: pagination})
      Router.push({
        path: `/control/authority/setup/${item.name}`
      })
		},
		add() {
			// 添加权限
			// 参数：权限基本信息数据this.edited.editedItem
			// 返回：0失败，1成功
			let _this = this
			const sendData = this.edited.editedItem
			sendData.pid = this.activeProject.pid
			Axios.post('permission/create', sendData)
			.then(res => {
        switch(res.data.code){
					case 0:
					_this.$store.commit('setRequest', {
						valid: false,
						url: `left-menu/create`,
						type: 'error',
						msg: '添加权限失败.'
					})
						break
					case 1:
						_this.close()
						_this.$store.commit('setRequest', {
							valid: false,
							url: `left-menu/create`,
							type: 'success',
							msg: '添加权限成功.'
						})
						_this.getPageData()
						break
					case 2:
						// code2返回错误提示
						_this.$valid.formInputErrorHandel({
							code: res.data.code,
							serializable: _this.serializable,
							errObj: res.data.errdata
						})
						break
				}
			})
			.catch(err => {
				let _this = this
				_this.$store.commit('setRequest', {
					valid: false,
					url: `left-menu/create`,
					type: 'error',
					msg: err.message
				})
			})
		},
		deleted(item) {
			// 删除权限check(并非删除操作，而是check操作，删除在this.checked())
			this.itemId = item.name
      this.messageType = {model: 'confim', func: this.checked}
      this.message = {
				show: true,
				type: 'confim',
				title: '确认删除',
				msg: '确认删除此权限？'
			}
		},
		edit (item) {
			// 修改权限前的数据加载
			// 参数：权限名称
			let _this = this
      this.dialog = true
			this.isLoading = true
			Axios.post(`permission/update?id=${item.name}&pid=${this.activeProject.pid}`)
			.then(res => {
				const dat = res.data.data.model
				_this.edited.editedIndex = _this.items.indexOf(item)
				_this.edited.editedItem = dat
				_this.edited.editedItem.oldName = item.name

				// code2返回错误提示
				_this.$valid.formInputErrorHandel({
					code: res.data.code,
					serializable: _this.serializable,
					errObj: res.data.errdata
				})
				setTimeout(() => {
					_this.isLoading = false
				}, 1000)
			})
    },
		update() {
			// 修改权限
			// 参数：权限id，权限基本信息数据this.edited.editedItem
			// 返回：1成功，0失败
			let _this = this
			Axios.post(`permission/update?id=${this.edited.editedItem.oldName}&pid=${this.activeProject.pid}`, this.edited.editedItem)
			.then(function(data){
				switch(data.data.code){
					case 0:
					_this.$store.commit('setRequest', {
						valid: false,
						url: `left-menu/create`,
						type: 'error',
						msg: '添加权限失败.'
					})
						break
					case 1:
						_this.close()
						_this.$store.commit('setRequest', {
							valid: false,
							url: `left-menu/create`,
							type: 'success',
							msg: '修改权限成功.'
						})
						_this.getPageData()
						break
				}
			})
			.catch(err => {
				let _this = this
				_this.$store.commit('setRequest', {
					valid: false,
					url: `left-menu/create`,
					type: 'error',
					msg: err.message
				})
			})
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
			// 删除权限 this.deleted()结果为true时执行
			let _this = this
			// 关闭confim对话框
      this.message.show = false
      if(e) {
				// 获取当前选中的权限
        let column = this.items.filter((elt, index) => {
            elt.index = index
            return elt.name === this.itemId
        })
				// 删除权限
				// 参数：权限id
				// 返回：1成功，0失败
        Axios.post(`permission/delete?id=${this.itemId}`, {
					pid: this.activeProject.pid
				})
        .then(res => {
          if(res.data.code === 1){
            _this.items.splice(column[0].index, 1)
						_this.$store.commit('setRequest', {
	 					 valid: false,
	 					 url: `permission/delete?id=${this.itemId}`,
	 					 type: 'success',
	 					 msg: `权限删除成功`
	 				 })
          }
        })
      }
    },
		setResultId(dat) {
			// 设置自动增长的id
			// 参数:table的array数据
			let count = 1
			dat.result = dat.result.map(function(item) {
				item.id = item.id ? item.id : count++
				return item
			})
			return dat
		},
		librarySelected(item) {
			this.activeProject = {
				name: item.name,
				pid: item.pid
			}
			this.search = ''
//this.searchClass.searchChange(this.search)
			this.getPageData()
			this.searchClass.count = 0
			this.searchClass.option.path = `permission/index?iipsearch=true&pid=${this.activeProject.pid}`
		}
  }
}
</script>
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
