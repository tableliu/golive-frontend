import Full from 'Container/Full'
import RouterList from './routerList'
// dashboard components
const Home = () => import(/* webpackChunkName: "Default" */ 'Views/home')
const UserProfile = () => import(/* webpackChunkName: "Default" */ 'Views/users/UserProfile');
const Record = () => import(/* webpackChunkName: "Default" */ 'Views/liveshow/record/record')

export default {
   path: '/',
   component: Full,
   redirect: '/home',
   children: [
     {
        path: RouterList.child.home.path,
        component: Home,
        meta: {
           requiresAuth: true,
           title: 'message.home',
           name: RouterList.child.home.name,
           s18n: RouterList.child.home.s18n,
           breadcrumb: RouterList.getFullBread('home')
        }
     },
   	 {
   	  	path: RouterList.child.personal.path,
   			component: UserProfile,
   			meta: {
   				title: 'message.personal',
          name: RouterList.child.personal.name,
          s18n: RouterList.child.personal.s18n,
   				breadcrumb: '首页 / 个人资料'
   			}
   	 },
     {
        path: RouterList.child.liveshow_record.path,
        component: Record,
        meta: {
           requiresAuth: true,
           title: 'message.liveshow_record',
           name: RouterList.child.liveshow_record.name,
           s18n: RouterList.child.liveshow_record.s18n,
           breadcrumb: RouterList.getFullBread('liveshow_record')
        }
     }
   ]
}
