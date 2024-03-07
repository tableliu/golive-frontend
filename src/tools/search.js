//Axios
import Axios from 'axios'

export default class {
  constructor(option, delayTime, handelFunc) {
    this.option = option
    this.handelFunc = handelFunc
    this.initOption()

		this.delayAjax = this.delay(this.searchAjax, delayTime)
  }
  initOption() {
    // 初始化属性
    this.response = {
      code: null,
      status: null,
      data: null
    }
    this.request = null
    this.count=0
		this.overtime = 0
		this.allowRequest = true
  }

  getData() {
    const _this = this
    const {type, path, body} = this.option
    if (!path || path === '') {
      throw new Error('search class require a api path')
      return
    }
    this.request = new Promise((resolve, reject) => {
      Axios[type](path, body)
      .then(res => {
        _this.response.code = res.data.code
        if (res.data.code === 1) {
          _this.response.status = true
          if (res.data.result) {
            _this.response.data = _this.setResultId(res.data.data)
            _this.data = _this.response.data.result
          }else {
            _this.response.data = res.data.data
            _this.data = _this.response.data
          }
          if (_this.handelFunc) {
            _this.handelFunc(res.data.data)
          }
          resolve(res.data.data)
        }else {
          _this.response.errdata = res.data.errdata
          _this.response.errcode = res.data.errcode
          _this.response.status = false
          if (_this.handelFunc) {
            _this.handelFunc(res.data.data)
          }
          reject('ajax fail')
        }
      })
    })
    return this.request
  }

	searchAjax(that) {
		const _this = that ? that : this
    if (!_this) return
		const request = _this.getData()
    const result = request.then(res => {
			_this.delayAjax()
			return res.result
		})
    const err = request.catch(e => {
      return e
    })
		return result || err
	}
	searchFocus() {
		if (this.count < 1) {
			this.searchAjax(this)
			this.count++
		}
	}
  runDelayAjax() {
		this.delayAjax(this)
  }
	searchChange(searchWord) {
    this.searchWord = searchWord
		if (!searchWord || searchWord === '') {
			this.delayAjax(this)
		}
	}
	delay(func, time=500) {
		const _this = this
		// 如果等待时间为0,则为未加载状态,开始计时间(为5秒时清空)
		let waitTime
		return function(...args) {
      if(waitTime) {
        window.clearTimeout(waitTime)
			}
      waitTime = window.setTimeout(() => {
  			func(...args)
        _this.allowRequest = true
      }, time)

		}
	}
  setWordColor(word) {
    let cuuentWord = (word ? word : "").toString()
    let keyWord = this.searchWord
    if (!keyWord || keyWord === '') {
      return word
    }
    let reg
    try {
      reg = new RegExp(keyWord, 'gi')
    } catch (e) {
      const reserved = ['*', '(', ')', '$', '\\', '^', '?', '.', '+', '[', ']', '{', '}', '|']
      let tempWord = ''
      for (let i = 0; i < keyWord.length; i++) {
        if (reserved.includes(keyWord[i])) {
          tempWord += '\\' + keyWord[i]
        }else {
          tempWord += keyWord[i]
        }
      }
      reg = new RegExp(tempWord, 'gi')
    }
    if (reg.test(cuuentWord)) {
      const match = cuuentWord.match(reg)
      const result = cuuentWord.replace(reg, '<font class="search-key-word">'+ match[0] + '</font>')
      return result
    }
    return word
  }
  getDefaultPagination() {
    return {
      getFullPage: true,
      sortBy: null,
      totalCount: null,
      rowsPerPage: -1,
      perPage: 1,
      page: 1,
      pageFake: 1,
      rowsPerPage_item: [ 15, 30, 50, 100, 1000, { "text": "全部", "value": -1 } ]
    }
  }
  setResultId(dat) {
    // 设置自增id
    let count = 1
    dat.result = dat.result.map(function(item) {
      item.id = item.id ? item.id : count++
      return item
    })
    return dat
  }
}
