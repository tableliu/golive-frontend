// 页面列表
import RouterList from './routerList'
import Full from 'Container/Full'
// 页面
const Signin = () => import(/* webpackChunkName: "Public" */ 'Views/signin')
const Map = () => import(/* webpackChunkName: "Public" */ 'Views/signin/map')

export default {
  path: '/signin',
  component: Full,
  redirect: '/signin/index',
  children: [
    {
       path: RouterList.child.signin.path,
       component: Signin,
       meta: {
          requiresAuth: true,
          title: 'message.signin',
          name: RouterList.child.signin.name,
          breadcrumb: RouterList.getFullBread('signin')
       }
    },
    {
       name: RouterList.child.signin.child.map.name,
       path: RouterList.child.signin.child.map.path,
       component: Map,
       meta: {
          requiresAuth: true,
          title: 'message.signin',
          name: RouterList.child.signin.child.map.name,
          breadcrumb: RouterList.getFullBread('map')
       }
    }
  ]
}
