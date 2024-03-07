// 页面列表
import RouterList from './routerList'
import Full from 'Container/Full'
// 页面
const VideoLibrary = () => import(/* webpackChunkName: "Scene" */ 'Views/scene/videoLibrary')
const VideoLibrarySetup = () => import(/* webpackChunkName: "Scene" */ 'Views/scene/videoLibrary/setup')
const Record = () => import(/* webpackChunkName: "Scene" */ 'Views/scene/record/record')
const RecordSetup = () => import(/* webpackChunkName: "Scene" */ 'Views/scene/record/videoDetail')
const FormLibrary = () => import(/* webpackChunkName: "Scene" */ 'Views/scene/formLibrary')

export default {
  path: '/scene',
  component: Full,
  redirect: RouterList.child.record.path,
  children: [
    {
       path: RouterList.child.videoLibrary.path,
       component: VideoLibrary,
       meta: {
          requiresAuth: true,
          title: 'message.videoLibrary',
          name: RouterList.child.videoLibrary.name,
          s18n: RouterList.child.videoLibrary.s18n,
          breadcrumb: RouterList.getFullBread('videoLibrary')
       }
    },
    {
       path: RouterList.child.videoLibrary.child.videoLibrary_setup.path,
       component: VideoLibrarySetup,
       meta: {
          requiresAuth: true,
          title: 'message.videoLibrarySetup',
          name: RouterList.child.videoLibrary.child.videoLibrary_setup.name,
          s18n: RouterList.child.videoLibrary.child.videoLibrary_setup.s18n,
          breadcrumb: RouterList.getFullBread('videoLibrary_setup')
       }
    },
    {
       path: RouterList.child.record.path,
       component: Record,
       meta: {
          requiresAuth: true,
          title: 'message.operation_record',
          name: RouterList.child.record.name,
          s18n: RouterList.child.record.s18n,
          breadcrumb: RouterList.getFullBread('record')
       }
    },
    {
       path: RouterList.child.record.child.record_setup.path,
       component: RecordSetup,
       meta: {
          requiresAuth: true,
          title: 'message.recordSetup',
          name: RouterList.child.record.child.record_setup.name,
          s18n: RouterList.child.record.child.record_setup.s18n,
          breadcrumb: RouterList.getFullBread('record_setup')
       }
    },
    {
       path: RouterList.child.formLibrary.path,
       component: FormLibrary,
       meta: {
          requiresAuth: true,
          title: 'message.formLibrary',
          name: RouterList.child.formLibrary.name,
          s18n: RouterList.child.formLibrary.s18n,
          breadcrumb: RouterList.getFullBread('formLibrary')
       }
    }
  ]
}
