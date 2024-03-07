export default {
    name: '首页',
    path: '/home',
    child: {
      home: {
        name: '首页',
        s18n: 'home',
        path: '/home'
      },
      usertable: {
        name: '用户管理',
        s18n: 'userContorl',
        path: '/default/dashboard/usertable',
        child: {
          assign: {
            name: '用户权限',
            s18n: 'userContorlSetup',
            path: '/control/assign/:id/:name'
          }
        }
      },
      authority: {
        name: '权限列表',
        s18n: 'authority',
        path: '/control/authority',
        child: {
          authority_setup: {
            name: '权限设置',
            s18n: 'authoritySetup',
            path: '/control/authority/setup/:name'
          }
        }
      },
      role: {
        name: '角色列表',
        s18n: 'role',
        path: '/control/role',
        child: {
          role_setup:{
            name: '角色权限',
            s18n: 'roleSetup',
            path: '/control/role/setup/:name'
          }
        }
      },
      signin: {
        name: '签到管理',
        s18n: 'signin',
        path: '/signin/index',
        child: {
          map:{
            name: '地图预览',
            s18n: 'map',
            path: '/signin/map'
          }
        }
      },
      route: {
        name: '路由管理',
        s18n: 'route',
        path: '/control/route'
      },
      menu: {
        name: '菜单管理',
        s18n: 'menu',
        path: '/control/menu'
      },
      device: {
        name: '装置管理',
        s18n: 'device',
        path: '/custom/device'
      },
      equipment: {
        name: '设备管理',
        s18n: 'equipment',
        path: '/custom/equipment'
      },
      insUnit: {
        name: '检验单位',
        s18n: 'insUnit',
        path: '/custom/insUnit'
      },
      personal: {
        name: '个人资料',
        s18n: 'personal',
        path: '/default/users/user-profile'
      },
      liveshow: {
        name: 'liveshow',
        s18n: 'RemoteCollaboration',
        path: '/liveshow/index'
      },
      liveshow_record: {
        name: 'liveshow_record',
        s18n: 'record',
        path: '/liveshow/record'
      },
      videoLibrary: {
        name: '视频作业库',
        s18n: 'videoLibrary',
        path: '/scene/video-library/index',
        child: {
          videoLibrary_setup: {
            name: '视频作业编辑页面',
            s18n: 'videoLibrarySetup',
            path: '/scene/video-library/setup/:id/:name'
          }
        }
      },
      formLibrary: {
        name: '表单作业库',
        s18n: 'formLibrary',
        path: '/scene/form-library/index'
      },
      record: {
        name: 'record',
        s18n: 'record',
        path: '/scene/record/index',
        child: {
          record_setup: {
            name: '视频作业记录详情',
            s18n: 'recordSetup',
            path: '/scene/record/video/:id'
          }
        }
      }
    },
    getFullBread(key) {
      let name = ''
      if (this.child.hasOwnProperty(key)) {
        name = `${this.name} / ${this.child[key].name}`
      }else{
        for (let i in this.child) {
          const t = this.child[i].child
          if(t) {
            if(t.hasOwnProperty(key)) name = `${this.name} / ${this.child[i].name} / ${this.child[i].child[key].name}`
          }
        }
      }
      return name
    }
  }
