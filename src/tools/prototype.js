export default {
  init() {
    this.register('isNone')
    this.register('getType')
  },

  register(e) {
    String.prototype[e] =
    Number.prototype[e] =
    Array.prototype[e] =
    // Object.prototype[e] =
    this[e]
  },

  isNone() {
    const type = this.getType()
    switch(type) {
      case 'string':
        return this === '' ? true : false
      break
      case 'number':
        return this === 0 ? true : false
      break
      case 'array':
        return this.length === 0 ? true : false
      break
      case 'object':
        return Object.keys(this).length === 0 ? true : false
      break
    }
    return true
  },

  getType() {
    const type = typeof this
    switch(type) {
      case 'object':
        try {
          return this.length !== undefined ? 'array' : 'object'
        } catch (e) {
          return 'undefined'
        }
      break
      default:
        return type
      break
    }
  }
}
