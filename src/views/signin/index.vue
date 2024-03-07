<template>
	<div>
		<page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader>
  	<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<v-container class="container-full-width" grid-list-md>
					<v-layout wrap>
						<v-flex xs12 sm12 md12>
							<v-dialog content-class="v-dialog-noradius" v-model="dialog" max-width="1200px">
								<app-card
									customClasses="card-table"
									:fullBlock="true"
									colClasses="xl12 lg12 md12 sm12 xs12"
								>
								<div style="width:95%;height:1px;padding-top:20px;"></div>
									<h3 style="text-align:center;">历史签到</h3>
									<v-date-picker
										id="historyDate"
										no-title
										locale="zh-cn"
						        v-model="historyDate"
						        :events="historyDateEvents"
						        full-width
						        event-color="green"
										multiple
						        @input="historyDateInput"

						      ></v-date-picker>
									<h3 style="text-align:center;">{{getHistoryTitle}}</h3>
									<v-card-title>
										<v-spacer></v-spacer>
										<!-- <v-text-field
											append-icon="search"
											:label="$t('message.TypeKeywordToSearch')"
											single-line
											hide-details
											v-model="historySearch"
										>
										</v-text-field> -->
										<v-btn flot left
											color="#fff"
											class="btn-large"
											@click="viewInMapHistory"
										>
											<v-icon color="#4A7BAF">map</v-icon>
											<span class="btn-font-color">在地图内查看</span>
										</v-btn>
									</v-card-title>
									<v-data-table
										id="historyTable"
										v-model="selected"
										:headers="ht.headers"
										:items="history"
										:search="ht.search"
										:light="true"
										:loading="ht.isLoad"
										:no-data-text="nodata"
										:no-results-text="noSeachResult"
										:pagination.sync="ht.pagination"
										:rows-per-page-text="$t('message.searchPerpage')"
										class="elevation-1"
										:rows-per-page-items="ht.pagination.rowsPerPage_item"
									>
										<template slot="headers" slot-scope="props">
											<tr>
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
											<tr :active="props.selected">
												<td class="text-xs-center">{{ props.item.unit }}</td>
												<td class="text-xs-center">{{ props.item.full_name }}</td>
												<td class="text-xs-center">{{ props.item.formatted_address }}</td>
												<td class="text-xs-center">{{ props.item.created_at }}</td>
												<td class="text-xs-center">
													<a v-if="props.item.images" target="_blank" :href="baseServes + '/' + props.item.images">预览</a>
													<span v-else>无照片</span>
												</td>
												<td class="text-xs-center">
													<a v-if="props.item.formatted_address" @click="viewMap(props.item)" href="javascript:void(0)">查看地图</a>
													<span v-else>查看地图</span>
												</td>
												<td class="text-xs-center">
													<v-tooltip top>
														<v-icon
															slot="activator"
															@click.stop="downLoad(props.item, 'edit')"
														>
				                      {{props.item.formatted_address ? 'done' : 'close'}}
														</v-icon>
														<span>{{props.item.formatted_address ? '已签到' : '未签到'}}</span>
													</v-tooltip>
												</td>
											</tr>
										</template>
										<v-pagination v-model="ht.pagination.pageFake" :length="getPageCountAllDialog"></v-pagination>
										<template slot="pageText" slot-scope="props">
											<div class="history-table-pagination text-xs-center pt-2">
												<v-pagination v-model="pagination.pageFake" :length="getPageCountAllDialog"></v-pagination>
											</div>
											当前 {{ props.pageStart }} - {{ props.pageStop }} 条
										  总数：{{ht.pagination.totalCount ? ht.pagination.totalCount : props.itemsLength }}
										 	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp第 {{ht.pagination.page}} 页	&nbsp 共 {{ht.pagination.page}} 页
										</template>
									</v-data-table>
								</app-card>
							</v-dialog>
						</v-flex>
					</v-layout>
				</v-container>
				<div style="display:block; width:100px; margin:0 10px;" v-for="item in dateList">
					<v-btn flot left
						:color="item.active?'#C5D4E1':'#fff'"
						class="btn-large btn-mini"
						@click="dateClickHandel(item)"
					>
						<v-icon :class="item.active?'v-icon-active':''" color="#4A7BAF">{{item.icon}}</v-icon>
						<span class="btn-font-color">{{item.text}}</span>
					</v-btn>
				</div>
				<div>
					<v-menu
						class="signin-date-picker"
						ref="datemenu"
						:close-on-content-click="false"
						v-model="datemenu"
						:nudge-right="40"
						:return-value.sync="date"
						lazy
						transition="scale-transition"
						offset-y
						full-width
						min-width="290px"
					>
						<v-text-field
							slot="activator"
							v-model="date"
							label="选择日期"
							prepend-icon="event"
							readonly
						></v-text-field>
						<v-date-picker
							 v-model="date"
						   locale="zh-cn"
						   @input="datePickSave($refs)"
							 :allowed-dates="allowedDates"
						 >
						</v-date-picker>
					</v-menu>
				</div>
				<message
				:model = "message"
				:type = "messageType"
				></message>
				<app-card
					customClasses="card-table"
					:fullBlock="true"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<h3 style="text-align:center;">{{active.date.value}}日 签到列表</h3>
					<v-card-title>
						<v-spacer></v-spacer>
						<!-- <v-text-field
							append-icon="search"
							:label="$t('message.TypeKeywordToSearch')"
							single-line
							hide-details
							v-model="search"
						>
						</v-text-field> -->
						<v-btn flot left
							color="#fff"
							class="btn-large"
							@click="viewInMap"
						>
							<v-icon color="#4A7BAF">map</v-icon>
							<span class="btn-font-color">在地图内查看</span>
						</v-btn>
					</v-card-title>
					<v-data-table
						v-model="selected"
						:headers="headers"
						:items="items"
						:search="search"
						:light="true"
						:loading="isLoad"
						:no-data-text="nodata"
						:no-results-text="noSeachResult"
						:pagination.sync="pagination"
						:rows-per-page-text="$t('message.searchPerpage')"
						class="elevation-1"
						:rows-per-page-items="pagination.rowsPerPage_item"
					>
						<template slot="headers" slot-scope="props">
							<tr>
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
							<tr :active="props.selected">
								<td class="text-xs-center">{{ props.item.unit }}</td>
								<td class="text-xs-center">{{ props.item.full_name }}</td>
								<td class="text-xs-center">{{ props.item.formatted_address }}</td>
								<td class="text-xs-center">{{ props.item.created_at }}</td>
								<td class="text-xs-center">
									<a v-if="props.item.formatted_address" @click="viewMap(props.item)" href="javascript:void(0)">查看地图</a>
									<span v-else>查看地图</span>
								</td>
								<td class="text-xs-center">
									<a v-if="props.item.images" target="_blank" :href="baseServes + '/' + props.item.images">预览</a>
									<span v-else>无照片</span>
								</td>
								<td class="text-xs-center">
									<a v-if="props.item.history" @click="viewHistory(props.item.user_id)" href="javascript:void(0)">查看历史</a>
									<span v-else>无历史</span>
								</td>
								<td class="text-xs-center">
									<v-tooltip top>
										<v-icon
											slot="activator"
											@click.stop="downLoad(props.item, 'edit')"
										>
                      {{props.item.formatted_address ? 'done' : 'close'}}
										</v-icon>
										<span>{{props.item.formatted_address ? '已签到' : '未签到'}}</span>
									</v-tooltip>
								</td>
							</tr>
						</template>
						<template slot="pageText" slot-scope="props">
							当前 {{ props.pageStart }} - {{ props.pageStop }} 条
						  总数：{{pagination.totalCount ? pagination.totalCount : props.itemsLength }}
						 	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp	&nbsp第 {{pagination.page}} 页	&nbsp 共 {{pagination.page}} 页
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
import RouteList from '@/router/routerList'
import DateHandel from '@/tools/dateHandel'

