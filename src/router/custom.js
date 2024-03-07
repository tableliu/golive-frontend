// 页面列表
import RouterList from './routerList'
import Full from 'Container/Full'
// 页面
const Device = () => import(/* webpackChunkName: "Custom" */ 'Views/custom/device')
const Equipment = () => import(/* webpackChunkName: "Custom" */ 'Views/custom/equipment')
const InsUnit = () => import(/* webpackChunkName: "Custom" */'Views/custom/insUnit')
const ProcessControl = () => import(/* webpackChunkName: "Custom" */  'Views/custom/process')
const ProcessList = () => import(/* webpackChunkName: "Custom" */ 'Views/custom/process/list')

export default {
  path: '/custom',
  component: Full,
  redirect: '/custom/device',
  children: [
    {
       path: RouterList.child.device.path,
       component: Device,
       meta: {
          requiresAuth: true,
          title: 'message.device_control',
          name: RouterList.child.device.name,
          s18n: RouterList.child.device.s18n,
          breadcrumb: RouterList.getFullBread('device')
       }
    },
    {
       path: RouterList.child.equipment.path,
       component: Equipment,
       meta: {
          requiresAuth: true,
          title: 'message.equipment',
          name: RouterList.child.equipment.name,
          s18n: RouterList.child.equipment.s18n,
          breadcrumb: RouterList.getFullBread('equipment')
       }
    },
    {
       path: RouterList.child.insUnit.path,
       component: InsUnit,
       meta: {
          requiresAuth: true,
          title: 'message.insUnit',
          name: RouterList.child.insUnit.name,
          s18n: RouterList.child.insUnit.s18n,
          breadcrumb: RouterList.getFullBread('insUnit')
       }
    },
    {
       path: RouterList.child.processControl.path,
       component: ProcessControl,
       meta: {
          requiresAuth: true,
          title: 'message.processControl',
          name: RouterList.child.processControl.name,
          s18n: RouterList.child.processControl.s18n,
          breadcrumb: RouterList.getFullBread('processControl')
       }
    },
    {
       path: RouterList.child.processList.path,
       component: ProcessList,
       meta: {
          requiresAuth: true,
          title: 'message.processControl',
          name: RouterList.child.processList.name,
          s18n: RouterList.child.processList.s18n,
          breadcrumb: RouterList.getFullBread('processList')
       }
    }
  ]
}
