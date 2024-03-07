<!-- Side Structure -->
<template>
  	<div class="sidebar sidebar-overlay-dark">
    	<vue-perfect-scrollbar class="scroll-area" :settings="settings">
        <v-toolbar flat class="transparent scroll-area navigation">
          <v-list>
		        <app-logo></app-logo>
					<div>
						<template v-for="(item, index) in menus">
							<template v-if="item.items!= null">
								<v-list-group
									:key="index"
									prepend-icon="arrow_right"
									append-icon=""
									no-action
									v-model="item.active"
								>
									<v-list-tile slot="activator">
                    <v-icon
                    >
                      {{item.icon ? item.icon : 'done_outline'}}
                    </v-icon>
										<v-list-tile-content>
											<v-list-tile-title>
												<i class="mr-2 zmdi" :class="item.action"></i>
												<span>{{ textTruncate(item.title) }}</span>
											</v-list-tile-title>
										</v-list-tile-content>
									</v-list-tile>
									<v-list-tile
										v-for="(subItem, subIndex) in item.items"
										:key="subIndex"
										v-if="subItem !== null"
										:to="subItem.fontend_path ? subItem.fontend_path : '/'"
									>
                    <v-icon
                    >
                      {{subItem.icon ? subItem.icon : 'done_outline'}}
                    </v-icon>
										<v-list-tile-content
                    style="padding-left:1.5rem">
											<v-list-tile-title>{{ textTruncate(subItem.title) }}</v-list-tile-title>
										</v-list-tile-content>
									</v-list-tile>
								</v-list-group>
							</template>
							<template v-else>
								<v-list-tile
									:to="item.fontend_path"
									:key="item.fontend_path"
								>
									<v-list-tile-action>
										<i class="zmdi zmdi-caret-right"></i>
									</v-list-tile-action>
									<v-list-tile-content>
										<v-list-tile-title>
											<i class="mr-2 zmdi" :class="item.action"></i>
											<span>{{ textTruncate(item.title) }}</span>
										</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
							</template>
						</template>
					</div>
          </v-list>
        </v-toolbar>
    	</vue-perfect-scrollbar>
  	</div>
</template>

<script>
import UserBlock from "./UserBlock"
import { textTruncate, getCurrentAppLayout } from "Helpers/helpers"
import { mapGetters } from "vuex"
import RouterList from '@/router/routerList'
import AppLogo from "Components/AppLogo/AppLogo"
import Router from "@/router"
import Axios from "axios"


export default {
  data() {
    return {
      settings: {
        maxScrollbarLength: 160
      },
      menus:[]
    }
  },
  components: {
    UserBlock,
    AppLogo
  },
  computed: {

  },
  created() {
  },
	mounted() {
    let _this = this
    Axios.get('/top-menu/index')
    .then(res => {
      if (res.data.code === 1) {
        const dat = res.data.data
        let menus = res.data.data.datamenu
        const role = dat.assignments
        let fullPath = Router.history.current.fullPath
        _this.$store.dispatch('setActiveMenuGroup', menus)
        menus = _this.$store.getters.silderMenus
        if(menus.length > 0) {
          for(let i = 0; i < menus.length; i++ ) {
            if(menus[i].items.length > 0) {
              menus[i].items.forEach(item => {
                item.fontend_path === fullPath ? menus[i].active = true : menus[i].active = false
                const title = item.title
								item.fontend_path = item.fontend_path
              })

            }
          }
        }
        _this.menus = menus
        // 将用户角色放入store(目前只存放第一个角色)
        _this.$store.dispatch('roleActions', {vue: _this, name: role[0]})
      }
    })
    .catch(err => {
      throw new Error(err.message)
    })
	},
  methods: {
    textTruncate(text) {
      return textTruncate(text, 18);
    },
    getCurrentAppLayoutHandler() {
      return getCurrentAppLayout(this.$router)
    }
  }
};
</script>
