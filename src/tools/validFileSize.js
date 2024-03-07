export default class {
  constructor(file, rule = 90) {
    this.file = file
    this.result = this.valid(rule)
  }
  valid(rule) {
    if (!this.file) {
      return {
        valid: true,
        text: null
      }
    }
    const size = parseInt(this.file.size / 1024 / 1024) + 1
    if (size > rule) {
      return {
        valid: false,
        text: '上传文件不能超过'+ rule +'m,请重新上传'
      }
    }
    return {
      valid: true,
      text: null
    }
  }
  fileTypeValid(typeRule) {
    const arr = this.file.name.split('.'),
          fileType = arr[arr.length - 1]
    let str = ''
    if (typeRule.indexOf(fileType) > -1) {
      return {
        result: true,
        msg: '文件格式正确'
      }
    }else {
      for (let i = 0; i < typeRule.length; i++) {
        if (i < typeRule.length - 1) {
          str = typeRule[i] + ','
        }else {
          str += typeRule[i]
        }
      }
      return {
        result: false,
        msg: '请上传' + str + '格式的文件'
      }
    }
    return false
  }
  getFileSize() {
    if (!this.file) {
      return 0
    }
    const size = this.file.size
    if (size < 1024 ) {
      return '<1kb'
    }else if (size < (1024 * 1024)) {
      return parseInt(size / 1024) + 'kb'
    }else {
      return parseInt(size / (1024 * 1024)) + 'm'
    }
  }
}
