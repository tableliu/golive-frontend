<!-- /control/authority/setup/权限名称 -->
<!-- 权限管理 -> 权限设置 -->
<!-- 权限管理二级页 -->
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
					:fullBlock="true"
					colClasses="xl12 lg12 md12 sm12 xs12"
					align="center"
				>
					<Librarys v-show="false" @selected="librarySelected"></Librarys>
					<div class="card-title-library">{{ `权限名称：${power.name}， 当前项目：${activeProject.name} `}}</div>
					<Loading v-if="loading.isLoading"
						:opacity="loading.opacity"
						:background="loading.background"

					></Loading>
					<v-card-title>
						<v-btn @click="selectedPower(true)"  slot="activator" flot left color="#fff" class="btn-large">
	            <v-icon color="#4A7BAF">toggle_on</v-icon>
	            <span class="btn-font-color">授权选中项</span>
	          </v-btn>
						<v-btn @click="selectedPower(false)"  slot="activator" flot left color="#fff" class="btn-large">
	            <v-icon color="#4A7BAF">toggle_off</v-icon>
	            <span class="btn-font-color">释权选中项</span>
	          </v-btn>
						<!-- <v-btn @click="selectedPower(true)" flot left color="primary" dark class="mb-2">授权选中项</v-btn>
						<v-btn @click="selectedPower(false)" flot left color="primary" dark class="mb-2">释权选中项</v-btn> -->
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
							<tr :active="props.selected" @click.stop.prevent="props.selected = !props.selected">
								<td>
				          <v-checkbox
				            :input-value="props.selected"
				            primary
				            hide-details
				          ></v-checkbox>
				        </td>
								<td class="text-xs-center" v-html="searchClass.setWordColor(props.item.ruleName)"></td>
								<td class="text-xs-center justify-center px-0">
									<v-switch
										@click.stop.native="givePower(props)"
										class="switch"
										v-model="props.item.status"
									></v-switch>
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
			pagination: {
				getFullPage: false,
        sortBy: 'name',
				totalCount: 4,
				rowsPerPage: 15,
				perPage: 10,
				page: 1,
				pageFake: 1,
				rowsPerPage_item: [ 15, 30, 50, 100, 1000, { "text": "全部", "value": -1 } ]
      },

      power: {
        name: '超级权限',
        rulename: '炒鸡权限',
        description: '炒鸡权限描述'
      },
			activeProject: {
				pid: '',
				name: ''
			},
      selected: [],
			isLoad: true,
      loader: false,
      search: "",
			nodata: '暂无数据',
			noSeachResult: '暂无搜索结果',
      headers: [
				// { text: "编号", value: "id", sortable: true },
        { text: "权限名称", value: "ruleName", sortable: true },
				{ text: "授权", value: "status", sortable: false }
      ],
      items: [],
			message: {
				show: false,
				type: '',
				title: '',
				msg: ''
			},
			loading: {
				isLoading: false,
				opacity: 0.5,
				background: '#fff'
			}
    }
  },
	beforeMount() {
		// 获取url参数
		const param = this.getQuery()
		this.power.name = param
		this.searchClass = new this.$Search({
			type: 'get',
			path: `permission/assign?id=${this.power.name}&iipsearch=true`,
			body: {}
		}, 10000)
		this.paginationAll = this.searchClass.getDefaultPagination()
	},
  mounted() {
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
			this.isLoad = true
			if(this.pagination.getFullPage){
        Axios.get(`permission/assign?pid=${this.activeProject.pid}&id=${this.power.name}&sort=${(_this.pagination.descending ? '-' : '') + this.pagination.sortBy}&page=${this.pagination.pageFake}&per-page=-1`)
        .then(res => {
          let dat = res.data.data
					dat = _this.setResultId(dat)
          _this.items = dat.result
          _this.isLoad = false
          _this.pagination.totalCount = dat.paging.count
        })
			}else{
        Axios.get(`permission/assign?pid=${this.activeProject.pid}&id=${this.power.name}&sort=${(_this.pagination.descending ? '-' : '') + this.pagination.sortBy}&page=${this.pagination.pageFake}&per-page=${this.pagination.rowsPerPage}`)
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
      const params = Router.history.current.params.name
      return params
    },
		setResultId(dat) {
			// 设置自增id
			let count = 1
			dat.result = dat.result.map(function(item) {
				item.id = item.id ? item.id : count++
				return item
			})
			return dat
		},
		givePower(props) {
			// 授权/取消授权
			let _this = this
			// const target = this.searchClass.response.data.result.find(item => {
			// 	return item.ruleName === props.item.ruleName
			// })
			// target.status = !target.status
      Axios.post(`permission/remove?id=${this.power.name}`,
				{
					items: [props.item.ruleName],
					status: props.item.status ? 1 : 0,
					pid: this.activeProject.pid
				}
			)
      .then(res => {
        if(res.data.code === 1){
					_this.$store.commit('setRequest', {
						valid: false,
						url: `role/create`,
						type: 'success',
						msg: `角色${(props.item.status) ? '授权' : '解除授权'}成功`
					})
        }
      })
		},
		selectedPower(props) {
			// 多个权限授权/取消授权
			let _this = this
			let items = []
			this.loading.isLoading = true
			this.selected.map(item => {
				items.push(item.ruleName)
			})
      Axios.post(`permission/remove?id=${this.power.name}`,
				{
					items: items,
					status: props ? 1 : 0,
					pid: this.activeProject.pid
				}
			)
      .then(res => {
        if(res.data.code === 1){
					this.selected.map(item => {
						item.status = props
					})
        }
      })
			.finally(() => {setTimeout(() => {
				this.loading.isLoading = false
				}, 1000)
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
			this.searchClass.count = 0
			this.searchClass.option.path = `permission/assign?iipsearch=true&id=${this.power.name}&pid=${this.activeProject.pid}`
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
