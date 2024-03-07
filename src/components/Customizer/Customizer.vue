<template>
	<div class="v-customizer">
		<!-- <v-navigation-drawer
			fixed
			v-model="customizerIn"
			:width="300"
			:right="!rtlLayout"
			app
			temporary
			class="clearfix"
		>
			<v-toolbar color="primary" dark>
				<v-toolbar-title>{{$t('message.themeOptions')}}</v-toolbar-title>
			</v-toolbar>
			<v-tabs grow>
				<v-tab>{{$t('message.general')}}</v-tab>
				<v-tab>{{$t('message.advance')}}</v-tab>
				<v-tab-item>
					<vue-perfect-scrollbar class="customizer-scroll-area" :settings="settings">
						<div class="inner-toolbar">
							<theme-provider></theme-provider>
							<sidebar-filters-provider></sidebar-filters-provider>
							<header-filters-provider v-if="isHeaderFilterAvaiable()"></header-filters-provider>
							<v-flex>
								<p>{{$t('message.routerAnimation')}}</p>
								<v-select
									:items="routerAnimations"
									label="Select Animation"
									:value="selectedRouterAnimation"
									@change="changeRouterAnimation($event)"
									outline
								></v-select>
							</v-flex>
						</div>
					</vue-perfect-scrollbar>
				</v-tab-item>
				<v-tab-item>
					<vue-perfect-scrollbar class="customizer-scroll-area" :settings="settings">
						<div class="inner-toolbar sidebar-overlay-color">
							<v-list class="mb-4 theme-layouts">
								<v-list-tile>
									<v-list-tile-content>
										<v-checkbox
											:label="$t('message.darkMode')"
											color="primary"
											@change="emitDarkMode"
											:input-value="darkMode"
										></v-checkbox>
									</v-list-tile-content>
								</v-list-tile>
								<v-list-tile v-if="isSidebarAvailable()">
									<v-list-tile-content>
										<v-checkbox
											:label="$t('message.collapseSidebar')"
											color="primary"
											@change="emitCollapseSidebar"
											:input-value="collapseSidebar"
										></v-checkbox>
									</v-list-tile-content>
								</v-list-tile>
								<v-list-tile>
									<v-list-tile-content>
										<v-checkbox
											:label="$t('message.rtlLayout')"
											color="primary"
											@change="emitRtlLayout"
											:input-value="rtlLayout"
										></v-checkbox>
									</v-list-tile-content>
								</v-list-tile>
								<v-list-tile v-if="isSidebarAvailable()">
									<v-list-tile-content>
										<v-checkbox
											:label="$t('message.backgroundImage')"
											color="primary"
											@change="emitEnableBackgroundImage"
											:input-value="backgroundImage"
										></v-checkbox>
									</v-list-tile-content>
								</v-list-tile>
							</v-list>
							<div class="sidebar-images" v-if="backgroundImage">
								<div class="d-inline-block mx-1 mb-2" v-for="backgroundImage in sidebarBackgroundImages" :key="backgroundImage.id">
									<a href="javascript:void(0)" class="img-holder" :class="{'active' : selectedSidebarBgImage.id === backgroundImage.id}">
										<img :src="backgroundImage.url" height="200" width="75" @click="changeBackgroundImage(backgroundImage)" alt="dynamic sidebar images" class="img-responsive">
									</a>
								</div>
							</div>
						</div>
					</vue-perfect-scrollbar>
				</v-tab-item>
			</v-tabs>
		</v-navigation-drawer> -->
		<!-- 右侧更换主题按钮 -->
		<!-- <div class="app-customizer">
			<a class="customizer-toggle primary v-step-4" href="javascript:;" @click="toggleCustomizer">
				<i class="zmdi zmdi-settings zmdi-hc-spin font-lg"></i>
			</a>
		</div> -->
		<go-top class="app-customizer fixed-back-top"></go-top>
	</div>
</template>

<script>
import ThemeProvider from "./ThemeProvider";
import { mapGetters } from "vuex";
import SidebarFiltersProvider from "./SidebarFiltersProvider";
import HeaderFiltersProvider from "./HeaderFiltersProvider";
import { getCurrentAppLayout } from "Helpers/helpers";
import GoTop from "@/components/gotop"
import SettingToolbar from "@/components/settingToolbar"

