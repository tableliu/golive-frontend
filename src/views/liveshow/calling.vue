<!-- 组件 -->
<!-- 呼叫结果页面 -->
<template>
  <div>
    <v-dialog v-model="dialog" :width="getCallingWidth" transition="scale-transition" origin="center center" max-width="60%" min-width="20%" light persistent>
      <v-card class="v-card-table">
        <v-card-text class="text-xs-center">
          <v-avatar v-for="(item, index) in items" :key="index" size="60" class="calling-avatar">
              <div>
                <img
                  :src="item.avatar"
                >
                <span :style="getEnterColor(item.state)">{{ item.name }}</span>
              </div>
          </v-avatar>
        </v-card-text>
        <!-- 动画 -->
        <Jumper v-if="!getAllEnterStatus"></Jumper>
        <div class="calling">{{ getAllEnterStatus ? doneContext : $t("message['Calling']") }}</div>
        <div v-if="showEnter" class="calling">{{ getEnterRatio }}</div>
        <v-card-actions>
          <div class="v-card-actions-buttons calling-buttons">
            <slot name="actions"></slot>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Search from '@/components/SearchInput'
import { mapGetters } from 'vuex'
let _this
export default {
  components: {
    Search
  },
  props: {
    // 展示用户对象列表
    items: Array,
    // 显示|隐藏弹出层
    dialog: Boolean,
    // 显示|隐藏人员进入情况
    showEnter: Boolean,
    // 人员应答完毕展示文字
    doneContext: {
      type: String,
      default: '已全部应答完毕'
    }
  },
  data: () => ({
  }),
  beforeMount() {
    _this = this
  },
  computed: {
    ...mapGetters(["selectedLocale"]),
    // 获取弹出层的宽度,每个用户占比屏幕宽度10%(超过80%按80%计算,用户头像及文字换行)
    getCallingWidth() {
      const list = this.items
      if (list.length > 1) {
        const originWidth = list.length * 10
        return (originWidth > 80 ? 80 : originWidth) + '%'
      }else {
        return '20%'
      }
    },
    /**
		 * 获取人员进入情况
		 * @return  {String} 人员进入情况,接受人数,拒绝人数
		 */
    getEnterRatio() {
      // 获取接受人员的数组 state [0未应答 | 1接受 | -1拒绝]
      const enter = this.items.filter(item => {
        return item.state === 1
      })
        // 获取拒绝人员的数组 state [0未应答 | 1接受 | -1拒绝]
      const notEnter = this.items.filter(item => {
        return item.state === -1
      })
      return _this.selectedLocale.locale === 'en'
      ?
      `Personnel entry situation:${enter.length} / ${this.items.length} （${enter.length} accept,${notEnter.length} reject）`
      :
      `当前人员进入情况:${enter.length} / ${this.items.length} （${enter.length}人接受,${notEnter.length}人拒绝）`
    },
    /**
		 * 获取所有人的应答情况
		 * @return  {Boolean} 是否所有人都应答了(state [0未应答 | 1接受 | -1拒绝])
		 */
    getAllEnterStatus() {
      // 查找state为0的用户,如果有,则返回fasle
      const hasNotEnter = this.items.find(item => {
        return item.state === 0
      })
      return !hasNotEnter
    }
  },
  methods: {
    /**
		 * 获取对应应答状态的颜色
     * @param {Number} 人员回应状态 [0未应答 | 1接受 | -1拒绝]
		 * @return  {Object} 颜色代码(vue的:style参数) {color: '#2ecc71'}
		 */
    getEnterColor(state) {
      let color = '#ecf0f1'
      switch (state) {
        case 0:
          color = '#ccc'
          break;
        case 1:
          color = '#2ecc71'
          break;
        case -1:
          color = '#e74c3c'
          break;
      }
      return {color}
    }
  }
}
</script>
<style lang="scss" scoped>
  .calling {
    width:100%;
    color:#464D69;
    text-align:center;
    font-size: 0.8rem;
    margin-top: 10px;
  }
  .calling-avatar {
    margin: 0 5px;
  }
  .calling-avatar img {
    width: 60px;
    height: 60px;
    margin-bottom: -0.5rem;
  }
  .calling-avatar span {
    font-size: 13px;
    font-weight: 600;
  }
  .calling-buttons button {
    margin: 0 5px !important;
  }
</style>
