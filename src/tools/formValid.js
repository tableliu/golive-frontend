import deepClone from './deepClone'
import { store } from '@/store/store'
export default {
  install(vue) {                  //注册函数到vue实例
    vue.prototype.$valid = this
  },
  serializable() {
    const _this = this
    return class {
      constructor(ser) {
        this.originSer = deepClone(ser)
        this.required = _this.requiredArr.call(this, ser)
        this.checkInput = _this.checkInputArr.call(this, ser)
      }
      reset(ser) {
        ser = this.originSer
      }
    }
  },
  required(ser) {
    let obj = {}
    for (let i in ser) {
      if (ser.hasOwnProperty(i)) {
        const val = ser[i]
        obj[i] = function(v) {
          if (val.rule(v)) {
            val.status = true
            return true
          }
          val.status = false
          return val.text
        }
      }
    }
    return obj
  },
  requiredArr(ser) {
    let obj = {}
    for (let i in ser) {
      if (ser[i] instanceof Array) {
        obj[i] = []
        ser[i].forEach(item => {
          const func = v => {
            // 一次性提示(例如服务器返回的错误)
            if (item.once !== undefined) {
              if (item.once === false) {
                return true
              }
              item.once = false
              return item.text
            }
            if (item.rule(v)) {
              item.status = true
              return true
            }
            item.status = false
            return item.text
          }
          obj[i].push(func)
        })
      }
      // else {
      //   const val = ser[i]
      //   const f = function(v) {
      //     if (val.rule(v)) {
      //       val.status = true
      //       return true
      //     }
      //     val.status = false
      //     return val.text
      //   }
      //   obj[i] = [f]
      // }
    }
    return obj
  },
  checkInput(re) {
    for (let i in re) {
      if (re.hasOwnProperty(i)) {
        if (!re[i].status) {
          return false
        }
      }
    }
    return true
  },
  checkInputArr(re) {
    let bool = true
    for (let o in re) {
      for (var i = 0; i < re[o].length; i++) {
        const item = re[o][i]
        if (!item.status && !item.noCheckInput) {
          bool = false
          break
        }
      }
      if (!bool) {
        break
      }
    }
    return bool
  },
  formInputErrorHandel({ code, serializable, errObj }) {
    if (code != 2) {
      return
    }
    let errMsg = ''
    for (var variable in errObj) {
      if (errObj.hasOwnProperty(variable)) {
        serializable[variable].push({
          status: false,
          text: errObj[variable],
          noCheckInput: true,
          once: true,
          rule: function(v) {
            // return v !== repeat
          }
        })
        errMsg += errObj[variable]
      }
    }
    store.commit('setRequest', {
      valid: false,
      url: `user/create`,
      type: 'error',
      msg: errMsg
    })
  },
  changeStatus(ser, name, replace) {
    if (ser.hasOwnProperty(name)) {
      ser[name] = replace
    }
  }
}
