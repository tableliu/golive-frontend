
<!-- App Main Structure -->
<template>

    <v-alert
      transition="slide-x-reverse-transition"
      class="vAlert elevation-10"
      :value="!option.valid"
      :color="option.color"
      :type="option.type"
    >
      {{option.msg}}
    </v-alert>
</template>

<script>
export default {
  data() {
    return {
      option: {
        msg: '',
        type: 'success',
        valid: true
      }
    };
  },
	watch: {
		requestValid() {
			let _this = this
			const request = this.$store.state.request
			if (!request.valid) {
				this.option = request
				switch(request.type) {
					case "warning" :
						this.option.color = '#FFA73C'
						break
					case "error" :
						this.option.color = '#FF5252'
						break
					case "success" :
						this.option.color = '#70C074'
						break
					case "info" :
						this.option.color = '#2196F3'
						break
				}
        _this.option.type = request.type
				_this.$store.commit('countCounter', '++')
			}

			setTimeout(() => {
				if(request.counter === 1) this.option.valid = true
				_this.$store.commit('countCounter', '--')
			}, request.type === 'success' ? 2000 : 4000)
		}
	},
  computed: {
		requestValid() {
			return this.$store.state.request.num
		}
  }
};
</script>

<style scoped>
.vAlert{
	z-index:999999999999;
	position:fixed !important;
	/* width:100%; */
	top:64px;
	right: 0;
  margin-right: 20px;
  border-radius: 4px;
  border-color: inherit;
}
</style>
