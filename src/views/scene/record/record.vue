<template>
<div>
  <page-title-bar></page-title-bar>
  <app-section-loader :status="loader"></app-section-loader>
  <v-container fluid grid-list-xl py-0>
    <v-layout row wrap>
      <message :model="message" :type="messageType"></message>
      <app-card customClasses="card-table" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">

        <v-container id="tour__wtf__control__1" grid-list-md class="container-full-width container-margin padding-none">
          <v-layout wrap>
            <v-flex xs2 sm2 md1>
              <h3 class="flex-title">{{ $t("message['Submission date']") }}</h3>
            </v-flex>
            <v-flex xs10 sm10 md10>
              <v-container grid-list-md class="container-full-width margin-padding-none">
                <v-layout wrap class="margin-padding-none">
                  <v-flex xs3 sm3 md3 xl2 v-for="item in reportDate" :key="item.id">
                    <v-btn @click.stop="selectionClickHandel('reportDate', item.id)" :color="item.active?'#C5D4E1':'#fff'" class="btn-large btn-mini">
                      <v-icon color="#4A7CAF" :class="item.active?'v-icon-active':''">
                        {{item.icon}}
                      </v-icon>
                      <span class="btn-font-color">{{item.text}}</span>
                    </v-btn>
                  </v-flex>
                  <v-flex class="v-menu-datepicker" xs4 sm4 md3>
                    <v-menu ref="beginMenu" :close-on-content-click="false" v-model="beginMenu" :nudge-right="40" :return-value.sync="beginDate" lazy transition="scale-transition" offset-y full-width min-width="290px">
                      <v-text-field slot="activator" v-model="beginDate" :label="$t('message.BeginDate')" prepend-icon="event" readonly></v-text-field>
                      <v-date-picker v-model="beginDate" :allowed-dates="allowedBeginDates" locale="zh-cn" @input="beginDatePickSave($refs)">
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs4 sm4 md3>
                    <v-menu ref="endMenu" :close-on-content-click="false" v-model="endMenu" :nudge-right="40" :return-value.sync="endDate" lazy transition="scale-transition" offset-y full-width min-width="290px">
                      <v-text-field slot="activator" v-model="endDate" :label="$t('message.EndDate')" prepend-icon="event" readonly></v-text-field>
                      <v-date-picker v-model="endDate" :allowed-dates="allowedEndDates" locale="zh-cn" @input="endDatePickSave($refs)">
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container id="tour__wtf__control__5" class="container-full-width container-margin" grid-list-md>
          <v-layout wrap>
            <v-flex xs2 sm2 md1>
              <h3 class="flex-title">{{ $t("message.JobType") }}</h3>
            </v-flex>
            <v-flex xs10 sm10 md10>
              <v-container grid-list-md class="container-full-width margin-padding-none">
                <v-layout wrap class="margin-padding-none">
                  <v-flex xs3 sm3 md3 xl2 v-for="item in reportType" :key="item.id">
                    <v-btn @click.stop="selectionClickHandel('reportType', item.id)" :color="item.active?'#C5D4E1':'#fff'" class="btn-large btn-mini">
                      <v-icon color="#4A7CAF" :class="item.active?'v-icon-active':''">{{item.icon || 'blur_linear'}}</v-icon>
                      <span class="btn-font-color">{{item.text}}</span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container id="tour__wtf__control__7" class="container-full-width container-margin" grid-list-md>
          <v-layout wrap>
            <v-flex xs2 sm2 md1>
              <h3 class="flex-title">{{ $t("message.staff") }}</h3>
            </v-flex>
            <v-flex xs10 sm10 md10>
              <v-container grid-list-md class="container-full-width margin-padding-none">
                <v-layout wrap class="margin-padding-none">
                  <v-flex xs4 sm3 md3 xl2 v-for="item in insPerson" :key="item.id">
                    <v-btn @click.stop="selectionClickHandel('insPerson', item.id)" :color="item.active?'#C5D4E1':'#fff'" class="btn-large btn-mini">
                      <v-icon color="#4A7CAF" :class="item.active?'v-icon-active':''">{{item.icon || 'blur_linear'}}</v-icon>
                      <span class="btn-font-color">{{item.text}}</span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container id="tour__wtf__control__3" grid-list-md class="container-full-width container-margin">
          <v-layout wrap>
            <v-flex xs2 sm2 md1>
              <h3 class="flex-title">{{ $t("message.JobDetail") }}</h3>
            </v-flex>
            <v-flex xs4 sm4 md4>
              <Search @bindModel="loadFactorySearch" :label="$t('message.TypeKeywordToSearch')" :clickHandler="loadFactory" :loading="searchLoading" :items="factory" :vModelEdit="active.factory" @clear="factoryClear"></Search>
            </v-flex>
          </v-layout>
        </v-container>

        <div id="tour__manager__upload__table" class="div-relative">
          <h3 style="text-align:center;">{{getTableTitle}}</h3>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" :label="$t('message.TypeKeywordToSearch')" single-line hide-details v-model="search" @focus.once="searchClass.searchFocus" @input="searchClass.searchChange(search)">
            </v-text-field>
          </v-card-title>
          <v-data-table v-model="selected" :headers="selectedLocale.locale === 'en' ? headersEnglish : headers" :items="((search || search !== '') && searchClass.response.status) ? searchClass.response.data.result : items" :search="search" :light="true" :loading="tableLoading" :no-data-text="nodata"
            :no-results-text="noSeachResult" :pagination.sync="(search || search !== '' ) ? paginationAll : pagination" :rows-per-page-text="$t('message.searchPerpage')" :rows-per-page-items="pagination.rowsPerPage_item" class="elevation-1">
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
                <th v-for="header in props.headers" :key="header.value" @click="changeSort(header.value)" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" align="center">
                  {{ header.text }}
                  <v-icon small>arrow_upward</v-icon>
                </th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <tr :active="props.selected" @click="props.selected = !props.selected">
                <!-- <td class="text-xs-center">
										<v-tooltip top max-width="200">
											<template slot="activator">
												<span v-html="searchClass.setWordColor(props.item.description)">{{props.item.description === null ? '' : props.item.description.length > 20 ? props.item.description.substring(0, 20) + '...' : props.item.description }}</span>
											</template>
											<span>{{props.item.description}}</span>
										</v-tooltip>
									</td> -->

                <td class="text-xs-center table-min-width">
                  <v-tooltip top>
                    <template slot="activator">
                      <a @click="checkDetail(props.item)">
                        <span>{{ props.item.name }}</span>
                        <v-icon light>{{props.item.type === 'video' ? 'videocam' : 'assignment'}}</v-icon>
                      </a>
                    </template>
                    <span>{{ $t("message['Click to check details']") }}</span>
                  </v-tooltip>
                </td>
                <td class="text-xs-center" v-html="searchClass.setWordColor(props.item.created_by)"></td>
                <td class="text-xs-center" v-html="searchClass.setWordColor(props.item.location)"></td>
                <td class="text-xs-center" v-html="searchClass.setWordColor(props.item.created_at)"></td>
                <td class="text-xs-center">
                  <v-tooltip top>
                    <v-icon slot="activator">
                      {{props.item.type === 'video' ? 'videocam' : 'assignment'}}
                    </v-icon>
                    <span> {{props.item.type === 'video' ? $t("message.video") : $t("message.form")}} </span>
                  </v-tooltip>
                </td>
                <!-- <td v-if="props.item.report_status == 0" class="text-xs-center text-color-red">不合格</td>
									<td v-else class="text-xs-center">合格</td> -->
                <td class="text-xs-center">
                  <v-tooltip top>
                    <v-btn slot="activator" icon  @click="checkDetail(props.item)">
                      <v-icon>
                        visibility
                      </v-icon>
                    </v-btn>
                    <span> {{ $t("message.view") }} </span>
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
        </div>
      </app-card>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import User from '@/auth/user'