export default {
  components: {
    ThemeProvider,
    SidebarFiltersProvider,
    HeaderFiltersProvider,
		GoTop,
		SettingToolbar
  },
  data() {
    return {
      customizerIn: false,
      settings: {
        maxScrollbarLength: 160
      },
			search: '',
			items: [
        { header: '消息列表' },
        {
					id: 1,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: '相亲征友群',
          subtitle: "80,90离异群，寻找最需要幸福的你",
					newMessage: true,
					liveShow: true
        },
        { divider: true, inset: true },
        {
					id: 2,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: '16级班级群',
          subtitle: "加里顿大学16届大傻子班级群",
					newMessage: true
        },
        { divider: true, inset: true },
        {
					id: 3,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '南京安质信office',
          subtitle: "南京安质信工程技术有限公司南京办公室"
        },
        { divider: true, inset: true },
        {
					id: 4,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '南京安质信office',
          subtitle: "南京安质信工程技术有限公司南京办公室"
        },
        { divider: true, inset: true },
        {
					id: 5,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '南京安质信office',
          subtitle: "南京安质信工程技术有限公司南京办公室"
        },
        { divider: true, inset: true },
        {
					id: 6,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '南京安质信office',
          subtitle: "南京安质信工程技术有限公司南京办公室"
        },
        { divider: true, inset: true },
        {
					id: 7,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '南京安质信office',
          subtitle: "南京安质信工程技术有限公司南京办公室"
        },
        { divider: true, inset: true },
        {
					id: 8,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '南京安质信office',
          subtitle: "南京安质信工程技术有限公司南京办公室"
        },
        { divider: true, inset: true },
        {
					id: 9,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '南京安质信office',
          subtitle: "南京安质信工程技术有限公司南京办公室"
        },
        { divider: true, inset: true },
        {
					id: 10,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '南京安质信office',
          subtitle: "南京安质信工程技术有限公司南京办公室"
        },
        { divider: true, inset: true },
        {
					id: 11,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '南京安质信office',
          subtitle: "南京安质信工程技术有限公司南京办公室"
        }
      ]
    };
  },
  methods: {
    // dark mode handlerleft="ifRtlLayout" :right="!ifRtlLayout"
    emitDarkMode() {
      this.$store.dispatch("darkModeHandler");
    },
    // collapse sidebar handler
    emitCollapseSidebar() {
      this.$store.dispatch("collapseSidebar");
    },
    // enable background image handler
    emitEnableBackgroundImage() {
      this.$store.dispatch("backgroundImage");
    },
    // change BackgroundImage customizer
    changeBackgroundImage(sidebarImage) {
      this.$store.dispatch("changeBackgroundImage", sidebarImage);
    },
    // toggle customizer
    toggleCustomizer() {
      this.customizerIn = !this.customizerIn;
    },
    // RTL handler
    emitRtlLayout() {
      this.$store.dispatch("rtlLayout");
    },
    // router animation handler
    changeRouterAnimation(value) {
      this.$store.dispatch("changeRouterAnimation", value);
    },
    isHeaderFilterAvaiable() {
      let layout = getCurrentAppLayout(this.$router);
      if (layout === "boxed" || layout === "boxed-v2") {
        return false;
      }
      return true;
    },
    isSidebarAvailable() {
      let layout = getCurrentAppLayout(this.$router);
      if (layout === "boxed" || layout === "horizontal" || layout === "boxed-v2") {
        return false;
      }
      return true;
    },
		customizerChange(v) {
			this.customizerIn = v
		},
		searchInputHandel() {
			const keyword = this.search
			const result = this.items.filter(item => {
				return item.title.includes(keyword) || item.subtitle.includes(keyword)
			})
		}
  },
  computed: {
    ...mapGetters([
      "darkMode",
      "collapseSidebar",
      "boxLayout",
      "rtlLayout",
      "backgroundImage",
      "sidebarBackgroundImages",
      "selectedSidebarBgImage",
      "sidebarFilters",
      "sidebarSelectedFilter",
      "routerAnimations",
      "selectedRouterAnimation"
    ])
  }
};
</script>

<style scoped>
.customizer-scroll-area {
  position: relative;
  height: 80vh;
}
.fixed-back-top {
	top: 90% !important;
	z-index: 9999;
}
/* .customizer-new-message:after {
	margin-left: 1rem;
	content: "(新消息)";
	font-size: 0.8rem;
	position: absolute;
	color: red;
} */
.customizer-toast {
	margin-right: 0.5rem;
	font-size: 0.8rem;
	display: inline-block;
	align-items: center;
	vertical-align: middle;
}
.customizer-toast i {
	margin-bottom: 2px;
}
.customizer-new-message {
	color: #e74c3c;
}
.customizer-live-show {
	color: #3498db;
}
</style>
<style media="screen">
.v-customizer .customizer-setting-toolbar a {
	top: 40%;
}
</style>
