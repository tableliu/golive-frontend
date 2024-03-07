/**
 * App Entry File
 * Vuely: A Powerfull Material Design Admin Template
 * Copyright 2018. All Rights Reserved
 * Created By: The Iron Network, LLC
 * Made with Love
 */
import 'babel-polyfill'
import Vue from 'vue'
import Vuetify from 'vuetify'
// import * as VueGoogleMaps from 'vue2-google-maps'
import { Vue2Dragula } from 'vue2-dragula'
import VueQuillEditor from 'vue-quill-editor'
import wysiwyg from 'vue-wysiwyg'
import VueBreadcrumbs from 'vue2-breadcrumbs'
import VueResource from 'vue-resource'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import Nprogress from 'nprogress'
import VueI18n from 'vue-i18n'
import fullscreen from 'vue-fullscreen'
import InstantSearch from 'vue-instantsearch'
// import VueVideoPlayer from 'vue-video-player'
// import Croppa from 'vue-croppa'
import Axios from 'axios'
import 'xe-utils'
// global components
import GlobalComponents from './globalComponents'

// import apiJson from '../public/serverconfig.json'
// // api baseURL
import apiJs from './api/API.js'
//是否生产环境
const isProduction = process.env.NODE_ENV === "production"


// app.vue
import App from './App'

// router
import router from './router'

// store
import { store } from './store/store'

// firebase
// import './firebase'

// include script file
import './lib/VuelyScript'

// include all css files
import './lib/VuelyCss'

// messages
import messages from './lang'

import Prototype from './tools/prototype'

// 深层拷贝对象
import DeepClone from './tools/deepClone'

//表单验证
import Valid from './tools/formValid'

//导航
import Tour from './plugins/tour/tour'

//获取querys
import getParmars from './tools/getParmars'

//频繁调用解决方案
import Debounce from './tools/debounce'

//搜索框功能类
import SearchClass from './tools/search'

import HttpStatusHandel from './tools/httpStatusHandel'

// navigation guards before each
router.beforeEach((to, from, next) => {
  store.dispatch('setRouters', {
    to: to,
    from: from
  })
	next()
	// if (to.meta.requiresAuth) {
	// 	const ls = store.getters.getLoginStatus
	// 	if(ls) {
	// 		next()
	// 	}else{
	// 		next({
  //       path: '/session/login',
  //       query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
  //     })
	// 	}
	// }else{
	// 	next()
	// }
})
Axios.defaults.baseURL = isProduction ? $public_api.BaseServe : apiJs.BaseServe
Axios.defaults.withCredentials=true
Axios.defaults.timeout =  50000
Axios.interceptors.request.use(
	config => {
		//请求前拦截
		return config
	}
)
Axios.interceptors.response.use(
	response => {
		const {to,from} = store.getters.getHistory
		const responseURL = response.request.responseURL
		//请求结果拦截
		if(response.status === 403 || response.data.code === -1){
				// 如果已登录，则修改LoginStatus并返回response，否则抛出error
			router.replace({
	      path: '/session/login' // 将跳转的路由path作为参数，登录成功后跳转到该路由
	    })
		}else {
      const status = response.status, code = response.data.code
      if (status == 200) {
        switch(code) {
          case 1:
          break
          case 0:
            store.commit('setRequest', {
              valid: false,
              url: responseURL,
              type: 'warning',
              msg: response.data.msg
            })
          break
          case 2:
            for (var variable in response.data.errdata) {
              store.commit('setRequest', {
                valid: false,
                url: responseURL,
                type: 'warning',
                msg: response.data.errdata[variable]
              })
            }
          break
          case 3:
            store.commit('setRequest', {
              valid: false,
              url: responseURL,
              type: 'warning',
              msg: '您暂无访问权限.'
            })
            setTimeout(() => {
              router.replace({
                path: '/home' // 将跳转的路由path作为参数，登录成功后跳转到该路由
              })
            }, 1000)
          break
          case 4:
            store.commit('setRequest', {
              valid: false,
              url: responseURL,
              type: 'error',
              msg: '您访问的,文件/资源不存在.'
            })
          break
          case 5:
            store.commit('setRequest', {
              valid: false,
              url: responseURL,
              type: 'warning',
              msg: '未选择项目源,请选择项目后再进行操作.'
            })
            store.dispatch('setLibraryStatus', {
              code: 5,
              status: false
            })
          break
          case 7:
            store.commit('setRequest', {
              valid: false,
              url: responseURL,
              type: 'warning',
              msg: '非法操作：' + response.data.msg
            })
          break
        }
      }else {
        const result = HttpStatusHandel(status)
          ,selectedLocale = store.getters.selectedLocale.locale
        store.commit('setRequest', {
          valid: false,
          url: responseURL,
          type: result.type,
          msg: selectedLocale === 'en' ? result.msg.en : result.msg.cn
        })
      }

      return response
    }
	},
	error => {
    let msg = ''
		if(error.response) {
      const responseURL = error.response.request.responseURL
			msg = '服务器异常'
		}else{
      msg = '无法连接服务器.'
		}
    store.commit('setRequest', {
      valid: false,
      url: null,
      type: 'error',
      msg: msg
    })
    const response = {
      data: {
        code: 500,
        msg: 'server error',
        data: null
      }
    }
    Promise.reject(error);
	}
)
// navigation guard after each
router.afterEach((to, from) => {
	Nprogress.done()
	setTimeout(() => {
		const contentWrapper = document.querySelector(".v-content__wrap");
		if(contentWrapper !== null){
			contentWrapper.scrollTop = 0;
		}
		const boxedLayout = document.querySelector('.app-boxed-layout .app-content');
		if(boxedLayout !==  null){
			boxedLayout.scrollTop = 0;
		}
		const miniLayout = document.querySelector('.app-mini-layout .app-content');
		if(miniLayout !== null){
			miniLayout.scrollTop = 0;
		}
	}, 200);
})

