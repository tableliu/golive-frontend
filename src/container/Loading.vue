
<template>
  <div style="width:100%;height:100%;">
    <Circle8></Circle8>
    <Alert></Alert>
  </div>
  <!-- <rotate-square2></rotate-square2> -->
  <!-- <TM></TM> -->
</template>

<script>
import Alert from '@/components/Header/Alert.vue'
import liveshowSocket from './js/liveshowSocket';
export default {
  components: {
    Alert
  },
  mounted() {
    this.connection()
  },
  methods: {
    connection() {
      const _this = this
      if (!this.$API) {
        setTimeout(() => {
          _this.connection()
        }, 500)
        return
      }
      _this.$axios.get(`/user/try-session`)
      .then(res => {
        if (res.data.code === 1) {
          _this.openSocket()
          setTimeout(() => {
            _this.$emit('done')
          }, 2000)
        }
      })
      .catch(e => {
        _this.$store.commit('setRequest', {
          valid: false,
          url: `/user/try-session`,
          type: 'error',
          msg: _this.$t("message['Failed to connect to the project server, reconnecting']")
        })
        setTimeout(() => {
          _this.connection()
        }, 10000)
      })
    },
    openSocket() {
      // 打开socket连接
      liveshowSocket(this.$SOCKET)
    }
  }
};
</script>
