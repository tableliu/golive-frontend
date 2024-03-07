<template>
  <v-container class="container-full-width container-margin" grid-list-md>
    <v-layout wrap>
      <v-flex xs12 sm12 :class="'md' + width">
        <div v-show="showTarget && (timelinePosition === 'top' || timelinePosition === 'cross')" class="process-timeline">
          <div style="width:95%;height:0px;background:rgba(150,150,150,1);margin:40px auto;"></div>
          <div
            v-if="(timelinePosition === 'cross' && index % 2 > 0) || timelinePosition === 'top'"
            v-for="(item, index) in target"
            :key="index"
            @mouseover="openTimelineDialog(item)"
            @mouseout="closeDialog"
            :style="'left:calc(' + item.value + '% - 3rem);'"
            class="process-timeline-item"
          >

            <v-tooltip bottom color="rgba(0,0,0,0)">
               <template v-slot:activator="{ on }">
                 <p v-on="on" :style="`color:${item.status < 1 ? '#464D69' : item.status > 1 ? 'red' : 'green'};text-align:center;`">{{item.text}}</p>
                 <p v-on="on" :style="`color:${item.status < 1 ? '#464D69' : item.status > 1 ? 'red' : 'green'};text-align:center;`">{{item.date}}</p>
               </template>
                 <slot name="timelineTips" :item="activeTimeline"></slot>
             </v-tooltip>
             <div class="target-line"></div>
          </div>
        </div>
        <div v-show="data.length > 0" class="process-target">
          <div
            v-if="getPointPosition === 'top'"
            v-show="showHistoryPop(index)"
            v-for="(item, index) in data"
            :key="index"
            :class="'process-target-item ' + (index === data.length - 1 ? 'process-target-large' : 'process-target-mini')"
            @mouseover="openDialog(item)"
            @mouseout="closeDialog"
            :style="'left:calc(' + item.value + '% - 1.3rem);'"
          >
            <p>{{item.value + '%'}}</p>
            <v-tooltip top color="rgba(0,0,0,0)">
               <template v-slot:activator="{ on }">
                 <v-icon v-on="on" :size="index === data.length - 1 ? 50 : 30" class="process-target-item-icon" :color="item.active ? 'red' : ''">place</v-icon>
               </template>
                 <slot name="tips" :item="activeItem"></slot>
             </v-tooltip>
          </div>
        </div>

        <div class="">
          <v-tooltip v-if="linearTips" top color="rgba(0,0,0,0)">
             <template v-slot:activator="{ on }">
               <div style="height: 100%; display:flex;align-items: center;" v-on="on">
                 <slot name="processFront"></slot>
                 <v-progress-linear
                   class="process-process"
                   v-model="value"
                   :height="height"
                   reactive
                   :striped="striped"
                   :background-color="backgroundColor"
                   :color="color"
                   @mouseover.stop="linearMouseIn"
                   @mouseout.stop="linearMouseOut"
                 >
                   <strong class="process-inner">{{ name }}</strong>
                 </v-progress-linear>
                  <slot name="processBack"></slot>
               </div>
             </template>
               <slot name="linear-tips" :item="activeItem"></slot>
           </v-tooltip>
           <div style="height: 100%; display:flex;align-items: center;" v-else>
               <slot name="processFront"></slot>
               <v-progress-linear
                 class="process-process"
                 v-model="value"
                 :height="height"
                 reactive
                 :striped="striped"
                 :background-color="backgroundColor"
                 :color="color"
                 @mouseover.stop="linearMouseIn"
                 @mouseout.stop="linearMouseOut"
               >
                 <strong class="process-inner">{{ name }}</strong>
               </v-progress-linear>
                <slot name="processBack"></slot>
           </div>
        </div>
        <div v-show="data.length > 0" v-if="getPointPosition === 'bottom'" class="process-target process-target-bottom">
          <div
            v-show="showHistoryPop(index)"
            v-for="(item, index) in data"
            :key="index"
            :class="'process-target-item ' + (index === data.length - 1 ? 'process-target-large-bottom' : 'process-target-mini-bottom')"
            @mouseover="openDialog(item)"
            @mouseout="closeDialog"
            :style="'left:calc(' + item.value + '% - 1.3rem);'"
          >
            <v-tooltip bottom color="rgba(0,0,0,0)">
               <template v-slot:activator="{ on }">
                 <v-icon style="transform: rotateX(180deg);" v-on="on" :size="index === data.length - 1 ? 50 : 30" class="process-target-item-icon" :color="item.active ? 'red' : ''">place</v-icon>
               </template>
                 <slot name="tips" :item="activeItem"></slot>
             </v-tooltip>
             <p>{{item.value + '%'}}</p>
          </div>
        </div>
        <div v-show="showTarget" class="process-timeline">
          <div
            v-for="(item, index) in target"
            :key="index"
            v-if="(timelinePosition === 'cross' && index % 2 === 0) || timelinePosition === 'bottom'"
            @mouseover="openTimelineDialog(item)"
            @mouseout="closeDialog"
            :style="'left:calc(' + item.value + '% - 3rem);'"
            class="process-timeline-item"
          >
            <div class="target-line"></div>

            <v-tooltip top color="rgba(0,0,0,0)">
               <template v-slot:activator="{ on }">
                 <p v-on="on" :style="`color:${item.status < 1 ? '#464D69' : item.status > 1 ? 'red' : 'green'};text-align:center;`">{{item.date}}</p>
                 <p v-on="on" :style="`color:${item.status < 1 ? '#464D69' : item.status > 1 ? 'red' : 'green'};text-align:center;`">{{item.text}}</p>
               </template>
                 <slot name="timelineTips" :item="activeTimeline"></slot>
             </v-tooltip>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 sm12 md2>
        <slot name="after" :item="activeItem"></slot>
      </v-flex>
      <!-- <v-dialog
          conetent-class="process-dialog"
          v-model="dialog"
          hide-overlay
          width="300"
        >
          <slot name="dialog" :item="activeItem"></slot>
      </v-dialog> -->
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    value: Number,
    name: String,
    linearTips: Boolean,
    data: {
      type: Object,
      default: () => ({})
    },
    target: {
      type: Array,
      default: () => []
    },
    showTarget: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    },
    backgroundColor: {
      type: String,
      default: 'indigo lighten-4'
    },
    height: {
      type: [String, Number],
      default: 25
    },
    width: {
      type: Number,
      default: 10
    },
    showPop: {
      type: Boolean,
      default: true
    },
    timelinePosition: {
      type: String,
      default: 'bottom',
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['top', 'bottom', 'cross'].indexOf(value) !== -1
      }
    }
  },
  data() {
    return {
      activeItem: null,
      activeTimeline: {}
    }
  },
  mounted() {
    this.pv = this.data.value
  },
  computed:{
    getProcessValue() {
      return this.data.value
    },
    getPointPosition() {
      if (this.showTarget) {
        switch(this.timelinePosition) {
          case 'top':
            return 'bottom'
          case 'bottom':
            return 'top'
          case 'cross':
            if (this.data[0].currentStep % 2 > 0) {
              return 'bottom'
            }
            return 'top'
        }
      }
      return 'top'
    }
  },
  methods: {
    openDialog(e) {
      this.activeItem = e.processDialog
      // this.dialog = true
    },

    openTimelineDialog(e) {
      this.activeTimeline = e
      // this.dialog = true
    },

    closeDialog(e) {
      // this.dialog = false
    },

    linearMouseIn() {
      this.$emit('linearMouseIn', {
        point: this.data,
        name: this.name,
        value: this.value
      })
    },

    linearMouseOut() {
      this.$emit('linearMouseOut', {
        point: this.data,
        name: this.name,
        value: this.value
      })
    },

    showHistoryPop(index) {
      if (!this.showPop) {
        if (index === this.data.length - 1) {
          return true
        }else {
          return false
        }
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss">
  .process-inner {
    color: #fff;
    align-items: center;
    display: flex;
    height: 100%;
    left: 0;
    justify-content: center;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 2;
  }
  .process-process {
    display: inline-block;
    width: 90%;
  }
  .process-label {
    display: inline-block;
    // height: 100%;
    vertical-align: middle;
    width: 5%;
    text-align: center;
  }
  .process-label-left {
    // margin-right: 1rem;
    // width: 5%;
  }
  .process-label-right {
    // margin-left: 1rem;
    // width: 5%;
    // text-align: center;
  }
  .process-target {
    width: 91%;
    position: relative;
    min-height: 67px;
    left: 4%;
  }
  .process-target-bottom {
    height: 0 !important;
    min-height: 0 !important;
  }
  .process-timeline {
    width: 91%;
    position: relative;
    min-height: 67px;
    left: 4%;
  }
  .process-target-item {
    display: inline-block;
    position: absolute;
    left: 0;
  }
  .process-timeline-item {
    display: inline-block;
    position: absolute;
    left: 0;
    min-width: 100px;
  }
  .process-target-item>p {
    text-align: center;
    margin: 0;
  }
  .process-target-item .process-target-item-icon {
    display: block;
  }
  .process-target-large {
    margin-top: 5px;
  }
  .process-target-mini {
    margin-top: 25px;
  }
  .process-target-large-bottom {
    margin-top: -15px;
  }
  .process-target-mini-bottom {
    margin-top: -10px;
  }
  .process-dialog {
    // position: absolute;
    // left: 0;
  }
  .target-line {
    background: rgba(0,0,0,0.52);
    height: 30px;
    margin-left: calc(50% - 1px);
    width: 2px;
  }
  @media(max-width:960px){
    .process-label {
      visibility: hidden;
      height: 0;
    }
  }
</style>
