<!-- 组件 -->
<!-- liveshow 首页展示 -->
<template>
  <div style="margin:0 auto;width: 100%;height: 100%;">
    <Loading :opacity="1" v-if="isLoading && loading"></Loading>
    <v-container id="tour__home__1" fluid grid-list-xl py-0>
      <v-layout row wrap>
        <v-flex xs12 sm1 md1></v-flex>
        <v-flex xs12 sm2 md2 v-for="(item, index) in menu" :key="index">
          <v-btn  color="#fff" :to="item.href" class="btn-large">
            <v-icon color="#4A7BAF">{{item.icon}}</v-icon>
            <span class="btn-font-color">{{ $t(item.name) }}</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <div style="margin-top: 40px;"></div>
    <Card
      style="margin:0 auto;width:98%;"
      class="cursor-pointer"
      type="view"
      :width=300
      :cards="cards"
      :clickHandel="cardClickHandel"
      :border-shadow="false"
      flat
    >
    </Card>
    <!-- <template>
      <v-container
        fluid
        grid-list-md
      >
        <template v-for="(item, index) in history">
          <v-layout row wrap>
            <v-flex xs3 sm3 md3>
              <span>{{ item.begin + ' - ' + (item.end ? item.end.split(' ')[1] : '') }}</span>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <span>{{ '时长 ' + (item.duration || 0) + '分钟' }}</span>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <v-tooltip top style="max-height: 20px;">
                <template slot="activator">
                  <span>{{ textOmit(item.peoples, 2) }}</span>
                </template>
                <span>{{ totalPeople(item.peoples) }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <span>{{ item.streamer.user_name + ` (${item.streamer.full_name ? item.streamer.full_name : ''}) `}}</span>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <v-tooltip top style="max-height: 20px;">
                <template slot="activator">
                  <v-btn flat icon style="margin: 0; margin-top:-5px;">
                    <v-icon color="#3EA8C2">replay</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('message.replay') + $t('message.video') }}</span>
              </v-tooltip>
            </v-flex>

            <div v-if="index !== (history.length - 1)" style="width:95%;height:1px;background:rgba(150,150,150,1);margin:10px auto;"></div>
          </v-layout>
        </template>
      </v-container>
    </template> -->
    <template >
      <div style="display:inline-block;width: 50%;">
        <Chats class="v-charts"></Chats>
      </div>
      <div style="display:inline-block;width: 50%;">
        <Map class="v-charts"></Map>
      </div>
    </template>
  </div>
