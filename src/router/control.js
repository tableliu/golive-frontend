import RouterList from './routerList'
import FullOfAdmin from 'Container/FullOfAdmin'
const Authority = () => import(/* webpackChunkName: "Control" */ 'Views/control/authority')
const AuthoritySetup = () => import(/* webpackChunkName: "Control" */ 'Views/control/authority/setup')
const Role = () => import(/* webpackChunkName: "Control" */ 'Views/control/role')
const RoleSetup = () => import(/* webpackChunkName: "Control" */ 'Views/control/role/setup')
const Route = () => import(/* webpackChunkName: "Control" */ 'Views/control/route')
const Assign = () => import(/* webpackChunkName: "Control" */ 'Views/control/assign')
const Menu = () => import(/* webpackChunkName: "Control" */ 'Views/control/menu')
const UserTable = () => import(/* webpackChunkName: "Control" */  'Views/usertable')
export default {
  path: '/control',
  component: FullOfAdmin,
  redirect: '/control/authority',
  children: [
    {
       path: RouterList.child.authority.path,
       component: Authority,
       meta: {
          requiresAuth: true,
          title: 'message.authority.name',
          name: RouterList.child.authority.name,
          s18n: RouterList.child.authority.s18n,
          breadcrumb: RouterList.getFullBread('authority')
       }
    },
    {
       path: RouterList.child.usertable.path,
       component: UserTable,
       meta: {
          requiresAuth: true,
          title: 'message.userContorl',
          name: RouterList.child.usertable.name,
          s18n: RouterList.child.usertable.s18n,
          breadcrumb: RouterList.getFullBread('usertable')
       }
    },
    {
       path: RouterList.child.authority.child.authority_setup.path,
       component: AuthoritySetup,
       meta: {
          requiresAuth: true,
          title: 'message.authority.setup.name',
          name: RouterList.child.authority.child.authority_setup.name,
          s18n: RouterList.child.authority.child.authority_setup.s18n,
          breadcrumb: RouterList.getFullBread('authority_setup')
       }
    },
    {
       path: RouterList.child.role.path,
       component: Role,
       meta: {
          requiresAuth: true,
          title: 'message.role.name',
          name: RouterList.child.role.name,
          s18n: RouterList.child.role.s18n,
          breadcrumb: RouterList.getFullBread('role')
       }
    },
    {
       path: RouterList.child.role.child.role_setup.path,
       component: RoleSetup,
       meta: {
          requiresAuth: true,
          title: 'message.role.setup.name',
          name: RouterList.child.role.child.role_setup.name,
          s18n: RouterList.child.role.child.role_setup.s18n,
          breadcrumb: RouterList.getFullBread('role_setup')
       }
    },
    {
       path: RouterList.child.route.path,
       component: Route,
       meta: {
          requiresAuth: true,
          title: 'message.route',
          name: RouterList.child.route.name,
          s18n: RouterList.child.route.s18n,
          breadcrumb: RouterList.getFullBread('route')
       }
    },
    {
       path: RouterList.child.usertable.child.assign.path,
       component: Assign,
       meta: {
          requiresAuth: true,
          title: 'message.assign',
          name: RouterList.child.usertable.child.assign.name,
          s18n: RouterList.child.usertable.child.assign.s18n,
          breadcrumb: RouterList.getFullBread('assign')
       }
    },
    {
       path: RouterList.child.menu.path,
       component: Menu,
       meta: {
          requiresAuth: true,
          title: 'message.menuList',
          name: RouterList.child.menu.name,
          s18n: RouterList.child.menu.s18n,
          breadcrumb: RouterList.getFullBread('menu')
       }
    }
  ]
}
