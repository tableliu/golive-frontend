import { store } from '@/store/store'
export default class {
  constructor() {
    const id = JSON.parse(localStorage.getItem('userId'))
    const name = localStorage.getItem('uname')
    const aevterUrl = localStorage.getItem('aevterUrl') === 'null' ? null : localStorage.getItem('aevterUrl')
    const remember = localStorage.getItem('remember')
    const loginStatus = localStorage.getItem('loginStatus')
    const storage = {
      id: id,
      name: name,
      aevterUrl: aevterUrl,
      remember: remember,
      loginStatus: loginStatus
    }
    const ff = store
    if ((ff.getters.userInfo.user && ff.getters.userInfo.user.name === '') || ff.getters.userInfo.name ==='') {
      this.user = storage
      ff.dispatch('setUserInfo', this.user)
    }else {
      this.user = ff.getters.userInfo
    }
  }
  getUser() {
    if(this.user) return this.user
  }
  getUname() {
    if(this.user && this.user.uname && this.user.uname !== '') return this.user.uname
  }
  getAveatar() {
    if(this.user && this.user.aevterUrl && this.user.aevterUrl !== '') return this.user.aevterUrl
  }
  setUser(obj = {}) {
    store.dispatch('setUserInfo', obj)
  }
  setStorage(obj = {name: '', aevterUrl: ''}) {
    for(let i in obj) {
      localStorage.setItem(i, obj[i])
    }
    this.setUser(obj)
    this.user = obj
  }
  getStorage() {
    const userinfo = localStorage.getItem('userInfo')
    return userinfo ? userinfo : null
  }
  clearStorage() {
    if(localStorage.userinfo)localStorage.removeItem('userInfo')
  }
  getLogStatus() {
    store.getters.getLoginStatus()
  }
  setLogStatus(bool = false) {
    store.dispatch('setLoginStatus', bool)
  }
}