</template>
<script>
let _this
import Card from '@/components/Card/Card'
import DateHandel from '@/tools/dateHandel';
import Map from './map.vue';
import Chats from './chats.vue';
import RouterList from '@/router/routerList'
import { mapGetters } from 'vuex'
export default {
  components: {
    Card,
    Chats,
    Map
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    keyValue : {
      cooperation_time: {
        text: {
          cn: '协作总时长',
          en: 'Cooperation Time'
        },
        unit: {
          cn: '分钟',
          en: 'Minutes'
        },
        type: 'number'
      },
      cooperation_count: {
        text: {
          cn: '协作总次数',
          en: 'Cooperation Number'
        },
        unit: {
          cn: '次',
          en: 'Times'
        },
        type: 'number'
      },
      average_cooperation_time: {
        text: {
          cn: '平均每日协作时长',
          en: 'AVG Cooperation Time'
        },
        unit: {
          cn: '分钟',
          en: 'Minutes'
        },
        type: 'number'
      },
      location: {
        text: {
          cn: '上次在线地区',
          en: 'Last Online Region'
        },
        unit: {
          cn: '',
          en: ''
        },
        type: 'string'
      },
    },
    menu: [
      {
        name: 'message.liveshow_record', //远程协作记录
        href: RouterList.child.liveshow_record.path,
        icon: 'assignment'
      },
      {
        name: 'message.operation_record',  //作业记录
        href: RouterList.child.record.path,
        icon: 'settings_applications'
      },
      {
        name: 'message.videoLibrary',  //视频作业库
        href: RouterList.child.videoLibrary.path,
        icon: 'videocam'
      },
      {
        name: 'message.formLibrary',  //表单作业库
        href: RouterList.child.formLibrary.path,
        icon: 'bookmarks'
      }
    ],
    isLoading: false,
    cards: [],
    defaultCard: {
      id: null,
      step: null,
      title: null,
      describe: null,
      type:'view',
      flex: 3,
      isLoad: true,
      style: {
        backgroundColor: '#95a5a6',
        color: '#fff',
        fontSize: '30px',
        boxShadow: '0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12) !important;'
      },
      label: {title: '', text: ''}
    },
    defaultHistory: {
      id: null,
      begin: null,
      end: null,
      // duration: '时长 30分钟',
      peoples: [],
      streamer: {}
    },
    history: [],
    pagination: {
      rowsPerPage: 3,
      page: 1
    },
  }),
  computed: {
		...mapGetters(['selectedLocale'])
  },
  watch: {
    selectedLocale() {
      _this.setCards(_this.originMenuDatas)
    }
  },
  mounted() {
    _this = this
    this.getPageData()
  },
  methods: {
    getPageData() {
      _this.isLoading = true
      _this.$axios.get(`live/live-room-statistics?page=${_this.pagination.page}&per-page=${_this.pagination.rowsPerPage}`)
      .then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          // const { live_user_statistics, room_user_history } = dat
          _this.setCards(dat)
          // _this.setHistory(room_user_history)
          _this.originMenuDatas = dat
          _this.isLoading = false
        }
      })
    },
    setCards(card) {
      if (!card) {
        return
      }
      const keyValue = _this.keyValue
      let count = 0
      let arr = []
      const locale = _this.selectedLocale.locale
      Object.keys(keyValue).forEach((item, i) => {
        let model = _this.deepClone(_this.defaultCard)
        model.id = model.step = count++
        model.title = keyValue[item].text[locale] || keyValue[item].text.cn
        model.describe = card[item] ? (keyValue[item].type === 'number' ? parseInt(card[item]) : card[item]) + keyValue[item].unit[locale] : _this.$t("message.nothing")
        arr.push(model)
      })
      _this.cards = arr
    },
    setHistory(history) {
      if (!history) {
        return
      }
      _this.history = history
    },
    cardClickHandel() {

    },
    getDiffFormatMinute(end, begin) {
      return DateHandel.getDiffFormatMinute(end, begin)
    },
    textOmit(arr, len = 2) {
      let text = ''
      const forTarget = arr.length > len ? len : arr.length
      for (var i = 0; i < forTarget; i++) {
        const un = arr[i].user_name
        ,fn = arr[i].full_name
        text += (un + (fn ? ` (${fn})` : '') + (i < arr.length -1 ? '，' : ''))
      }
      if (arr.length > len) {
        return text + '等' + arr.length + '人'
      }
      return text
    },
    totalPeople(arr) {
      let text = ''
      if (arr.length === 1) {
        return text + (arr[0].user_name + (arr[0].full_name ? ` (${arr[0].full_name})` : ''))
      }
      return arr.reduce((current, next) => {
        const total = function() {
          const un = this.user_name
          ,fn = this.full_name
          if (!un || !fn) {
            return ''
          }
          return (un + (fn ? ` (${fn})` : '') + '，')
        }
        text += (total.call(current) + total.call(next))
        return text
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width:600px) and (max-width:1200px){
  .v-charts{
    margin:0 1%;
    display: inline-block;
  }
}
@media screen and (min-width:1200px) and (max-width:1600px){
  .v-charts{
    margin:1% 2%;
    display: inline-block;
  }
}
@media screen and (min-width:1600px){
  .v-charts{
    margin:2% 5%;
    display: inline-block;
  }
}
</style>
