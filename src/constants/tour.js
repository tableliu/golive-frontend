// tour.js 引导步骤数据
// 被引用：/plugins/tour
// 步骤：
// {
//   target: ".nav-title-text",        --本步骤的选择权标识(ID为：#xxx，class为：.xxx)
//   focus: true,                      --是否自动聚焦当前target,需要锚点跳转为true,不需要不填
//   position: "left"                  --引导框的位置, top、bottom、left、right 不填默认为bottom
//   title: "操作引导-报告提交",        --本步骤的提示标题
//   text: "报告提交可以用作报告的上传以及查看报告上传历史",     --本步骤的提示文本(Array,一个下标是一行)
//   value: null,          --本步骤的运行结果数值
//   watch: null,          --本步骤需要观察的字段(根据当前页面vue实例)
//   valid: true,          --本步骤是否合格，只有合格才能进行下一步
//   callback: () => {},   --本步骤运行的代码(argument: vue, _this, arr | 当前页面的vue实例,当前数组对象,整个数组)
//   offset: {             --偏移(Number)
//      left: -100         --往左侧增加距离,负数为减少距离
//      top: 0             --往顶部增加距离,负数为减少距离
//   },           --上一步的下标(为空表示第一步)
// }
// 注意：target必须是根节点下的子节点(不能是孙节点),根节点为窗口显示区域
// (如果target为孙节点,则只计算距离父节点顶部以及左侧边界的距离,父节点距离根节点的距离需要手动设置offset)
// 注意：第一步和最后一步不要是选项引导,必须是介绍引导
// ------------------------------------------------------------------
// 启动：在需要引导的页面mounted函数内
// this.$tours.start('personReportUpload', this)    --personReportUpload,引导数据对象名
const personReportUpload = [
  {
    target: ".nav-title-text",
    title: "操作引导-报告提交",
    text: [`报告提交可以用作报告的上传以及查看报告上传历史`],
    value: null,
    watch: null,
    valid: true,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__upload__1",
    title: "请选择报告类型",
    text: ["请选择需要提交报告的类型","报告日期的选项会根据报告类型而改变","提示：报告类型是必选项"],
    value: null,
    watch: 'active',
    valid: false,
    callback: (vue, _this, arr) => {
      // 获取需要观察的数据
      const val = vue.active.reportType.text
      // 保证重新引导的合格值为false
      _this.valid = false
      if (val) {
        // 将观察的数据赋给当前对象
        _this.value = val
        // 如果是不符合项报告或者放行报告，额外添加一个步骤
        if (val === '不符合项报告' || val === '放行报告') {
          const newObj = {
            type: 'add',
            target: "#tour__upload__3",
            title: "请选择设备信息",
            text: ["请根据设备名、批次或位号查询设备信息(可多选)","提示：多个查询框可查询到同一设备信息"],
            value: null,
            watch: 'einfo',
            valid: false,
            callback: (vue, _this, arr) => {
              const val = vue.active.equipment.text || vue.active.batch.text || vue.active.eNumber.text
              if (val) {
                _this.valid = true
              }
            },
            offset: {
              top: null,
              left: null
            }
          }
          // 如果不是不符合项报告或者放行报告，查看有没有添加过步骤，有则删除
          if (!arr[3] ) {
            arr.splice(3, 0, newObj)
          }else {
            if (arr[3].target != newObj.target) {
              arr.splice(3, 0, newObj)
            }
          }
        }else {
          if (arr[3] && arr[3].target === '#tour__upload__3') {
            arr.splice(3, 1)
          }
        }
        // 根据观察的值设置当前对象是否合格(此处写合格与否的逻辑)
        _this.valid = val !== '' ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__upload__2",
    title: "请选择报告日期",
    text: ["请单击选择报告日期,或在日历中选择日期", "提示：报告日期是必选项"],
    value: null,
    watch: 'active',
    valid: false,
    callback: (vue, _this) => {
      const val = vue.active.reportDate.showDate
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = val !== '' ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__upload__7",
    title: "请选择报告结论",
    text: ["请单击选择报告结论", "提示：报告结论是必选项"],
    value: null,
    watch: 'active',
    valid: false,
    callback: (vue, _this) => {
      const val = vue.active.reportResult.text
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = (val && val !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__upload__4",
    position: 'right',
    title: "确认报告信息",
    text: ["确认报告上传的相关信息"],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__upload__5",
    position: 'top',
    title: "请点击上传报告",
    text: ["确认报告信息无误后点击【上传报告】按钮上传报告","提示：按钮为灰色时,代表报告信息不完整，无法上传报告"],
    value: null,
    valid: true,
    watch: 'uploadDone',
    callback: (vue, _this) => {
      const bool = vue.uploadDone.done
      _this.valid = false
      _this.valid = _this.value = bool ? true : false
    },
    offset: {
      top: -30,
      left: 50
    }
  },
  {
    target: "#tour__upload__6",
    position: 'top',
    title: "报告上传完成后,在此处查看报告",
    text: ["此处表格可以查看刚刚上传的报告,以及历史上传报告"],
    value: null,
    valid: false,
    watch: 'uploadDone',
    callback: (vue, _this) => {
      const bool = vue.uploadDone
      _this.valid = false
      _this.valid = _this.value = bool ? true : false
    },
    offset: {
      top: null,
      left: null
    }
  }
]

//运营经理
const managerReportUpload = [
  {
    target: ".nav-title-text",
    title: "操作引导-报告提交",
    text: [`报告提交可以用作报告的上传以及查看报告上传历史`],
    value: null,
    watch: null,
    valid: true,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__manager__upload__1",
    title: "请选择报告类型",
    text: ["请选择需要提交报告的类型","报告日期的选项会根据报告类型而改变","提示：报告类型是必选项"],
    value: null,
    watch: 'active',
    valid: false,
    callback: (vue, _this, arr) => {
      // 获取需要观察的数据
      const val = vue.active.reportType.text
      // 保证重新引导的合格值为false
      _this.valid = false
      if (val) {
        // 将观察的数据赋给当前对象
        _this.value = val
        // 如果是不符合项报告或者放行报告，额外添加一个步骤
        if (val === '不符合项报告' || val === '放行报告') {
          const newObj = {
            type: 'add',
            target: "#tour__manager__upload__4",
            title: "请选择设备信息",
            text: ["请根据设备名、批次或位号查询设备信息(可多选)","提示：多个查询框可查询到同一设备信息"],
            value: null,
            watch: 'einfo',
            valid: false,
            callback: (vue, _this, arr) => {
              const val = vue.active.equipment.text || vue.active.batch.text || vue.active.eNumber.text
              if (val) {
                _this.valid = true
              }
            },
            offset: {
              top: null,
              left: null
            }
          }
          // 如果不是不符合项报告或者放行报告，查看有没有添加过步骤，有则删除
          if (!arr[4] ) {
            arr.splice(4, 0, newObj)
          }else {
            if (arr[4].target != newObj.target) {
              arr.splice(4, 0, newObj)
            }
          }
        }else {
          if (arr[4] && arr[4].target === '#tour__upload__4') {
            arr.splice(4, 1)
          }
        }
        // 根据观察的值设置当前对象是否合格(此处写合格与否的逻辑)
        _this.valid = val !== '' ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__manager__upload__2",
    title: "请选择报告日期",
    text: ["请单击选择报告日期,或在日历中选择日期", "提示：报告日期是必选项"],
    value: null,
    watch: 'active',
    valid: false,
    callback: (vue, _this) => {
      const val = vue.active.reportDate.showDate
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = val !== '' ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__manager__upload__7",
    title: "请选择报告结论",
    text: ["请单击选择报告结论", "提示：报告结论是必选项"],
    value: null,
    watch: 'active',
    valid: false,
    callback: (vue, _this) => {
      const val = vue.active.reportResult.text
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = (val && val !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: -250
    }
  },
  {
    target: "#tour__manager__upload__3",
    title: "请选择报告撰写人",
    text: ["报告撰写人不能选择 “所有人员”"],
    value: null,
    valid: true,
    watch: 'active',
    callback: (vue, _this) => {
      const bool = vue.active.reportWriter.id || null
      _this.valid = false
      _this.valid = _this.value = bool ? true : false
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__manager__upload__5",
    position: 'right',
    title: "确认报告信息",
    text: ["确认报告上传的相关信息"],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__manager__upload__6",
    position: 'top',
    title: "请点击上传报告",
    text: ["确认报告信息无误后点击【上传报告】按钮上传报告","提示：按钮为灰色时,代表报告信息不完整，无法上传报告"],
    value: null,
    valid: true,
    watch: 'uploadDone',
    callback: (vue, _this) => {
      const bool = vue.uploadDone.done
      _this.valid = false
      _this.valid = _this.value = bool ? true : false
    },
    offset: {
      top: -30,
      left: 50
    }
  },
  {
    target: "#tour__manager__upload__7",
    position: 'top',
    title: "报告上传完成后,在此处查看报告",
    text: ["此处表格可以查看刚刚上传的报告,以及历史上传报告"],
    value: null,
    valid: false,
    watch: 'uploadDone',
    callback: (vue, _this) => {
      const bool = vue.uploadDone
      _this.valid = false
      _this.valid = _this.value = bool ? true : false
    },
    offset: {
      top: null,
      left: null
    }
  }
]

// 导航栏
const navbar = [
  {
    target: "#tour__navbar__1",
    position: 'bottom',
    title: "操作引导-导航栏",
    text: ["导航栏主要显示平台logo,以及便捷操作区"],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__navbar__2",
    position: 'bottom',
    title: "导航栏-操作区",
    text: [
      "以上功能依次为：",
      "1.点击查看个人信息界面",
      "2.点击查看帮助文档",
      "3.点击快速修改账号密码",
      "4.点击安全退出平台"
    ],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: -40,
      left: -60
    }
  }
]

// 首页
const wtfHome = [
  {
    target: ".nav-title-text",
    position: 'bottom',
    title: "操作引导-首页",
    text: ["首页主要有快捷链接,基础数据查看,数据图表等功能"],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__home__1",
    position: 'bottom',
    title: "这里是常用功能区",
    text: ['点击"办公事务"区域的按钮,可以快速链接到对应功能页面'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: -400
    }
  },
  {
    target: "#tour__home__2",
    position: 'bottom',
    title: "这里是基础数据区",
    text: ['基础数据区显示基础功能的具体数量,点击"基础数据"区域的按钮,可以快速链接到对应功能页面'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: -100
    }
  },
  {
    target: "#tour__home__3",
    position: 'right',
    title: "这里是统计7天内报告数量统计图表",
    text: ['数据可视化区可以快速观察分析图表数据'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__home__4",
    position: 'left',
    title: "这里是所有检验单位报告数量统计图表",
    text: ['数据可视化区可以快速观察分析图表数据'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: 100
    }
  }
]
const managerHome = [
  {
    target: ".nav-title-text",
    position: 'bottom',
    title: "操作引导-首页",
    text: ["首页主要有快捷链接,基础数据查看,数据图表等功能"],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__home__1",
    position: 'bottom',
    title: "这里是常用功能区",
    text: ['点击"办公事务"区域的按钮,可以快速链接到对应功能页面'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: -400
    }
  },
  {
    target: "#tour__home__3",
    position: 'right',
    title: "这里是统计7天内报告数量统计图表",
    text: ['数据可视化区可以快速观察分析图表数据'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__home__5",
    position: 'left',
    title: "这里是所有检验员报告数量统计图表",
    text: ['数据可视化区可以快速观察分析图表数据'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: 100
    }
  }
]

const wtfControl = [
  {
    target: ".nav-title-text",
    position: 'bottom',
    title: "操作引导-报告管理",
    text: ["报告管理主要用于报告的分类查询,报告详情查看等功能"],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__1",
    position: 'bottom',
    title: "请选择报告日期",
    text: ['点击"报告日期"区域的按钮,选择一个报告日期或时间段'],
    value: null,
    valid: false,
    watch: 'active',
    callback: (vue, _this, arr) => {
      const val = vue.active.reportDate.value
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = (val && val !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__2",
    position: 'bottom',
    title: "请选择装置",
    text: ['点击"装置"区域的按钮,选择一个装置','将查询该装置下所属设备的报告'],
    value: null,
    valid: false,
    watch: 'active',
    callback: (vue, _this, arr) => {
      const val = vue.active.device.value
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = (val && val !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__3",
    position: 'bottom',
    title: "请选择制造厂/设备分类",
    text: ['点击输入查询制造厂或设备分类','将查询该制造厂或设备分类下所属设备的报告'],
    value: null,
    valid: true,
    watch: 'active',
    callback: (vue, _this, arr) => {
      const val1 = vue.active.factory.value,
            val2 = vue.active.equipmentType.value
      _this.valid = false
      if (val1 && val2) {
        _this.value = [val1, val2]
        _this.valid = (val1 && val1 !== '') && (val2 && val2 !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__9",
    position: 'bottom',
    title: "报告结论",
    text: ['点击选择报告结论','将查询该结论状态下的所有报告'],
    value: null,
    valid: true,
    watch: 'active',
    callback: (vue, _this, arr) => {},
    offset: {
      top: null,
      left: -300
    }
  },
  {
    target: "#tour__wtf__control__4",
    position: 'top',
    title: '请点击"展开"按钮',
    text: ['点击"展开"可以操作更多选项'],
    value: null,
    valid: true,
    watch: 'showMore',
    callback: (vue, _this, arr) => {
      const val = !vue.showMore.value
      _this.valid = false
      if (val) {
        _this.valid = _this.value = val
      }
    },
    offset: {
      top: 20,
      left: 35
    }
  },
  {
    target: "#tour__wtf__control__5",
    position: 'bottom',
    title: "请选择报告类型",
    text: ['点击"报告类型"区域的按钮,选择一个报告类型','将查询该报告类型下所属设备的报告'],
    value: null,
    valid: false,
    watch: 'active',
    callback: (vue, _this, arr) => {
      const val = vue.active.reportType.value
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = (val && val !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__6",
    position: 'bottom',
    title: "请选择检验单位",
    text: ['点击"检验单位"区域的按钮,选择一个检验单位','将查询该检验单位下所属设备的报告','检验员选项根据检验单位产生变化'],
    value: null,
    valid: false,
    watch: 'active',
    callback: (vue, _this, arr) => {
      const val = vue.active.insUnit.value
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = (val && val !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__7",
    position: 'bottom',
    title: "请选择检验员",
    text: ['点击"检验员"区域的按钮,选择一个检验员','将查询该检验员下所属设备的报告','检验员选项根据检验单位产生变化'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__8",
    position: 'bottom',
    title: "请选择设备",
    text: ['点击"设备"区域的按钮,选择一个设备','将查询该设备的报告'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: -300
    }
  },
  {
    target: "#tour__wtf__control__chip",
    focus: true,
    position: 'bottom',
    title: "这里显示当前所有选项",
    text: ['报告列表根据当前选项条件查询','选项可以进行"打开选项"以及"关闭选项"、"删除选项"等操作'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__manager__upload__table",
    focus: true,
    position: 'top',
    title: "在此处查看报告",
    text: ["查看当前选项筛选出的报告"],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: 20
    }
  }
]

const managerControl = [
  {
    target: ".nav-title-text",
    position: 'bottom',
    title: "操作引导-报告管理",
    text: ["报告管理主要用于报告的分类查询,报告详情查看等功能"],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__1",
    position: 'bottom',
    title: "请选择报告日期",
    text: ['点击"报告日期"区域的按钮,选择一个报告日期或时间段'],
    value: null,
    valid: false,
    watch: 'active',
    callback: (vue, _this, arr) => {
      const val = vue.active.reportDate.value
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = (val && val !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__2",
    position: 'bottom',
    title: "请选择装置",
    text: ['点击"装置"区域的按钮,选择一个装置','将查询该装置下所属设备的报告'],
    value: null,
    valid: false,
    watch: 'active',
    callback: (vue, _this, arr) => {
      const val = vue.active.device.value
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = (val && val !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__3",
    position: 'bottom',
    title: "请选择制造厂/设备分类",
    text: ['点击输入查询制造厂或设备分类','将查询该制造厂或设备分类下所属设备的报告'],
    value: null,
    valid: true,
    watch: 'active',
    callback: (vue, _this, arr) => {
      const val1 = vue.active.factory.value,
            val2 = vue.active.equipmentType.value
      _this.valid = false
      if (val1 && val2) {
        _this.value = [val1, val2]
        _this.valid = (val1 && val1 !== '') && (val2 && val2 !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__9",
    position: 'bottom',
    title: "报告结论",
    text: ['点击选择报告结论','将查询该结论状态下的所有报告'],
    value: null,
    valid: true,
    watch: 'active',
    callback: (vue, _this, arr) => {},
    offset: {
      top: null,
      left: -300
    }
  },
  {
    target: "#tour__wtf__control__4",
    position: 'top',
    title: '请点击"展开"按钮',
    text: ['点击"展开"可以操作更多选项'],
    value: null,
    valid: true,
    watch: 'showMore',
    callback: (vue, _this, arr) => {
      const val = !vue.showMore.value
      _this.valid = false
      if (val) {
        _this.valid = _this.value = val
      }
    },
    offset: {
      top: 20,
      left: 35
    }
  },
  {
    target: "#tour__wtf__control__5",
    position: 'bottom',
    title: "请选择报告类型",
    text: ['点击"报告类型"区域的按钮,选择一个报告类型','将查询该报告类型下所属设备的报告'],
    value: null,
    valid: false,
    watch: 'active',
    callback: (vue, _this, arr) => {
      const val = vue.active.reportType.value
      _this.valid = false
      if (val) {
        _this.value = val
        _this.valid = (val && val !== '') ? true : false
      }
    },
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__6",
    position: 'bottom',
    title: "请选择报告状态",
    text: ['点击"报告状态"区域的按钮,选择一个报告状态','将查询该报告状态下所属设备的报告'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__7",
    position: 'bottom',
    title: "请选择检验员",
    text: ['点击"检验员"区域的按钮,选择一个检验员','将查询该检验员下所属设备的报告','检验员选项根据检验单位产生变化'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__wtf__control__8",
    position: 'bottom',
    title: "请选择设备",
    text: ['点击"设备"区域的按钮,选择一个设备','将查询该设备的报告'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: -300
    }
  },
  {
    target: "#tour__wtf__control__chip",
    focus: true,
    position: 'bottom',
    title: "这里显示当前所有选项",
    text: ['报告列表根据当前选项条件查询','选项可以进行"打开选项"以及"关闭选项"、"删除选项"等操作'],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: null
    }
  },
  {
    target: "#tour__manager__upload__table",
    focus: true,
    position: 'top',
    title: "在此处查看/提交报告",
    text: ["查看当前选项筛选出的报告","在操作栏提交报告"],
    value: null,
    valid: true,
    watch: null,
    callback: () => {},
    offset: {
      top: null,
      left: 20
    }
  }
]

export default
  {
    wtfHome,
    managerHome,
    personReportUpload,
    managerReportUpload,
    wtfControl,
    managerControl,
    navbar
  }
