<template lang="html">
  <div style="width:100%;height:100%;">
    <page-title-bar native-class="margin-padding-none"></page-title-bar>
    <Map
      :center="locale"
      :point="point"
      showInfoWindow
    >
    </Map>
  </div>
</template>
<script>
import Router from '@/router'
import Map from '@/components/Map'
export default {
  components: {
    Map
  },
  data() {
    return {
      locale: {
        x: null,
        y: null
      },
      point: [],
      maps: [],
      loading: false
    }
  },
  mounted() {
    this.init()
  },
  computed:{
		getQuery() {
      const query =  this.$route.params,
      params = query && (query.x && query.y)  ? [query] : this.maps
      return params
    }
  },
  methods:{
    init() {
      const _this = this
      this.getLocaleData()
      this.initMapData()
    },
    getLocaleData() {
      this.maps = this.$store.getters.getMaps
    },
    initMapData() {
      // this.getQuery.push({
      //   x: 118.794016,
      //   y: 32.076253
      // })
      this.point = this.locale = this.getQuery
    }
  }
}
</script>
<style lang="css">
</style>
