import Tour from './components/index'

const VueTour = {
  install (Vue, options) {
    Vue.component('STour', Tour)
    Vue.prototype.$tours = {}
  }
}

export default VueTour
