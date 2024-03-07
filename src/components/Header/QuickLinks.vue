<template>
	<v-menu light offset-y origin="left top"  transition="slide-y-transition" content-class="quciklink-dropdown" right nudge-top="-10" class="v-step-1 quick-link">
		<v-btn icon large slot="activator" class="my-0">
			<i class="zmdi grey--text zmdi-hc-fw font-lg zmdi-apps"></i>
		</v-btn>
		<div class="dropdown-content">
			<div class="dropdown-top d-custom-flex justify-space-between primary">
				<span class="white--text fw-bold">{{ $t('message.quickLinks') }}</span>
			</div>
			<v-list light class="dropdown-list">
				<v-list-tile light v-for="link in links" :key="parseInt(link.id)" :to="link.fontend_path">
					<v-icon class="mr-3">{{link.icon}}</v-icon>
					<span>{{ link.title }}</span>
				</v-list-tile>
			</v-list>
		</div>
	</v-menu>
</template>

<script>
import { getCurrentAppLayout } from "Helpers/helpers"
import Axios from "axios"
import RouterList from '@/router/routerList'
import { mapGetters } from "vuex";

	export default {
		mounted() {
			this.role()
		},
		data(){
			return {
				links: null
			}
		},
		computed: {
			...mapGetters(["getRole"])
		},
		methods: {
			role() {
				let _this = this
				Axios.get('/top-menu/index')
				.then(res => {
					if (res.data.code === 1) {
						const dat = res.data.data.datamenu
						const role = res.data.data.assignments
						let arr = []
						for (let i = 0; i < dat.length; i++) {
							if (dat[i].items.length > 0) {
								dat[i].items.map(item => {
									const title = item.title
									item.fontend_path = item.fontend_path
									arr.push(item)
								})
							}
						}
						_this.links = arr
					}
				})
			}
		}
	};
</script>
