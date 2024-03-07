<template>
   <div class="header-filter">
      <h5 class="text-xs-center mb-3">{{$t('message.headerFilters')}}</h5>
      <v-list>
         <v-list-tile :class="{'active-theme': headerFilter === activeHeaderFilter}" @click="changeHeaderFilter(headerFilter)" v-for="headerFilter in headerFilters" :key="headerFilter.id">
            <span :class="headerFilter.class"></span>
         </v-list-tile>
      </v-list>
   </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
   computed:{
      ...mapGetters(['headerFilters', 'activeHeaderFilter', 'getRole'])
   },
   methods: {
     // theme:1蓝色,2黄色,3绿色,4红色,5靓蓝6浅蓝
      changeHeaderFilter(filter) {
         this.$store.dispatch('changeHeaderFilter', filter);
      }
   }
}
</script>
