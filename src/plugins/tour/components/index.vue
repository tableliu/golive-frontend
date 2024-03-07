<template lang="html">
  <div v-if="showTour" id="fullMask" class="full-mask" :style="getFullBodySize()">
    <div id="bubble" ref="bubble" class="bubble" :class="getPosition">
      <div class="bubble-body">
        <div class="bubble-title">
          <h3 class="bubble-text">
            {{stepList[step].title}}
            <v-tooltip top>
              <v-icon
                slot="activator"
                :color="stepList[step].valid ? 'green' : 'red'"
                @click.stop="downLoad(props.item, 'edit')"
              >
                {{stepList[step].valid ? 'done' : 'clear'}}
              </v-icon>
              <span> {{stepList[step].valid ? '此项已完成' : '此项未完成'}} </span>
            </v-tooltip>
          </h3>
        </div>
        <div class="bubble-area">
          <p v-for="item in stepList[step].text" class="bubble-text"> {{item}} </p>
        </div>
        <div class="bubble-actions">
          <v-container v-if="step === 0" grid-list-md class="margin-padding-none">
            <v-layout wrap class="margin-padding-none">
              <v-flex :class="stepList[step].valid ? 'xs4 sm4 md4 xl4' : 'xs6 sm6 md6 xl6'" >
                <v-btn
                  @click="neverTour"
                  color="#fff"
                  class="btn-large btn-micro bubble-btn"
                  >
                  <v-icon
                    color="#4A7CAF"
                    class="v-icon-active"
                    >
                    block
                  </v-icon>
                  <span class="btn-font-color">不再引导</span>
                </v-btn>
              </v-flex>
              <v-flex :class="stepList[step].valid ? 'xs4 sm4 md4 xl4' : 'xs6 sm6 md6 xl6'" >
                <v-btn
                  @click="shutdown"
                  color="#fff"
                  class="btn-large btn-micro bubble-btn"
                  >
                  <v-icon
                    color="#4A7CAF"
                    class="v-icon-active"
                    >
                    redo
                  </v-icon>
                  <span class="btn-font-color">跳过引导</span>
                </v-btn>
              </v-flex>
              <v-flex v-if="stepList[step].valid" xs4 sm4 md4 xl4 >
                <v-btn
                  @click="next"
                  color="#fff"
                  class="btn-large btn-micro bubble-btn"
                  >
                  <v-icon
                    color="#4A7CAF"
                    class="v-icon-active"
                    >
                    skip_next
                  </v-icon>
                  <span class="btn-font-color">下一步</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container v-else-if="step === stepList.length - 1" grid-list-md class="margin-padding-none">
            <v-layout wrap class="margin-padding-none">
              <v-flex xs4 sm4 md4 xl4>
                <v-btn
                  @click="shutdown"
                  color="#fff"
                  class="btn-large btn-micro bubble-btn"
                  >
                  <v-icon
                    color="#4A7CAF"
                    class="v-icon-active"
                    >
                    done
                  </v-icon>
                  <span class="btn-font-color">完成</span>
                </v-btn>
              </v-flex>
              <v-flex xs4 sm4 md4 xl4>
                <v-btn
                  @click="neverTour"
                  color="#fff"
                  class="btn-large btn-micro bubble-btn"
                  >
                  <v-icon
                    color="#4A7CAF"
                    class="v-icon-active"
                    >
                    block
                  </v-icon>
                  <span class="btn-font-color">不再引导</span>
                </v-btn>
              </v-flex>
              <v-flex xs4 sm4 md4 xl4 >
                <v-btn
                  @click="reStart(target)"
                  color="#fff"
                  class="btn-large btn-micro bubble-btn"
                  >
                  <v-icon
                    color="#4A7CAF"
                    class="v-icon-active"
                    >
                    replay
                  </v-icon>
                  <span class="btn-font-color">重新开始</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container v-else grid-list-md class="margin-padding-none">
            <v-layout wrap class="margin-padding-none">
              <v-flex :class="stepList[step].valid ? 'xs4 sm4 md4 xl4' : 'xs6 sm6 md6 xl6'" >
                <v-btn
                  @click="shutdown"
                  color="#fff"
                  class="btn-large btn-micro bubble-btn"
                  >
                  <v-icon
                    color="#4A7CAF"
                    class="v-icon-active"
                    >
                    redo
                  </v-icon>
                  <span class="btn-font-color">跳过引导</span>
                </v-btn>
              </v-flex>
              <v-flex :class="stepList[step].valid ? 'xs4 sm4 md4 xl4' : 'xs6 sm6 md6 xl6'" >
                <v-btn
                  @click="back"
                  color="#fff"
                  class="btn-large btn-micro bubble-btn"
                  >
                  <v-icon
                    color="#4A7CAF"
                    class="v-icon-active"
                    >
                    skip_previous
                  </v-icon>
                  <span class="btn-font-color">上一步</span>
                </v-btn>
              </v-flex>
              <v-flex v-if="stepList[step].valid" xs4 sm4 md4 xl4 >
                <v-btn
                  @click="next"
                  color="#fff"
                  class="btn-large btn-micro bubble-btn"
                  >
                  <v-icon
                    color="#4A7CAF"
                    class="v-icon-active"
                    >
                    skip_next
                  </v-icon>
                  <span class="btn-font-color">下一步</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OriginData from "Constants/tour";
