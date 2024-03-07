<template lang="html">
  <div>
    <!-- 右侧更换主题按钮 -->
    <div v-show="showIcon" :class="customClass" class="app-customizer fixed-setting">
      <a :style="{background: background + ' !important', top: top + '%'}" style="border-radius:3px 0 0 3px;" class="customizer-toggle primary v-step-4" href="javascript:void(0);" @click.stop="openDialog" >

        <template v-if="Number.isInteger(parseInt(badge))">
          <v-badge top left slot="activator" overlap>
            <template v-slot:badge>
              <span style="line-height: 100%;">{{ badge }}</span>
            </template>
            <v-tooltip left>
              <template slot="activator">
                <v-icon v-if="icon" :color="color"> {{ icon }} </v-icon>
                <i v-else class="zmdi zmdi-settings zmdi-hc-spin font-lg"></i>
              </template>
              <span>{{ tooltip }}</span>
            </v-tooltip>
          </v-badge>
        </template>
        <template v-else>
          <v-icon v-if="icon" :color="color"> {{ icon }} </v-icon>
          <i v-else class="zmdi zmdi-settings zmdi-hc-spin font-lg"></i>
        </template>
      </a>
    </div>
    <v-navigation-drawer
      fixed
      v-model="customizerIn"
      :width="300"
      right
      light
      temporary
      class="clearfix fixed-setting"
      @input="navigationChange"
    >
      <slot></slot>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  props: {
    customizerIn: Boolean,
    icon: String,
    background: String,
    color: String,
    customClass: String,
    top: [String, Number],
    badge: Number,
    tooltip: {
      type: String,
      default: '提示'
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  computed: {},
  methods: {
    openDialog() {
      this.$emit('click')
    },
    navigationChange(v) {
      this.$emit('change', v)
    }
  }
}
</script>

<style lang="css" scoped>
  .fixed-setting {
    z-index: 99999;
  }
</style>
