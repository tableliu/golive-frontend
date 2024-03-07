/**
 * 后台文件上传处理类
 */
import ValidFile from '@/tools/validFileSize'
import { store } from '@/store/store'
import CloundFile from '@/tools/CloundFile.js'



export default class UploadFile {
  /**
   * 构造函数
   * @param  {Object} {target: (DOM) file input, bucket: (String) 存储桶名称}
  */
  constructor({target, bucket}) {
    // 初始化
    // input file
    this.tag = target
    // 存储桶名称
    this.bucket = bucket
    // file文件
    this.file = target.files[0]
    if (!this.file) {
      console.error('Class UploadFile require a FileInput');
    }
  }
  /**
   * 默认上传
   * @param  {rules: [Array] 文件后缀名检测数组}
   * @return Promise 上传完成 resolve(cloundFiles) cos文件路径
  */
  defaultUpload(rules=['jpg','jpeg','png','gif','bmp','txt','doc','docx','xls','xlsx','pdf','pptx','ppt']) {
    const _this = this
    return new Promise(function(resolve, reject) {
      const loadLocalFile = _this.saveLocalFile({file: _this.file, rules})
      loadLocalFile.then(localFile => {
        if (localFile) {
          const cosResult = _this.uploadToClound(localFile, _this.bucket)
          cosResult.then(cloundFiles => {
            resolve(cloundFiles)
          })
        }else {
          reject('Class UploadFile --- uploadToClound fial, can not get local file')
        }
      })
    })
  }
  /**
   * 上传到腾讯COS云
   * @param  {fileModel: Object 文件模型, bucket: String 存储桶名称}
   * @return Promise 上传完成 resolve(cloundFiles) cos文件路径
  */
  uploadToClound(fileModel, bucket) {
    return new Promise(function(resolve, reject) {
      if (!fileModel) {
        reject('Class UploadFile --- uploadToClound fial, can not get local file')
      }
      const cf = new CloundFile({url: 'cos/temp-key', type: 'post', files: [fileModel], payload: {type: bucket} })
      cf.upload().then((files) => {
        resolve(files)
      })
    })
  }
  /**
   * 转换为本地文件模型，检测文件规则
   * @param  {file: [Array] file对象数组, rules: [Array] 文件后缀名检测数组}
   * @return Promise 上传完成 resolve(cloundFiles) cos文件路径
  */
  saveLocalFile({file, rules}) {
    let _this = this
    const files = file
    if (!files) {
      store.commit('setRequest', {
        valid: false,
        url: ``,
        type: 'error',
        msg: '文件不存在,请重新上传'
      })
      return
    }
    const sizeCheck = new ValidFile(files)
    if (!sizeCheck.result.valid) {
      store.commit('setRequest', {
        valid: false,
        url: ``,
        type: 'warning',
        msg: sizeCheck.result.text
      })
      _this.tag.value = null
      return
    }
    let typeCheck
    typeCheck = sizeCheck.fileTypeValid(rules)

    if (!typeCheck.result) {
      store.commit('setRequest', {
        valid: false,
        url: ``,
        type: 'warning',
        msg: typeCheck.msg
      })
      _this.tag.value = null
      return
    }
    const fileReader = new FileReader()
    const ReadLocalFile = new Promise((resolve, reject) => {
      try {
        fileReader.onload = function(e) {
          const fileBase = e.target.result
          _this.tag.value = null
          resolve(files)
        }
      } catch (e) {
        reject('save local file fail.')
      }
    })
    fileReader.readAsDataURL(files)
    return ReadLocalFile
  }
}
