<!-- 组件 -->
<!-- liveshow 视频框选 -->
<template>
  <div ref="drawContainer" class="liveshow-draw-Container" :style="customStyle">
    <v-menu
      v-model="showMenu"
      absolute
      offset-y
      style="max-width: 600px"
      :position-x="position.x"
      :position-y="position.y"
    >
      <v-list>
        <v-list-tile
          v-for="(item, index) in menus"
          :key="index"
          @click="item.func()"
        >
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
let _this
export default {
  components: {
  },
  props: ["customStyle", "clearAll", "menus"],
  data: () => ({
    // 画板容器
    container: null,
    // 是否拖动，初始为 false
    dragging: false,
    // startX, startY 为鼠标点击时初始坐标
    startX: null,
    startY: null,
    // diffX, diffY 为鼠标初始坐标与 box 左上角坐标之差，用于拖动
    diffX: null,
    diffY: null,
    showMenu: false,
    position: {
      x: 0,
      y: 0
    }
  }),
  computed: {

  },
  watch: {
    clearAll() {
      if (this.clearAll) {
        this.removeBox()
      }
    }
  },
  mounted() {
    _this = this
    _this.init()

  },
  methods: {
    init() {
      // 获取容器
      _this.container = _this.$refs.drawContainer
      const e = window.event;
      // 鼠标按下
      _this.container.onmousedown = _this.mousedown
      // 鼠标移动
      _this.container.onmousemove = _this.mouseMove
      // 鼠标抬起
      _this.container.onmouseup = _this.mouseup
      // 初始化菜单
      _this.initMenu()
    },
    initMenu() {

      const dom = _this.$refs.drawContainer
      // 重写右键功能
      dom.oncontextmenu = function (e) {
        // 取消默认的右键功能
        e.preventDefault()
        _this.openMenu(e)
      }
    },
    mousedown(e) {
      // 如果是鼠标右键
      if (e.which === 3) {
        return
      }
      // 关闭菜单
      _this.showMenu = false
      _this.startX = e.pageX;
      _this.startY = e.pageY;
      // 如果鼠标在 box 上被按下
      if(e.target.className.match(/liveshow-draw-box/)) {
        // 允许拖动
        _this.dragging = true;
        // 设置当前 box 的 id 为 moving_box
        if(document.getElementById("moving_box") !== null) {
          document.getElementById("moving_box").removeAttribute("id");
        }
        e.target.id = "moving_box";
        // 计算坐标差值
        _this.diffX = _this.startX - e.target.offsetLeft;
        _this.diffY = _this.startY - e.target.offsetTop;
      }
      else {
        // 在页面创建 box
        _this.removeBox()
        var active_box = document.createElement("div");
        active_box.id = "active_box";
        active_box.className = "liveshow-draw-box";
        active_box.style.top = (_this.startY - 60) + 'px';
        active_box.style.left = (_this.startX - 10) + 'px';
        _this.container.appendChild(active_box);
        // _this.addListener(active_box)

        active_box = null;
      }
    },
    mouseMove(e) {
      // 更新 box 尺寸
      if(document.getElementById("active_box") !== null) {
        var ab = document.getElementById("active_box");
        ab.style.width = e.pageX - _this.startX + 'px';
        ab.style.height = e.pageY - _this.startY + 'px';
      }
      // 移动，更新 box 坐标
      if(document.getElementById("moving_box") !== null && _this.dragging) {
        var mb = document.getElementById("moving_box");
        mb.style.top = e.pageY - _this.diffY + 'px';
        mb.style.left = e.pageX - _this.diffX + 'px';
      }
    },
    mouseup(e) {
      // 如果是鼠标右键
      if (e.which === 3) {
        return
      }
      // 禁止拖动
      _this.dragging = false;
      if(document.getElementById("active_box") !== null) {
        var ab = document.getElementById("active_box");
        ab.removeAttribute("id");
        // 如果长或宽小于 20px，移除 box
        if(ab.offsetWidth < 20 || ab.offsetHeight < 20) {
          _this.container.removeChild(ab);
          _this.removeBox()
        }else {
          _this.triggerDrawDone({
            top: ab.style.top,
            left: ab.style.left,
            width: ab.style.width,
            height: ab.style.height
          })
        }
      }
    },
    removeBox() {
      const box = document.querySelector('.liveshow-draw-box')
      if (box) {
        _this.container.removeChild(box)
        _this.$emit('clear')
      }
    },
    addListener(dom) {

    },
    openMenu(e) {
      // 设置菜单位置
      _this.position.x = e.pageX
      _this.position.y = e.pageY
      // 打开菜单
      _this.showMenu = true
    },
    triggerDrawDone(obj) {
      _this.$emit('drawCompelete', obj)
    }
  }
}
</script>
<style lang="scss" scoped>
.liveshow-draw-Container {
  // visibility: hidden;
  background: rgba(0,0,0,0);
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

</style>
<style media="screen">
  .liveshow-draw-box {
    width: 0px;
    height: 0px;
    position: absolute;
    cursor: move;
    border: 5px solid #f00;
  }
</style>
