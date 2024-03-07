<template lang="html">
  <div v-if="show" class="toast-container" v-bind:style="{height: size.height, width: size.width}">
    <div v-if="cover" class="cover"></div>
    <div class="toast" v-bind:style="{height: height, width: width,lineHeight: height}">
      <span>
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    cover: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: '300px'
    },
    height: {
      type: [String, Number],
      default: '200px'
    },
    duration: {
      type: [String, Number],
      default: 2000
    },
    result: {
      type: Function,
      default: v => {}
    }
  },
  data: function() {
    return {
      size: {
        height: '100%',
        width: '100%'
      }
    }
  },
  mounted: function() {
    let height = document.body.offsetHeight - 1
    this.size.height = `${height}px`
    this.result()
  },
  methods: {
    hideToast() {
      let _this = this
      typeof this.duration === 'Number' ? this.duration : Number.apply(this.duration)
      setTimeout(v => {
        _this.show = false
      }, this.duration)
    }
  }
}
</script>

<style lang="css">
.toast-container {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9999;
  opacity: 0.5;
}
.cover {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.toast {
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: #ccc;
  color: #000;
  font-size: 1.5rem;
  text-align: center;
  margin-left: -150px;
  margin-top: -50px;
  border-radius: 5px;
}
</style>