export default {
  data() {
    return {
			dialog: false,
			dialogModel: '',
			searchLoading: false,
			parentNameItems: [],
			routeItems: [],
			fontend_pathItems: [],
			pagination: {
				descending: true,
				getFullPage: false,
        sortBy: 'full_name',
				totalCount: null,
				rowsPerPage: 15,
				perPage: 15,
				page: 1,
				pageFake: 1,
				rowsPerPage_item: [ 15, 30, 50, 100, 1000, { "text": "全部", "value": -1 } ]
      },
      selected: [],
			isLoad: true,
      loader: false,
      required: {
				name: v => !!v || `请输入菜单名称`
			},
      search: "",
			nodata: '暂无数据',
			noSeachResult: '暂无搜索结果',
      headers: [
				// {	text: "编号", value: "id", sortable: true },
        { text: "检验单位", value: "unit", sortable: true },
				{ text: "签到人", value: "person", sortable: true },
        { text: "签到地点", value: "localtion", sortable: true },
        { text: "时间", value: "created_at", sortable: true },
				{ text: "地图", value: "map", sortable: false },
				{ text: "照片", value: "photo", sortable: false },
				{ text: "历史记录", value: "history", sortable: false },
				{ text: "签到", value: "signin", sortable: false }
      ],
			ht: {
				historySearch: "",
				headers: [
					// {	text: "编号", value: "id", sortable: true },
	        { text: "检验单位", value: "unit", sortable: true },
					{ text: "签到人", value: "person", sortable: true },
	        { text: "签到地点", value: "localtion", sortable: true },
	        { text: "时间", value: "created_at", sortable: true },
					{ text: "照片", value: "photo", sortable: false },
					{ text: "地图", value: "map", sortable: false },
					{ text: "签到", value: "signin", sortable: false }
	      ],
				pagination: {
					descending: true,
					getFullPage: false,
	        sortBy: 'full_name',
					totalCount: null,
					rowsPerPage: 15,
					perPage: 15,
					page: 1,
					pageFake: 1,
					rowsPerPage_item: [ 15, 30, 50, 100, 1000, { "text": "全部", "value": -1 } ]
	      },
				isLoad: false
			},
      items: [],
			edited: {
				editedIndex: -1,
				editedItem: {
					name: '',
					order: null,
					describe: ''
				},
				defaultItem: {
					name: '',
					order: null,
					describe: ''
				}
			},
			message: {
				show: false,
				type: '',
				title: '',
				msg: ''
			},
			messageType: {model: 'confim', func: this.checked},
			isLoading: false,
			datemenu: false,
			dateList:[
				{
					text: '今天',
					value: DateHandel.getToday(),
					icon: 'date_range',
					active: true
				},
				{
					text: '昨天',
					value: DateHandel.getYesterday(),
					icon: 'date_range',
					active: false
				}
			],
			date: null,
			active: {
				date: {
					text: '今天',
					value: DateHandel.getToday(),
					icon: 'date_range',
					active: true
				},
				historyId: null
			},
			history: [],
			historyDate: []
    }
  },
  mounted() {
		this.init()
  },
	computed: {
		...mapGetters(["selectedSidebarBgImage"]),
		getPageCountAll() {
			return	Math.ceil(this.pagination.totalCount / (this.pagination.rowsPerPage > -1 ? this.pagination.rowsPerPage : this.pagination.totalCount))
		},
		getPageCountAllDialog() {
			return	Math.ceil(this.ht.pagination.totalCount / (this.ht.pagination.rowsPerPage > -1 ? this.ht.pagination.rowsPerPage : this.ht.pagination.totalCount))
		},
		baseServes() {
			const serve = this.$API
			return serve
		},
		getHistoryTitle() {
			let date = [...this.historyDate],
			arr = DateHandel.sort(date)
			date = null
			if (arr.length > 0) {
				if (arr.length === 1) {
					return arr[0] + '签到记录'
				}else {
					return arr[0] + ' - ' +  arr[arr.length-1] + '签到记录'
				}
			}
			return '所有签到记录'
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
			if(!this.dialog) {
				 this.history = []
				 this.historyDate = []
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
		init() {
			this.getPageData()
		},
		getPageData() {
			const _this = this
			this.isLoad = true
			const request = Axios.get(`punch-in/index?sort=${(_this.pagination.descending ? '-' : '') + this.pagination.sortBy}&created_at=${this.active.date.value}&page=${this.pagination.pageFake}&per-page=${this.pagination.rowsPerPage}`)
			request.then(res => {
				if (res.data.code === 1) {
					const {paging, result} = res.data.data
					_this.items = result === '' ? [] : result
					_this.pagination.totalCount = paging.count
				}
			})
			request.finally(()=>{_this.isLoad = false})
		},
		datePickSave(e) {
			e.datemenu.save(this.date)
			this.dateList.map(item => {
				item.active = false
			})
			this.active.date = {
				text: this.date,
				value: this.date,
				icon: 'date_range',
				active: true
			}
			this.getPageData()
		},
		allowedDates(item) {
			const today = DateHandel.getToday()
			if (today && today !== '') {
				return item <= today
			}
			return true
		},
		dateClickHandel(e) {
			this.date = null
			this.dateList.map(item => {
				item.active = false
			})
			e.active = true
			this.active.date = e
			this.getPageData()
		},
		viewHistory(eid) {
			const _this = this
			if(eid.isNone()) {
				return
			}
			this.active.historyId = eid
			this.dialog = true
			this.loading = true
			const request = Axios.get(`punch-in/index?user_id=${ eid }`)
			request.then(res => {
				this.loading = false
				if (res.data.code === 1) {
					const {paging, result} = res.data.data
					_this.history = result === '' ? [] : result
					_this.ht.pagination.totalCount = paging.count
				}
			})
		},
		viewMap(item) {
			let pagination = this.pagination
			pagination.back = true
			this.$store.dispatch('setParams', {role: pagination})
			item.x = item.longitude
			item.y = item.latitude
			this.$store.dispatch('mapActions', [
				item
			])
			let routeData = this.$router.resolve({
				name: '地图预览'
			})
      window.open(routeData.href, '_blank')
		},
		historyDateEvents(date) {
			let arr = []
			this.history.map(item => {
				arr.push(DateHandel.getToday(item.created_at))
			})
			return arr.includes(date) ? true : false
		},
		historyDateInput(date) {
			const _this = this,
			arr = this.historyDate
			let sendDate
			if (arr.length === 2) {
			  const sort = DateHandel.sort(this.historyDate)
			  const allDate = DateHandel.getTwoTimeSection(sort[0], sort[sort.length-1])
				this.historyDate = allDate
				sendDate = allDate[0] + ' - ' + allDate[allDate.length - 1]
			} else if(arr.length > 2) {
				this.historyDate = [date[date.length - 1]]
			}else {
				sendDate = date
			}
			const request = Axios.get(`punch-in/index?user_id=${ this.active.historyId }&created_at=${ sendDate }`)
			request.then(res => {
				if (res.data.code === 1) {
					const {paging, result} = res.data.data
					_this.history = result === '' ? [] : result
					_this.ht.pagination.totalCount = paging.count
				}
			})
		},
		viewInMap() {
			const items = this.items,
			arr = items.filter(item => {
				item.x = item.longitude
				item.y = item.latitude
				return item.longitude && item.latitude
			})
			if (arr.length < 1) {
				this.$store.commit('setRequest', {
					valid: false,
					url: ``,
					type: 'error',
					msg: `地图内预览失败，当前列表没有有效的签到对象`
				})
				return
			}
			this.$store.dispatch('mapActions', arr)
			let routeData = this.$router.resolve({
				name: '地图预览'
			})
      window.open(routeData.href, '_blank')
		},
		viewInMapHistory() {
			const items = this.history,
			arr = items.filter(item => {
				item.x = item.longitude
				item.y = item.latitude
				return item.longitude && item.latitude
			})
			if (arr.length < 1) {
				this.$store.commit('setRequest', {
					valid: false,
					url: ``,
					type: 'error',
					msg: `地图内预览失败，当前列表没有有效的签到对象`
				})
				return
			}
			this.$store.dispatch('mapActions', arr)
			let routeData = this.$router.resolve({
				name: '地图预览'
			})
			window.open(routeData.href, '_blank')
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
	.signin-date-picker {
		margin-left: 30px;
	}
	#historyDate .v-date-picker-table__event {
		height: 10px;
		width: 10px;
		bottom: 2px;
	}
	#historyDate, #historyDate .theme--light {
		/* background: rgba(0, 0, 0, 0) !important; */
	}
	#historyTable .v-datatable__actions {
		padding-bottom: 60px;
	}

</style>
