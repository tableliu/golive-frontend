<template>
	<v-menu offset-y origin="right top" left content-class="language-dropdown" transition="slide-y-transition" nudge-top="-10" class="v-step-3">
		<v-btn icon large slot="activator">
			<img class="img-responsive" :src="`/static/flag-icons/${selectedLocale.icon}.png`">
		</v-btn>
		<div class="dropdown-content">
			<div class="dropdown-top d-custom-flex justify-space-between primary">
				<span class="white--text fw-bold">{{ $t('message.language') }}</span>
			</div>
			<v-list class="dropdown-list">
				<v-list-tile v-for="language in localeLanguages" :key="language.name" @click="changeLanguage(language)">
					<img class="img-responsive mr-3" :src="`/static/flag-icons/${language.icon}.png`">
					<span>{{ language.name }}</span>
				</v-list-tile>
			</v-list>
		</div>
	</v-menu>
</template>

<script>
	let _this
	import {
		mapGetters
	} from "vuex";

	export default {
		data: () => ({
			languageFormat: [
				{
					backend: 'en-US',
					frontend: 'en'
				},
				{
					backend: 'zh-CN',
					frontend: 'cn'
				}
			]
		}),
		mounted() {
			_this = this
		},
		computed: {
			...mapGetters(["selectedLocale", "languages"]),
			localeLanguages() {
				const English = this.languages[0]
				const Chinese = this.languages[5]
				return [English, Chinese]
			}
		},
		methods: {
			changeLanguage(language) {
				const target = _this.languageFormat.find(item => {
					return item.frontend === language.locale
				})
				_this.$axios.post("user/change-language?language=" + target.backend)
				.then(res => {
					if (res.data.code === 1) {
						setTimeout(() => {
							window.location.reload();
						}, 1000)
					}
				})
			}
		}
	};
</script>