import Vue from "vue"
import {mapGetters} from 'vuex'

export default {
  props: {
    show: {
       type: Boolean,
       default: true
    }
  },
  data() {
    return {
      id: 0,
      showTour: false,
      target: null,
      stepList: null,
      step: 0,
      position: 'bottom',
      currentVue: null,
      watchs: null,
      runing: []
    }
  },
  watch: {
    show() {
      this.showTour = show
    },
    step() {
      const _this = this.stepList[this.step]
      _this.callback(this.currentVue, _this, this.stepList)
      this.watchs = this.currentVue[_this.watch]
    },
    watchs: {
      handler: function () {
        const _this = this.stepList[this.step]
        _this.callback(this.currentVue, _this, this.stepList)
      },
      deep: true
    }
  },
  computed: {
    // ...mapGetters(['getHistory']),
    getPosition() {
      let str
      switch(this.position) {
        case 'top' :
          str = 'bubble-top'
        break
        case 'bottom' :
          str = 'bubble-bottom'
        break
        case 'left' :
          str = 'bubble-left'
        break
        case 'right' :
          str = 'bubble-right'
        break
        default :
          str = 'bubble-bottom'
        break
      }
      return str
    }
  },
  created() {
    Vue.prototype.$tours = this
  },
  mounted() {
    this.$tours.OriginData =  OriginData
  },
  methods: {
    init() {
      this.getFullBodySize()
      this.setPosition()
    },
    start(target, vue, isold) {
      if (!isold) {
        this.runing.push({
          id: this.id + 1,
          target,
          vue
        })
      }
      // 查看运行,如果正在运行，则不start
      if (this.checkRuning()) {
        return
      }
      this.step = 0
      this.target = target
      this.currentVue = vue
      const stopTour = JSON.parse(window.localStorage.getItem('stopTour')),
            bool = stopTour ? stopTour.indexOf(target) : -1
      if (bool < 0) {
        this.stepList = OriginData[target]
        this.showTour = true
        this.init()
        return this.stepList
      }else {
        this.shutdown()
      }
    },
    reStart() {
      const obj = this.stepList[this.step]
      this.stepList = OriginData[this.target]
      this.setZIndex(document.querySelector(obj.target))
      this.step = 0
      this.init()
    },
    getFullBodySize() {
      const _this = this
      let height
      const dom = document.querySelector('main').children[0],
            child = dom.children.length > 1 ? dom.children[dom.children.length - 1] : dom.children[0]
      if (dom.offsetHeight > child.offsetHeight) {
        height = dom.offsetHeight
      } else {
        height = child.offsetHeight
      }
      return {
        height: height + 'px'
      }
    },
    back() {
      const obj = this.stepList[this.step]
      this.step -= 1
      this.setPosition(obj)
    },
    next() {
      const obj = this.stepList[this.step]
      this.step += 1
      obj.valid = true
      this.setPosition(obj)
    },
    neverTour() {
      this.shutdown()
      let arr = JSON.parse(localStorage.getItem('stopTour')) || []
      arr.push(this.target)
      localStorage.setItem('stopTour', JSON.stringify(arr))
    },
    shutdown() {
      this.showTour = false
      //删除当前运行队列第一位
      this.runing.splice(0, 1)
      this.awaitRun(0)
    },
    setPosition(obj) {
      const domTarget = document.querySelector(this.stepList[this.step].target),
      oldTarget = obj ? document.querySelector(obj.target) : null,
      position = this.stepList[this.step].position
      this.position = position
      const distancethis = this.getDistance(domTarget)
      this.position = position
      this.setZIndex(oldTarget, domTarget)
      this.$nextTick(() => {
        const domTour = this.$refs['bubble']
        domTour.style.left = distancethis.left
        domTour.style.top = distancethis.top
        if (this.stepList[this.step].focus) {
          window.location.hash = this.stepList[this.step].target
        }
      })
    },
    getDistance(target) {
      let top, left
      const styles = window.getComputedStyle(target, null),
      margin = styles.margin === "" ? styles.marginTop + ' ' + styles.marginLeft + ' ' + styles.marginBottom + ' ' + styles.marginRight : styles.margin,
      marginAll = parseInt(margin.split(' ')[0]) + parseInt(margin.split(' ')[2]),
      offset = this.stepList[this.step].offset
      switch(this.position) {
        case 'top' :
          top = target.offsetTop - 200,
          left = parseInt(target.offsetLeft + target.clientWidth / 2 - 220)
        break
        case 'bottom' :
          top = target.clientHeight + target.offsetTop + (isNaN(marginAll) ? 0 : marginAll) + 20,
          left = parseInt(target.offsetLeft + target.clientWidth / 2 - 220)
        break
        case 'left' :
          top = target.offsetTop + (isNaN(marginAll) ? 0 : marginAll) + 20,
          left = parseInt(target.offsetLeft - target.clientWidth)
        break
        case 'right' :
          // top = parseInt(target.clientHeight / 2) + target.offsetTop + (isNaN(marginAll) ? 0 : marginAll),
          top = target.offsetTop + (isNaN(marginAll) ? 0 : marginAll) + 20,
          left = parseInt(target.offsetLeft + target.clientWidth + 50)
        break
        default :
          top = target.clientHeight + target.offsetTop + (isNaN(marginAll) ? 0 : marginAll) + 20,
          left = parseInt(target.offsetLeft + target.clientWidth / 2 - 220)
        break
      }
      return {
        left: left + (offset.left || 0) + 'px',
        top: top + (offset.top || 0) + 'px'
      }
    },
    setZIndex(ot, nt) {
      if (ot) {
        ot.classList.remove("top-z-index")
      }
      if (nt) {
        nt.classList.add("top-z-index")
      }
    },
    checkRuning() {
      return this.runing.length > 1 ? true : false
    },
    awaitRun(time = 2000) {
      const _this = this,
      run = _this.runing[0]
      if (!run) {
        return
      }
      setTimeout(() => {
        const {target, vue} = run
        _this.start(target, vue, true)
      }, time)
    }
  }
}
</script>