import {
  mapState
} from 'vuex'
import Axios from 'axios'
import Card from '@/components/Card/Card'
import Search from '@/components/SearchInput'
import DateHandel from '@/tools/dateHandel'
import {
  mapGetters
} from 'vuex'

export default {
  components: {
    Card,
    Search
  },
  data() {
    return {
      dialog: false,
      loader: false,
      searchLoading: false,
      tableLoading: true,
      nodata: '暂无数据',
      noSeachResult: '暂无搜索结果',
      pagination: {
        getFullPage: false,
        sortBy: 'username',
        totalCount: 4,
        rowsPerPage: 15,
        perPage: 15,
        page: 1,
        pageFake: 1,
        rowsPerPage_item: [15, 30, 50, 100, 1000, {
          "text": "全部",
          "value": -1
        }]
      },
      headers: [{
          text: "作业内容",
          value: "name",
          sortable: true
        },
        {
          text: "提交人员",
          value: "created_by",
          sortable: true
        },
        {
          text: "提交地点",
          value: "location",
          sortable: true
        },
        {
          text: "提交时间",
          value: "created_at",
          sortable: true
        },
        {
          text: "作业类型",
          value: "type",
          sortable: true
        },
        {
          text: "操作",
          value: "null",
          sortable: false
        },
      ],
      headersEnglish: [{
          text: "name",
          value: "name",
          sortable: true
        },
        {
          text: "created by",
          value: "created_by",
          sortable: true
        },
        {
          text: "location",
          value: "location",
          sortable: true
        },
        {
          text: "created at",
          value: "created_at",
          sortable: true
        },
        {
          text: "type",
          value: "type",
          sortable: true
        },
        {
          text: "operating",
          value: "null",
          sortable: false
        },
      ],
      items: [],
      selected: [],
      active: {
        reportDate: {
          id: 0,
          active: true,
          type: 'reportDate',
          text: '所有日期',
          value: null
        },
        reportType: {
          id: 0,
          active: true,
          type: 'reportType',
          text: '所有作业',
          value: null
        },
        factory: {
          id: 0,
          active: true,
          type: 'factory',
          text: '所有制造厂',
          value: null
        },
        insPerson: {
          id: 0,
          active: true,
          type: 'insPerson',
          text: '所有检验员',
          value: null
        }
      },
      search: "",
      factory: [],
      equipment: [],
      batch: [],
      insPerson: [{
        id: null,
        text: '所有检验员',
        icon: 'person',
        active: true
      }],
      beginMenu: '',
      endMenu: '',
      beginDate: null,
      endDate: null,
      message: {
        show: false,
        type: '',
        title: '',
        msg: ''
      },
      messageType: {
        model: 'confim',
        func: this.checked
      },
      showMore: {
        value: true
      },
      isLoading: false
    }
  },
  mounted() {
    const user = new User()
    const userinfo = user.getUser().user || user.getUser()
    this.init()
  },
  computed: {
    reportDate() {
      const _this = this
      return [{
          id: 0,
          text: _this.langFormat('All Date'),
          icon: 'pages',
          active: true
        },
        {
          id: 1,
          text: _this.langFormat('Today'),
          icon: 'today',
          active: false
        },
        {
          id: 2,
          text: _this.langFormat('Yesterday'),
          icon: 'date_range',
          active: false
        },
        {
          id: 3,
          text: _this.langFormat('This Week'),
          icon: 'today',
          active: false
        },
        {
          id: 4,
          text: _this.langFormat('Last Week'),
          icon: 'date_range',
          active: false
        },
        {
          id: 5,
          text: _this.langFormat('This Month'),
          icon: 'today',
          active: false
        },
        {
          id: 6,
          text: _this.langFormat('Last Month'),
          icon: 'date_range',
          active: false
        }
      ]
    },
    reportType() {
      const _this = this
      return [{
          id: 0,
          text: _this.langFormat('all'),
          icon: 'pages',
          active: true,
          value: null
        },
        {
          id: 1,
          text: _this.langFormat('Form'),
          icon: 'assignment',
          active: false,
          value: 'form'
        },
        {
          id: 2,
          text: _this.langFormat('video'),
          icon: 'videocam',
          active: false,
          value: 'video'
        }
      ]
    },
    getPageCountAll() {
      return Math.ceil(this.pagination.totalCount / (this.pagination.rowsPerPage > -1 ? this.pagination.rowsPerPage : this.pagination.totalCount))
    },
    getTableTitle() {
      return this.$t("message.RecordList")
    },
    getDateFormat() {
      const active = this.active.reportDate.id
      let dateTime, dateTimeSection
      switch (active) {
        case 1:
          dateTime = DateHandel.getToday()
          dateTimeSection = DateHandel.getToday()
          break
        case 2:
          dateTime = DateHandel.getYesterday()
          dateTimeSection = DateHandel.getYesterday()
          break
        case 3:
          dateTime = DateHandel.getToweekText()
          dateTimeSection = DateHandel.getToweekSection()
          break
        case 4:
          dateTime = DateHandel.getLastweekText()
          dateTimeSection = DateHandel.getLastweekSection()
          break
        case 5:
          dateTime = DateHandel.getTomonth()
          dateTimeSection = DateHandel.getTomonthSection().begin + ' - ' + DateHandel.getTomonthSection().end
          break
        case 6:
          dateTime = DateHandel.getLastmonth()
          dateTimeSection = DateHandel.getLastmonthSection().begin + ' - ' + DateHandel.getLastmonthSection().end
          break
        default:
          dateTime = null
          dateTimeSection = null
          break
      }
      return {
        text: dateTime,
        value: dateTimeSection
      }
    },
    baseServes() {
      const serve = this.$API
      return serve
    },
		...mapGetters(['selectedLocale'])
  },
  watch: {
    'pagination.pageFake': function() {
      this.selected = []
      if (!this.pagination.getFullPage) {
        this.getPageData()
      } else {
        this.pagination.page = this.pagination.pageFake
      }
    },
    'pagination.sortBy': function() {
      if (!this.pagination.getFullPage) {
        this.getPageData()
      }
    },
    'pagination.rowsPerPage': function() {
      if (!this.pagination.getFullPage) {
        this.getPageData()
      }
    },
    'selectedLocale.locale': function () {
      const _this = this
      (function() {
        const units = _this.originUnitPerson
        if (!units) {
          return
        }
        _this.setUnitPerson(units)
      })()

      (function() {
        const factorys = _this.originFactory
        if (!factorys) {
          return
        }
        _this.setFactory(factorys)
      })()

    }
  },
  methods: {
    init() {
      // this.tourStart()
      this.getUnitPerson()
      this.getPageData()
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
      this.getPageData()
    },
    getPageData() {
      let _this = this
      this.tableLoading = true
      const {
        reportDate,
        reportType,
        factory,
        insPerson
      } = this.active
      let arr = [
        factory.active && factory.value ? `&content=${factory.value}` : '&content=',
        reportType.active && reportType.value ? `&type=${reportType.value}` : '&type=',
        insPerson.active && insPerson.value ? `&user_id=${insPerson.value}` : '&user_id=',
        reportDate.active && reportDate.value ? `&time=${reportDate.value} ` : '&time='
      ]
      arr = arr.reduce((items = '', item) => {
        return items + item
      })
      this.pageDataURL = `job/index?` + arr
      Axios.get(this.pageDataURL + `&sort=${(_this.pagination.descending ? '-' : '') + this.pagination.sortBy}&page=${this.pagination.pageFake}&per-page=${this.pagination.rowsPerPage}`)
        .then(res => {
          if (res.data.code === 1) {
            const dat = res.data.data
            _this.items = dat.result === '' ? [] : dat.result
            // _this.pagination.totalCount = dat.paging.count
            _this.pagination.totalCount = dat.paging.count
            _this.searchClassInit()
          }
        })
        .finally(() => (this.tableLoading = false))
    },
    getUnitPerson() {
      let _this = this
      Axios.get(`job/get-user`)
        .then(res => {
          if (res.data.code === 1) {
            const dat = res.data.data
            _this.originUnitPerson = dat
            _this.setUnitPerson(dat)
          }
        })
    },
    setUnitPerson(dat) {
      const _this = this
      let arr = []
      arr.push({
        id: 0,
        text: _this.$t("message.all"),
        icon: 'people',
        active: true,
        value: null
      })
      dat ? dat.map(item => {
          arr.push({
            id: item.user_id,
            text: item.full_name,
            company: item.ins_unit_id,
            icon: 'person',
            active: false,
            value: item.user_id
          })
        }) :
        []
      _this.insPerson = arr
    },
    selectionClickHandel(type, eid) {
      let _this = this
      let active = this[type].filter(item => {
        item.active = item.id === eid ? true : false
        return item.id === eid
      })
      if (active.length > 0) {
        let obj = this.active[type]
        if (typeof obj === 'object') {
          obj.id = eid
          obj.type = type
          obj.text = active[0].text.replace(/\s+/g, "")
          obj.value = type === 'reportDate' ? this.getDateFormat.value : active[0].value
          obj.active = true
        }
        this.getPageData()
      }
    },
    allowedBeginDates(item) {
      const begin = this.beginDate
      const end = this.endDate
      if (end && end !== '') {
        return item <= end
      }
      return true
    },
    allowedEndDates(item) {
      const begin = this.beginDate
      const end = this.endDate
      if (begin && begin !== '') {
        return item >= begin
      }
      return true
    },
    beginDatePickSave(e) {
      e.beginMenu.save(this.beginDate)
      const begin = this.beginDate
      const end = this.endDate
      if (end) {
        this.reportDate.map(item => {
          item.active = false
        })
        this.active.reportDate = {
          type: 'reportDate',
          text: begin + ' - ' + end,
          value: begin + ' - ' + end,
          active: true
        }
        this.getPageData()
      }
    },
    endDatePickSave(e) {
      e.endMenu.save(this.endDate)
      const begin = this.beginDate
      const end = this.endDate
      if (begin) {
        map(item => {
          item.active = false
        })
        this.active.reportDate = {
          type: 'reportDate',
          text: begin + ' - ' + end,
          value: begin + ' - ' + end,
          active: true
        }
        this.getPageData()
      }
    },
    loadFactory() {
      let _this = this
      Axios.get(`job/index?time=&type=&user_id=&content=`)
        .then(res => {
          if (res.data.code === 1) {
            const dat = res.data.data.result
            _this.originFactory = dat
            _this.setFactory(dat)
          }
        })
    },
    setFactory(dat) {
      const _this = this
      let arr = []
      arr.push({
        header: _this.$t("message['All Job']")
      })
      dat.map(item => {
        arr.push({
          id: item.id,
          name: item.name,
          group: item.type === 'video' ? '视频作业' : '表单作业'
        })
      })
      this.factory = arr
    },
    loadFactorySearch(e) {
      if (typeof e === 'object') {
        return
      }
      this.active.factory.active = true
      this.active.factory.value = this.active.factory.text = e
      this.active.factory.type = 'factory'
      this.getPageData()
    },
    factoryClear() {
      this.active.factory.active = false
      this.active.factory.value = null
      this.active.factory.type = 'factory'
      this.getPageData()
    },
    tourStart() {
      this.$tours.start('wtfControl', this)
    },
    checkDetail(item) {
      //访问作业详情二级页，将目前的pagination保存到vuex，并设置back为true
      // 参数item.name：作业名称
      let pagination = this.pagination
      pagination.back = true
      this.$store.dispatch('setParams', {
        sceneRecord: pagination
      })
      if (item.type === 'video') {
        this.$router.push({
          path: `/scene/record/video/${item.id}`
        })
      } else {
        window.open(this.$API + `/form/form/submissions?id=${item.form_id}#view/${item.id}`, '_blank')
      }
    },
    searchClassInit() {
      const handelFunc = function(data) {
        const dat = data.result
      }
      this.searchClass = new this.$Search({
        type: 'get',
        path: `${this.pageDataURL}&iipsearch=true`,
        body: {}
      }, 5000, handelFunc)
      this.paginationAll = this.searchClass.getDefaultPagination()
    },
    langFormat (key) {
      return this.$t("message['" + key + "']")
    }
  }
}
</script>
<style media="screen" scoped>
.table-min-width {
  min-width: 30%;
}
</style>
<style media="screen">
i {
  margin-bottom: 0.15rem !important
}

