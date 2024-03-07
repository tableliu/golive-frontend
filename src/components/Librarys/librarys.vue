
<!-- App Main Structure -->
<template>
	<div>
    <v-container id="tour__user_table__1" class="container-full-width" container-full-width  grid-list-md>
      <v-layout wrap>
        <v-flex xs2 sm2 md1>
          <h3 class="flex-title" style="line-height:50px;">管理项目</h3>
        </v-flex>
        <v-flex xs2 sm2 md2 v-for="item in (format || getLibrarys)" :key="item.pid">
          <v-btn
            @click.stop="swapProject(item)"
            :color="item.select?'#C5D4E1':'#fff'"
            flot left class="btn-large btn-mini"
            >
            <v-icon
              color="#4A7CAF"
              :class="item.select?'v-icon-active':''"
              >
              local_library
            </v-icon>
            <span class="btn-font-color">{{item.name}}</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <div style="width:95%;height:1px;background:rgba(150,150,150,1);margin:10px auto;"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	props: ["format"],
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
	},
  computed: {
		...mapGetters(['getLibrarys'])
  },
	mounted() {
		this.loadLibraryActive()
	},
  methods: {
		loadLibraryActive() {
			const _this = this
			if (!_this.getLibrarys) {
				setTimeout(() => {
					_this.loadLibraryActive()
				}, 500)
				return
			}
			const result = _this.getLibrarys.find(item => {
				return item.select === true
			})
			_this.$emit('selected', result)
		},
		swapProject(pro) {
			const _this = this
			_this.getLibrarys.map(item => {
				if (item.pid === pro.pid) {
					item.select = true
					_this.$emit('selected', item)
				}else {
					item.select = false
				}
			})
		}
  }
};
</script>

<style scoped>
</style>
