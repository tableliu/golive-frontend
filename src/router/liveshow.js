// 页面列表
import RouterList from './routerList'
import NullContainer from 'Container/Null'
// 页面
const Liveshow = () => import(/* webpackChunkName: "Liveshow" */ 'Views/liveshow')

export default {
  path: '/liveshow',
  component: NullContainer,
  redirect: '/liveshow/index',
  children: [
    {
       path: RouterList.child.liveshow.path,
       component: Liveshow,
       meta: {
          requiresAuth: true,
          title: 'message.RemoteCollaboration',
          name: RouterList.child.liveshow.name,
          s18n: RouterList.child.liveshow.s18n,
          breadcrumb: RouterList.getFullBread('liveshow')
       }
    }
  ]
}