.text-xs-center {
  text-align: center !important
}

.write {
  color: #fff;
}

h1,
h2,
h3 {
  line-height: 50px;
}

.uploadBtn {
  position: static;
  margin: auto 0;
}

.active-value {
  font-weight: bold;
}

#weekPicker tr:hover>td>button {
  border-radius: 50%;
  background: #91BAFF;
}

.upLoadBtn {
  color: #fff;
  background: #464D69;
}

.uploading {
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: #ccc;
}

.uploading>div {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 100px;
}

.uploading span {
  margin-left: 1rem;
}

.chip-group-item {
  display: inline-block;
  margin: auto 0.2rem 0.2rem 0.2rem !important;
}

#hideDiv {
  cursor: pointer;
  -webkit-animation-name: fadeIn;
  /*动画名称*/
  -webkit-animation-duration: 3s;
  /*动画持续时间*/
  -webkit-animation-iteration-count: 1;
  /*动画次数*/
  -webkit-animation-delay: 0s;
  /*延迟时间*/
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
    /*初始状态 透明度为0*/
  }

  50% {
    opacity: 0;
    /*中间状态 透明度为0*/
  }

  100% {
    opacity: 1;
    /*结尾状态 透明度为1*/
  }
}

.line-title {
  line-height: 6rem;
}

.padding-none {
  padding: 0 !important;
}
</style>
