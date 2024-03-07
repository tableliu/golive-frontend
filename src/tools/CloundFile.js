/**
 * 腾讯COS云处理类
 */
import Axios from 'axios'
const COS = require('cos-js-sdk-v5')
export default class {
  /**
   * 构造函数
   * @param  {Object} {url: (String) 后台接口的路径, type: (String) ['get' | 'post' | 'put'...] request请求类型, files: (Array) file文件类型的数组， payload: (Object) 后台request的参数}
  */
  constructor({url, type = 'get', files, payload }) {
    // 初始化
    // 上传完成 false
    this.done = false
    // COS实例数组
    this.Author = null
    // 需要上传的文件数组
    this.realFile = files
    // 需要上传的文件后缀名数组
    payload.exts = this.getFilesSuffix(files)
    // 请求后台接口的request
    this.ajax = this.request(url, type, payload)
  }
  // 初始化
  init() {
  }
  // 进度条函数
  progress() {

  }
  /**
   * 请求后台接口的request
   * @param {url: (String) 后台接口的路径, type: (String) ['get' | 'post' | 'put'...] request请求类型, payload: (Object) 后台request的参数}
   * @return Promise 请求完成回调
  */
  request(url, type, payload) {
    if (!url) {
      return false
    }
    let ajax
    if (type === 'post') {
      ajax = Axios.post(url, payload)
    }else {
      let index = 0
      let parmar
      for (let key in payload) {
        if (payload.hasOwnProperty(key)) {
          parmar += ((index < 1 ? '?' : '&') + key + '=' + payload[key])
          index++
        }
      }
      ajax = Axios.get(url + parmar)
    }
    return ajax
  }
  // 换取cos签名
  send() {
    this.getAuthorization('put')
  }
  /**
   * cos签名获取
   * @return Promise 请求完成回调
  */
  getAuthorization() {
    const _this = this
    return new Promise((resolve, reject) => {
      // this.ajax -> 请求后台接口的Promise
      _this.ajax.then(res => {
        if (res.data.code === 1) {
          // 返回值详见接口文档 /rest/cos/temp-key
          // tmp_keys: [Array] cos的签名秘钥数组
          // files: [Array] cos上传的路径以及文件名数组
          const { tmp_keys, files } = res.data.data
          // 如果没有证书返回error
          if (tmp_keys.credentials) {
            let arr = []
            files.forEach(file => {
              /**获取COS实例*/
              const cos = new COS({
                getAuthorization: function (options, callback) {
                  callback({
                    TmpSecretId: tmp_keys.credentials.tmpSecretId,
                    TmpSecretKey: tmp_keys.credentials.tmpSecretKey,
                    XCosSecurityToken: tmp_keys.credentials.sessionToken,
                    ExpiredTime: tmp_keys.expiredTime, // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
                  })
                }
              })
              arr.push({
                ajaxStatus: true,
                cos,
                url: file.url,
                bucket: file.bucket,
                region: file.region,
                path_name: file.path_name
              })
            })
            // COS实例数组
            _this.Author = arr
            resolve()
          }
        }else{
          reject('获取签名失败')
        }
      })
      _this.ajax.catch(err => {
        _this.Author.ajaxStatus = false
        _this.Author.ajaxErrorMsg = '获取签名失败.'
        reject('获取签名失败')
      })
    })
  }
  // 上传到腾讯COS云
  upload() {
    // 待上传的文件数组
    const files = this.realFile
    return new Promise((resolve,reject) => {
      const uploadToClound = function(auth) {
        auth.forEach((item, index) => {
          // 上传文件
          const Bucket = item.bucket,  //'examplebucket-1250000000'
           Region = item.region,  //'ap-chengdu'
           Key = item.path_name   //folder/picture.jpg
          item.realFilePath = files[index]
          // cos上传函数
          item.cos.putObject({
            Bucket,
            Region,
            Key,
            StorageClass: 'STANDARD',
            Body: files[index],
            onProgress: info => {
              _this.progress({
                total: auth.length,
                current: index + 1,
                progress: info
              })
            }
          }, (err, data) => {
            if (err === null) {
              item.uploadDone = data.statusCode
              if(auth.length === index + 1){
                resolve(auth)
              }
            } else {
              reject(err)
            }
          })
        })
      }
      // 获取COS实例
      const ajaxAuth = this.getAuthorization()
      ajaxAuth.then(() => {
        const auth = this.Author
        uploadToClound(auth)
      })
      ajaxAuth.catch((err) => {
        reject(err)
      })
    })
  }
  /**
   * 获取文件数组的后缀
   * @parmars {files: [Array] 待上传的文件数组}
   * @return [Array] 文件后缀名数组
  */
  getFilesSuffix(files) {
    if (!files || files.length < 1) {
      return null
    }
    let arr = []
    files.forEach(file => {
      let suffix = file.name.split('.')
      suffix = suffix[suffix.length - 1]
      arr.push(suffix)
    })
    return arr
  }
}