//初始化通用构造函数
Prototype.init()
// API地址
Vue.prototype.$API = isProduction ? $public_api.BaseServe : apiJs.BaseServe
Vue.prototype.$MAPAPI = isProduction ? $public_api.MapApi : apiJs.MapApi
Vue.prototype.$SOCKET = isProduction ? $public_api.Socket : apiJs.Socket
Vue.prototype.$EmediaAppkey = isProduction ? $public_api.EmediaAppkey : apiJs.EmediaAppkey
Vue.prototype.$getImageLocation = function(url, type) {
  if (!url || url === '') {
    if (type === 'avatar') {
      return '/static/avatar.png'
    }
    return '/static/no-img.png'
  }
  const result = (() => {
    const isCsdn = url.indexOf('http') > -1
    const isWx = url.indexOf('wx.qlogo') > -1
    if (isCsdn || isWx) {
      return url
    }
    return (isProduction ? $public_api.BaseServe : apiJs.BaseServe) + '/' + url
  })()
  return result
}
//深度拷贝函数(多层嵌套对象)
Vue.prototype.deepClone = DeepClone
// ajax实例
Vue.prototype.$axios = Axios
//config
// 关闭VUE的报告与警告
Vue.config.silent = true
Vue.prototype.$getParmars = getParmars.getParmars
Vue.prototype.$Search = SearchClass
Vue.prototype.$Debounce = Debounce
// plugins
Vue.use(Vuetify, {
	theme: store.getters.selectedTheme.theme
});
// 注册导航提示到Vue实例
Vue.use(Tour)
Vue.use(InstantSearch);
Vue.use(VueI18n)
Vue.use(Vue2Dragula)
Vue.use(VueQuillEditor)
Vue.use(VueResource)
Vue.use(wysiwyg, {})
Vue.use(VueBreadcrumbs)
Vue.use(Notifications, { velocity })
Vue.use(fullscreen);
Vue.use(GlobalComponents);
// Vue.use(VueVideoPlayer);
// Vue.use(Croppa);
// Vue.use(VueGoogleMaps, {
// 	load: {
// 		key: 'AIzaSyBtdO5k6CRntAMJCF-H5uZjTCoSGX95cdk' // Add your here your google map api key
// 	}
// })
// 注册表单验证到Vue实例
Vue.use(Valid)

// Create VueI18n instance with options
const i18n = new VueI18n({
	locale: store.getters.selectedLocale.locale, // set locale
	messages, // set locale messages
})

/* eslint-disable no-new */
new Vue({
	store,
	i18n,
	router,
	render: h => h(App),
	components: { App }
}).$mount('#app')
