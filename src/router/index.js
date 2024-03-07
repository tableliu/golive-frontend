import Vue from 'vue'
import Router from 'vue-router'

//routes
import defaultRoutes from './default';
import control from './control';
import publics from './public';
import liveshow from './liveshow';
import scene from './scene'

// session components
const LoginOne = () => import(/* webpackChunkName: "Main" */ 'Views/session/LoginOne');
const NotFund = () => import(/* webpackChunkName: "Main" */ 'Views/widgets/404');



	// 重写PUSH
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location)
}

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		defaultRoutes,
		control,
		publics,
		liveshow,
		scene,
		{
			path: '/session/login',
			component: LoginOne,
			meta: {
				title: 'message.login',
				breadcrumb: 'Session / Login'
			}
		},
    {
       name: 'notFundPage',
       path: '*',
       component: NotFund,
       meta: {
          requiresAuth: true,
          title: 'message.notFundPage',
          name: 'notFundPage',
          breadcrumb: 'notFundPage'
       }
    }
	]
})