<style lang="css">
.top-z-index, .top-z-index *{
  z-index: 9999;
}
/* .top-z-index, .top-z-index h3, .top-z-index label {
  color: #fff;
} */
.bubble {
  position: absolute;
  top: 60px;
  /* right: 45%; */
  min-width: 400px;
  min-height: 200px;
  max-width: 600px;
  border-radius: 5px;
  z-index: 9998;
  background-color:#fff;
}
.bubble-bottom:after {
  content:'';
  position:absolute;
  bottom:100%;
  left:47%;
  width:0;
  height:0;
  border-width:15px;
  border-style:solid;
  border-color:transparent;
  border-bottom-color:currentColor;
  color:#fff;
}
.bubble-top:after {
  content:'';
  position:absolute;
  top:100%;
  right:47%;
  width:0;
  height:0;
  border-width:15px;
  border-style:solid;
  border-color:transparent;
  border-top-color:currentColor;
  color:#fff;
}
.bubble-right:after {
  content:'';
  position:absolute;
  right:100%;
  top:70%;
  width:0;
  height:0;
  border-width:15px;
  border-style:solid;
  border-color:transparent;
  border-right-color:currentColor;
  color:#fff;
}
.bubble-left:after {
  content:'';
  position:absolute;
  left:100%;
  bottom:70%;
  width:0;
  height:0;
  border-width:15px;
  border-style:solid;
  border-color:transparent;
  border-left-color:currentColor;
  color:#fff;
}
.full-mask {
  background: rgba(192,192,192,0.9);
  opacity: 1;
  z-index: 9997;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
.bubble-body {
  margin: 5px;
}
.bubble-title {
  text-align: center;
  width: 90%;
  margin: 0 auto;
}
.bubble-title > h3 {
  text-align: center;
}
.bubble-area {
  text-align: center;
  width: 90%;
  margin: 0 auto;
  min-height: 80px;
}
.bubble-area > p {
  text-align: left;
}
.bubble-actions {
  text-align: center;
}
.bubble-btn span{
  font-size: 12px;
}
</style>
