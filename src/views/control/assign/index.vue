<!-- /control/assign/236(user_id)/20172%E6%A3%80%E9%AA%8C%E5%91%98(user_name) -->
<!-- 人员管理 ->>>>- 人员授权 -->
<template>
	<div>
		<page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader>
  	<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<message
				:model = "message"
				:type = "{model: 'alert'}"
				></message>
				<app-card
					customClasses="custom-app-card"
					:fullBlock="true"
					colClasses="xl12 lg12 md12 sm12 xs12"
					align="center"
				>
					<Librarys :format="formatLibrary" @selected="librarySelected"></Librarys>
					<div class="card-title-library">{{ `用户名称：${power.name}， 当前项目：${activeProject.name} `}}</div>
					<v-card-title>
						<v-btn @click="selectedPower(true)"  slot="activator" flot left color="#fff" class="btn-large">
	            <v-icon color="#4A7BAF">toggle_on</v-icon>
	            <span class="btn-font-color">启用选中项</span>
	          </v-btn>
						<v-btn @click="selectedPower(false)"  slot="activator" flot left color="#fff" class="btn-large">
	            <v-icon color="#4A7BAF">toggle_off</v-icon>
	            <span class="btn-font-color">禁用选中项</span>
	          </v-btn>
						<!-- <v-btn @click="selectedPower(true)" flot left color="primary" dark class="mb-2">启用选中项</v-btn>
						<v-btn @click="selectedPower(false)" flot left color="primary" dark class="mb-2">禁用选中项</v-btn> -->
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
						:headers="headers"
						:items="items"
						:search="search"
						:light="true"
						:loading="isLoad"
						:no-data-text="nodata"
						:no-results-text="noSeachResult"
						:pagination.sync="pagination"
						:rows-per-page-text="$t('message.searchPerpage')"
						:rows-per-page-items="pagination.rowsPerPage_item"
						class="elevation-1"
					>
						<template slot="headers" slot-scope="props">
							<tr>
								<th>
									<v-checkbox
										:input-value="props.all"
										:indeterminate="props.indeterminate"
										primary
										hide-details
										@click.native="toggleAll"
									></v-checkbox>
								</th>
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
								<td>
				          <v-checkbox
				            :input-value="props.selected"
				            primary
				            hide-details
				          ></v-checkbox>
				        </td>
								<td class="text-xs-center">{{ props.item.id }}</td>
								<td class="text-xs-center">{{ props.item.value }}</td>
								<td class="text-xs-center justify-center px-0">
									<v-switch
										@click.stop.prevent="givePower(props)"
										class="switch"
										v-model="props.item.status"
									></v-switch>
								</td>
							</tr>
						</template>
						<template slot="pageText" slot-scope="props">
							当前 {{ props.pageStart }} - {{ props.pageStop }} 条
						  总数：{{pagination.totalCount ? pagination.totalCount : props.itemsLength }}
						 	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp第 {{pagination.pageFake}} 页	&nbsp 共 {{getPageCountAll}} 页
						</template>
					</v-data-table>
					<div class="text-xs-center pt-2">
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
			pagination: {
				getFullPage: true,
        sortBy: 'name',
				totalCount: 4,
				rowsPerPage: 15,
				perPage: 10,
				page: 1,
				pageFake: 1,
				rowsPerPage_item: [ 15, 30, 50, 100, 1000, { "text": "全部", "value": -1 } ]
      },
			formatLibrary: null,
      power: {
        name: '超级角色',
        rulename: '炒鸡角色',
        description: '炒鸡角色描述'
      },
			activeProject: {},
      selected: [],
			isLoad: true,
      loader: false,
      search: "",
			nodata: '暂无数据',
			noSeachResult: '暂无搜索结果',
      headers: [
				{ text: "编号", value: "id", sortable: true },
        { text: "角色/权限组", value: "value", sortable: true },
				{ text: "启用/禁用", value: "status", sortable: true }
      ],
      items: [],
			message: {
				show: false,
				type: '',
				title: '',
				msg: ''
			}
    }
  },
  beforeMount() {
		const _this = this
		const param = this.getQuery()
		this.power = param
		const request = this.$axios.get('project/user-project?user_id=' + this.power.id)
		request.then(res => {
			if (res.data.code === 1) {
				const dat = res.data.data
				_this.formatLibrary = dat
			}
		})
  },
	computed: {
		...mapState({
			loadDone: state => state.usertable.loadDone,
			queryTable: state => state.usertable.queryTable
		}),
		getPageCountAll() {
			return	Math.ceil(this.pagination.totalCount / (this.pagination.rowsPerPage > -1 ? this.pagination.rowsPerPage : this.pagination.totalCount))
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
		'pagination.sortBy': function() {
			if(!this.pagination.getFullPage) {
				this.getPageData()
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
			// 选中/取消选中 所有用户
      if(this.selected.length) {
			  this.selected = []
			}
      else{
				this.selected = this.items.slice()
			}
    },
		changeSort (column) {
			//table列排序
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
			this.isLoad = true
			// 若单页获取所有数据
			if(this.pagination.getFullPage){
        Axios.get(`assignment/get-assign?id=${this.power.id}&pid=${this.activeProject.pid}&sort=${ (_this.pagination.descending ? '-' : '') + _this.pagination.sortBy }&page=${this.pagination.pageFake}&per-page=-1`)
        .then(res => {
          let dat = res.data.data
					dat = _this.setResultId(dat)
          _this.items = dat.result
					_this.items
          _this.isLoad = false
          _this.pagination.totalCount = dat.paging.count
        })
			}else{
				// 若分页获取数据
        Axios.get(`assignment/get-assign?id=${this.power.id}&sort=${ (_this.pagination.descending ? '-' : '') + _this.pagination.sortBy }&page=${this.pagination.pageFake}&per-page=${this.pagination.rowsPerPage}`)
        .then(res => {
          let dat = res.data.data
					dat = _this.setResultId(dat)
          _this.items = dat.result
          _this.isLoad = false
          _this.pagination.totalCount = dat.paging.count
        })
			}
		},
		getQuery() {
			// 获取url参数
      const params = {
				id: Router.history.current.params.id,
				name: Router.history.current.params.name
			}
      return params
    },
		setResultId(dat) {
			// 设置自增ID，参数:getPageData()获取到的数组items
			let count = 1
			dat.result = dat.result.map(function(item) {
				item.id = item.id ? item.id : count++
				return item
			})
			return dat
		},
		givePower(props) {
			// 启用/禁用 权限，参数：table行数据
			let _this = this
			// ajax---
			// type：post
			/*
			parmars：
				id：用户id、 items：角色/权限组、 status：1/0 (启用/禁用)
			*/
      Axios.post(`assignment/revoke?id=${this.power.id}`,
				{
					items: [props.item.value],
					status: (!_this.items[props.index].status) ? 1 : 0,
					pid: _this.activeProject.pid
				}
			)
      .then(res => {
        if(res.data.code === 1){
					_this.items[props.index].status = !_this.items[props.index].status
        }
      })
		},
		selectedPower(props) {
			// 启用/禁用 多个角色的权限
			let _this = this
			// 获取选中的用户/角色
			let items = []
			this.selected.map(item => {
				items.push(item.value)
			})
			// ajax---
			// type：post
			/*
			parmars：
				id：用户id、 items：角色/权限组(Array)、 status：1/0 (启用/禁用)
			*/
      Axios.post(`assignment/revoke?id=${this.power.id}`,
				{
					items: items,
					status: props ? 1 : 0,
					pid: _this.activeProject.pid
				}
			)
      .then(res => {
        if(res.data.code === 1){
					this.selected.map(item => {
						item.status = props
					})
        }
      })
		},
		librarySelected(item) {
			this.activeProject = {
				name: item.name,
				pid: item.pid
			}
			this.search = ''
//this.searchClass.searchChange(this.search)
			this.getPageData()
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
	.v-input--selection-controls__input	{
		margin: 0 auto;
	}
</style>
