<template lang="html">
  <div>
    <v-btn
      class="primary gotop-btn"
      @click.stop="gotop"
    >
      <v-icon right color="#fff">keyboard_capslock</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    gotop() {
      window.location.hash = "#navbartop";
      window.location.hash = '';
    }
  }
}
</script>

<style lang="css">
.gotop-btn {
  z-index: 9999;
  max-width: 45px !important;
  max-height: 45px !important;
  min-width: 45px !important;
  min-height: 45px !important;
  padding: 0 !important;
  margin: 0 !important;
}
.gotop-btn i {
  text-align: center;
  padding: 0 !important;
  margin: 0 !important;
}
</style>
