<!-- /control/menu -->
<!-- 菜单管理 -->
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
					:fullBlock="true"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<Librarys @selected="librarySelected"></Librarys>
					<v-card-title>
						<v-dialog  v-model="dialog" max-width="600px" persistent>
							<v-btn  slot="activator" flot left color="#fff" class="btn-large">
		            <v-icon color="#4A7BAF">library_add</v-icon>
		            <span class="btn-font-color">新建菜单</span>
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
												<v-text-field v-show="false" v-model="edited.editedItem.parent"></v-text-field>
												<v-flex xs12 sm12 md12>
				                  <v-text-field clearable autofocus required :rules="required.name" v-model="edited.editedItem.name" label="菜单名称*："></v-text-field>
				                </v-flex>
												<v-flex xs1 sm1 md1>
													<v-icon>{{edited.editedItem.data || 'edit'}}</v-icon>
												</v-flex>
												<v-flex xs11 sm11 md11>
				                  <v-text-field placeholder="输入material图标名称,例如:edit" clearable v-model="edited.editedItem.data" label="菜单小图标："></v-text-field>
				                </v-flex>
												<v-flex xs12 sm12 md12>
													<v-subheader class="pl-0">排序(输入或拖动选择)：</v-subheader>
													<v-slider
									          v-model="edited.editedItem.order"
									          :thumb-size="24"
									          thumb-label="always"
									        >
													<template v-slot:prepend>
														<v-text-field
															v-model="edited.editedItem.order"
															class="mt-0 pt-0"
															hide-details
															single-line
															type="number"
															style="width: 60px"
														></v-text-field>
													</template>
									        </v-slider>
				                </v-flex>
				                <v-flex xs12 sm12 md12>
													<Search
														@bindModel="searchHandlerParent"
														label="父级名称"
														placeholder="输入数据模糊查询"
														:multiple= "false"
														:clickHandler="loadParentName"
														:loading="searchLoading"
														:items="parentNameItems"
														:vModel="searchHandlerParent"
														:vModelEdit="edited.editedItem.parent_name"
													></Search>
				                </v-flex>
												<v-flex xs12 sm12 md12>
													<Search
														@bindModel="searchHandlerRoute"
														label="后台接口"
														placeholder="输入数据模糊查询"
														:clickHandler="loadRoute"
														:loading="searchLoading"
														:items="routeItems"
														:vModel="searchHandlerRoute"
														:vModelEdit="edited.editedItem.route"

													></Search>
				                </v-flex>
												<v-flex xs12 sm12 md12>
													<Search
														@bindModel="searchHandlerFontendPath"
														label="前端路由"
														placeholder="输入数据模糊查询"
														:multiple= "false"
														:clickHandler="loadFontend_path"
														:loading="searchLoading"
														:items="fontend_pathItems"
														:vModel="searchHandlerFontendPath"
														:vModelEdit="edited.editedItem.fontend_path"

													></Search>
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
							@focus.stop="searchClass.searchFocus"
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
						:expand="expand"
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
							<tr :active="props.selected" @click="props.expanded = !props.expanded">
								<!-- <td>
				          <v-checkbox
				            :input-value="props.selected"
				            primary
				            hide-details
				          ></v-checkbox>
				        </td> -->
								<!-- <td class="text-xs-center">{{ props.item.id }}</td> -->
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.order)"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.name)"></td>
								<!-- <v-tooltip bottom>
									<td slot="activator" class="text-xs-center" v-html="searchClass.setWordColor(props.item.parent_name)"></td>
									<span>编号:{{ props.item.parent }}</span>
								</v-tooltip> -->
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.route)"></td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.fontend_path)"></td>
								<td class="text-xs-center justify-center px-0">
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="edit(props.item)"
										>
                      edit
										</v-icon>
										<span>修改菜单</span>
									</v-tooltip>
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="deleted(props.item)"
										>
                      delete
										</v-icon>
										<span>删除菜单</span>
									</v-tooltip>
								</td>
							</tr>
						</template>
						<template v-slot:expand="props">
							<v-card>
								<v-card-title class="primary white--text headline">
									子菜单 ({{ props.item.name }})
								</v-card-title>
								<v-data-table
									:items="props.item.children"
									class="elevation-1"
									hide-actions
									hide-headers
								>
									<template v-slot:items="child">
										<tr class="pa-3 indigo lighten-2">
											<td class="text-xs-center white--text" v-html="searchClass.setWordColor(child.item.order)"></td>
											<td class="text-xs-center white--text" v-html="searchClass.setWordColor(child.item.name)"></td>
											<v-tooltip bottom>
												<td slot="activator" class="text-xs-center" v-html="searchClass.setWordColor(child.item.parent_name)"></td>
												<span>编号:{{ child.item.parent }}</span>
											</v-tooltip>
											<td class="text-xs-center white--text" v-html="searchClass.setWordColor(child.item.route)"></td>
											<td class="text-xs-center white--text" v-html="searchClass.setWordColor(child.item.fontend_path)"></td>
											<td class="text-xs-center white--text justify-center px-0">
												<v-tooltip top>
													<v-icon
														slot="activator"
														@click.stop="edit(child.item, props.item)"
													>
			                      edit
													</v-icon>
													<span>修改菜单</span>
												</v-tooltip>
												<v-tooltip top>
													<v-icon
														slot="activator"
														@click.stop="deleted(child.item)"
													>
			                      delete
													</v-icon>
													<span>删除菜单</span>
												</v-tooltip>
											</td>
										</tr>
									</template>
								</v-data-table>
							</v-card>
			      </template>
						<!-- <template slot="pageText" slot-scope="props">
							<div v-show="!(search || search !== '' )">
								当前 {{ props.pageStart }} - {{ props.pageStop }} 条
								总数：{{pagination.totalCount ? pagination.totalCount : props.itemsLength }}
								&nbsp	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp第 {{pagination.pageFake}} 页	&nbsp 共 {{getPageCountAll}} 页
							</div>
						</template> -->
					</v-data-table>
					<!-- <div v-show="!(search && search !== '' )" class="text-xs-center pt-2">
						<v-pagination v-model="pagination.pageFake" :length="getPageCountAll"></v-pagination>
					</div> -->
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
import Search from '@/components/SearchInput'
import RouteList from '@/router/routerList'
import Librarys from '@/components/Librarys/librarys'
export default {
	components: {
		Search,
		Librarys
	},
  data() {
    return {
			dialog: false,
			dialogModel: '',
			searchLoading: false,
			parentNameItems: [],
			routeItems: [],
			fontend_pathItems: [],
			pagination: {
				getFullPage: true,
        sortBy: 'order',
				totalCount: 4,
				rowsPerPage: -1,
				perPage: -1,
				page: 1,
				pageFake: 1
      },
      selected: [],
			isLoad: true,
      loader: false,
			expand: false,
      serializable: {
				name:
				[{
					status: false,
					text: `请输入菜单名称`,
					rule: v => !!v
				}]
			},
      search: "",
			nodata: '暂无数据',
			noSeachResult: '暂无搜索结果',
      headers: [
				// {	text: "编号", value: "id", sortable: true },
				{	text: "排序", value: "order", sortable: true },
        { text: "菜单名称", value: "name", sortable: true },
				// { text: "父级菜单", value: "parent_name", sortable: false },
        { text: "后台接口", value: "route", sortable: true },
        { text: "前端路由", value: "fontend_path", sortable: true },
				{ text: "操作", value: "name", sortable: false }
      ],
      items: [
				{
					// id: 1,
					// order: 1,
					// name: '炒鸡菜单',
					// ruleName: '炒鸡菜单',
					// description: '炒鸡菜单描述',
					// data: null,
					// children: [{
					// 	id: 2,
					// 	order: 2,
					// 	name: '炒鸡菜单',
					// 	ruleName: '炒鸡菜单',
					// 	description: '炒鸡菜单描述',
					// 	data: null
					// }]
				}
			],
			edited: {
				editedIndex: -1,
				editedItem: {
					id: null,
					parent: null,
					name: '',
					data: '',
					parent_name: '',
					route: '',
					order: 0,
					fontend_path: ''
				},
				defaultItem: {
					id: null,
					parent: null,
					name: '',
					data: '',
					parent_name: '',
					route: '',
					order: 0,
					fontend_path: ''
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
			path: `left-menu/index?iipsearch=true`,
			body: {}
		}, 3000)
		this.paginationAll = this.searchClass.getDefaultPagination()
	},
  mounted() {
  },
	computed: {
		formTitle() {
      return this.edited.editedIndex === -1 ? '新建菜单' : '编辑菜单'
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
			// 获取主table数据
			let _this = this
			//table加载条打开
			this.isLoad = true
			if(this.pagination.getFullPage){
        // Axios.get(`left-menu/index?pid=${this.activeProject.pid}&sort=${(_this.pagination.descending ? '-' : '') + this.pagination.sortBy}&page=${this.pagination.pageFake}&per-page=-1`)
        Axios.get(`left-menu/index?pid=${this.activeProject.pid}`)
        .then(res => {
          let dat = res.data.data
					dat = _this.setResultId(dat)
					dat = _this.setResultParentName(dat)
					_this.tempData = dat
          _this.items = dat.result
          _this.isLoad = false
          _this.pagination.totalCount = dat.paging.count
        })
			}else{
        // Axios.get(`left-menu/index?pid=${this.activeProject.pid}&sort=${(_this.pagination.descending ? '-' : '') + this.pagination.sortBy}&page=${this.pagination.pageFake}&per-page=${this.pagination.rowsPerPage}`)
        Axios.get(`left-menu/index?pid=${this.activeProject.pid}`)
        .then(res => {
          let dat = res.data.data
					dat = _this.setResultId(dat)
					dat = _this.setResultParentName(dat)
          _this.items = dat.result
          _this.isLoad = false
          _this.pagination.totalCount = dat.paging.count
					_this.$store.dispatch('setParams', {authority: {}})
        })
			}
		},
		add() {
			// 添加权限
			// 参数：权限基本信息数据this.edited.editedItem
			// 返回：0失败，1成功
			let _this = this
			const sendData = this.edited.editedItem
			sendData.pid = this.activeProject.pid
			Axios.post('left-menu/create', sendData)
			.then(res => {
        switch(res.data.code){
					case 0:
					_this.$store.commit('setRequest', {
						valid: false,
						url: `left-menu/create`,
						type: 'error',
						msg: '添加菜单失败.'
					})
						break
					case 1:
						_this.close()
						_this.$store.commit('setRequest', {
							valid: false,
							url: `left-menu/create`,
							type: 'success',
							msg: `${res.data.data.id}菜单添加成功`
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
				_this.$store.commit('setRequest', {
					valid: false,
					url: `left-menu/create`,
					type: 'error',
					msg: `添加失败${err.msg}`
				})
			})
		},
		deleted(item) {
			// 删除菜单的check(并非删除操作，而是check操作，删除在this.checked())
			this.itemId = item.id
      this.messageType = {model: 'confim', func: this.checked}
      this.message = {
				show: true,
				type: 'confim',
				title: '确认删除',
				msg: '确认删除此菜单？'
			}
		},
		edit(item, parent) {
			// 修改菜单前的数据加载
			let _this = this
			this.loadParentName()
			this.isLoading = true

			this.edited.editedIndex = parent ? parent.children.indexOf(item) : this.items.indexOf(item)
			Axios.post(`left-menu/update?id=${item.id}&pid=${this.activeProject.pid}`)
			.then(res => {
				let model = res.data.data.model
				// 這麼些是爲了觸發watch
				_this.edited.editedItem.id = model.id
			 	_this.edited.editedItem.parent = model.parent
				_this.edited.editedItem.name = model.name
				_this.edited.editedItem.data = model.data
				_this.edited.editedItem.parent_name = model.parent_name
				_this.edited.editedItem.route = model.route
				_this.edited.editedItem.fontend_path = model.fontend_path
				_this.edited.editedItem.order = model.order
				// code2返回错误提示
				_this.$valid.formInputErrorHandel({
					code: res.data.code,
					serializable: _this.serializable,
					errObj: res.data.errdata
				})
				setTimeout(() => {
					_this.isLoading = false
				}, 2000)
			})
			.catch(err => {
				_this.$store.commit('setRequest', {
					valid: false,
					url: `left-menu/create`,
					type: 'error',
					msg: `添加失败${err.msg}`
				})
			})
      this.dialog = true
    },
		update() {
			// 修改菜单
			let _this = this
			this.messageType = {model: 'alert'}
			Axios.post(`left-menu/update?id=${this.edited.editedItem.id}&pid=${this.activeProject.pid}`, this.edited.editedItem)
			.then(function(data) {
				switch(data.data.code){
					case 0:
						_this.$store.commit('setRequest', {
							valid: false,
							url: `left-menu/update?id=${_this.edited.editedItem.id}`,
							type: 'error',
							msg: `菜单修改失败`
						})
						break
					case 1:
						_this.close()
						_this.$store.commit('setRequest', {
							valid: false,
							url: `left-menu/update?id=${_this.edited.editedItem.id}`,
							type: 'success',
							msg: `菜单修改成功`
						})
						_this.getPageData()
						break
				}
			})
			.catch(err => {
				_this.$store.commit('setRequest', {
					valid: false,
					url: `left-menu/update?id=${_this.edited.editedItem.id}`,
					type: 'error',
					msg: `修改失败${err.msg}`
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
			// 删除菜单 this.deleted()结果为true时执行
			let _this = this
			// 关闭confim对话框
      this.message.show = false
      if(e) {
				// 获取当前选中的权限
        let column = this.items.filter((elt, index) => {
            elt.index = index
            return elt.id === this.itemId
        })
				// 删除菜单
				// 参数：菜单id
				// 返回：1成功，0失败
        Axios.post(`left-menu/delete?id=${this.itemId}&pid=${this.activeProject.pid}`)
        .then(res => {
          if(res.data.code === 1){
						_this.searchWord = null
            // _this.items.splice(column[0].index, 1)
						_this.getPageData()
						_this.$store.commit('setRequest', {
							valid: false,
							url: `left-menu/delete?id=${_this.itemId}`,
							type: 'success',
							msg: `菜单删除成功`
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
		setResultParentName(dat) {
			// 设置菜单的父级菜单parent
			// 参数：table的array数据
			for (let i = 0; i < dat.result.length; i++) {
				if(dat.result[i].parent) {
					dat.result.map(res => {
					 	if(res.id === dat.result[i].parent) {
							dat.result[i].parent_name = res.name
						}
					})
				}
			}
			return dat
		},
		loadParentName() {
			// 加载【搜索下拉框】的数据
			// 【搜索下拉框】加载条打开
			this.searchLoading = true
			if (!this.activeProject.pid) {
				return
			}
			// 获取菜单数据
			Axios.get(`/left-menu/get-menu-source?pid=${this.activeProject.pid}`)
			.then(res => {
				const dat = res.data.data
				let items = [], parents = []
				dat.map(item => {
					if(item.parent_name === null) parents.push(item.name)
				})
				parents = new Set(parents)
				parents = Array.from(parents)
				items.push({header: `主菜单`})
				parents.map(res => {
					items.push({
							name: res,
							group: '主菜单',
							avatar: null
						})
				})
				items.push({divider: true})
				for (let i = 0; i < parents.length; i++) {
					items.push({header: `一级菜单：${parents[i]}`})
					for (let j = 0; j < dat.length; j++) {
						const bool = dat[j].parent_name === parents[i]
						if(bool) {
							items.push({
								name: dat[j].name,
								group: dat[j].parent_name,
								avatar: dat[j].avatar
							})
						}
					}
					items.push({divider: true})
				}
				this.parentNameItems = items
				// [
        //   { header: '管理' },
        //   { name: '人员管理', group: '管理', avatar: 'srcs[1]' },
        //   { name: '步骤管理', group: '管理', avatar: 'srcs[3]' }
        //   { divider: true },
        //   { header: '系统设置' },
        //   { name: '分配权限', group: '系统设置', avatar: 'srcs[2]' },
        //   { name: '权限列表 ', group: '系统设置', avatar: 'srcs[1]' }
        // ]
			})
			.finally(() => (this.searchLoading = false))
		},
		loadRoute() {
			// 加载后端接口的【搜索下拉框】的数据
			// 【搜索下拉框】加载条打开
			if (!this.activeProject.pid) {
				return
			}
			this.searchLoading = true
			Axios.get(`left-menu/get-saved-routes?pid=${this.activeProject.pid}`)
			.then(res => {
				let items = []
				const dat = res.data.data
				items.push({header: `端口列表`})
				dat.map(item => {
					items.push({
						name: item,
						group: null,
						avatar: null
					})
				})
				this.routeItems = items
			})
			.finally(() => (this.searchLoading = false))
		},
		loadFontend_path() {
			// 加载前端路由的【搜索下拉框】的数据
			// 【搜索下拉框】加载条打开
			let items = []
			for (let i in RouteList.child) {
				let son = RouteList.child[i]
				items.push(
					{
						header: son.name
					},
					{
						name: son.path,
						group: `首页 / ${son.name}`,
						avatar: son.avatar
					}
				)
				if (son.child) {
					for (var j in son.child) {
						let child = son.child[j]
						items.push({
								name: child.path,
								group: `首页 / ${son.name} / ${child.name}`,
								avatar: child.avatar
							})
					}
				}
				items.push({divider: true})
			}
			this.fontend_pathItems = items
		},
		searchHandlerParent(item) {
			// 参数：item -- 【搜索下拉框】选中的值
			// 设置父级菜单的【搜索下拉框】的值
			if (!this.tempData || !item) {
				return
			}
			const arr = this.tempData.result.filter(res => {
				return res.name === item
			})
			if (arr[0]) {
				this.edited.editedItem.parent_name = arr[0].name
				this.edited.editedItem.parent = arr[0].id
			}
		},
		searchHandlerRoute(item) {
			// 参数：item -- 【搜索下拉框】选中的值
			// 设置后台接口的【搜索下拉框】的值
			this.edited.editedItem.route = item
		},
		searchHandlerFontendPath(item) {
			// 参数：item -- 【搜索下拉框】选中的值
			// 设置前端路由的【搜索下拉框】的值
			this.edited.editedItem.fontend_path = item
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
			this.searchClass.option.path = `left-menu/index?iipsearch=true&pid=${this.activeProject.pid}`
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
