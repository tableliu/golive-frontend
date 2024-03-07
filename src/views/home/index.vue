<template lang="html">
  <div>
    <page-title-bar></page-title-bar>
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid grid-list-xl py-0>
      <v-layout row wrap style="margin:0;" class="full-block">
        <Home></Home>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Home from '../liveshow/home/home.vue'
export default {
  components:{
    Home
  }
}
</script>
