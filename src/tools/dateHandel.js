// 日期处理对象（未特地标注的返回值皆为字符串）
export default {
  //获取指定日期前后整个星期的日期数组
  //arguments: 1.date: Number|String
  //return ["2020-01-01", "2020-01-02", ...]
  getAllWeek(date) {
    const now = new Date(date.replace(/-/g, "/"))
    let befor = [], after=[]
    for(let i = 1; i< now.getDay() + 1; i++) {
      if (now.getDay() !== 7) {
        befor.push(new Date(now - i * 24*60*60*1000))
      }
    }
    for(let j = 1; j< (7 - now.getDay()); j++) {
      after.push(new Date(new Date(now).setDate(now.getDate() + j)))
    }
    befor.reverse()
    befor.push(now)
    const week = befor.concat(after)
    const fullWeek = week.map(item => {
      const mouth = Number(item.getMonth())+1
      return item.getFullYear() + "-" + (mouth < 10 ? "0" + mouth : mouth) + "-" + (item.getDate() < 10 ? "0" + item.getDate() : item.getDate())
    })
    return fullWeek
  },
  // 获取今日的日期
  //return 2020-01-01
  getToday() {
    let now
    now = arguments.length > 0 ? new Date(arguments[0]) : new Date()
    const mouth = Number(now.getMonth())+1
    return now.getFullYear() + "-" + (mouth < 10 ? "0" + mouth : mouth) + "-" + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate())
  },
  getTodayFormat() {
    let now
    now = arguments.length > 0 ? new Date(arguments[0]) : new Date()
    let fmt = "yyyy-MM-dd HH:mm:ss"
    var o = {
      "M+": now.getMonth() + 1, //月份
      "d+": now.getDate(), //日
      "H+": now.getHours(), //小时
      "m+": now.getMinutes(), //分
      "s+": now.getSeconds(), //秒
      "q+": Math.floor((now.getMonth() + 3) / 3), //季度
      "S": now.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  // 获取今日的日期范围
  //return 2020-01-01 - 2020-01-01
  getTodaySection() {
    return `${this.getToday()} - ${this.getToday()}`
  },
  // 获取昨天的日期
  //return ----2020-01-01
  getYesterday() {
    const now = new Date(new Date() - 24*60*60*1000)
    const mouth = Number(now.getMonth())+1
    return now.getFullYear() + "-" + (mouth < 10 ? "0" + mouth : mouth) + "-" + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate())
  },
  // 获取昨日的日期范围
  //return ----2020-01-01 - 2020-01-01
  getYesterdaySection() {
    return `${this.getYesterday()} - ${this.getYesterday()}`
  },
  //获取指定日期整个星期的日期数组
  //arguments: 1.date: Number|String
  //return ["2020-01-01", "2020-01-02", ...]
  getToweek(date) {
    const now = date ? this.getToday(date) : this.getToday()
    const allWeek = this.getAllWeek(now)
    return allWeek
  },
  //获取指定日期所在周的周五日期
  //arguments: 1.date: Number|String
  //return 2020-01-01
  getToweekFriday(date) {
    const allWeek = this.getToweek(date)
    return allWeek[5]
  },
  //获取本星期的日期范围
  //return 2020-01-01 --- 2020-01-07
  getToweekText() {
    const toweek = this.getToweek()
    return toweek[0] + ' --- ' + toweek[toweek.length-1]
  },
  //获取本星期的日期范围
  //return 2020-01-01 - 2020-01-07
  getToweekSection() {
    const toweek = this.getToweek()
    return `${toweek[0]} - ${toweek[toweek.length-1]}`
  },
  //获取上个星期的日期数组
  //return ["2020-01-01", "2020-01-02", ...]
  getLastweek() {
    const lastweek = this.getToday(new Date() - 7*24*60*60*1000)
    const allWeek = this.getAllWeek(lastweek)
    return allWeek
  },
  //获取上个星期的周五日期
  //return 2020-01-01
  getLastweekFirday() {
    const allWeek = this.getLastweek()
    return allWeek[5]
  },
  //获取上个星期星期的日期范围
  //return 2020-01-01 --- 2020-01-07
  getLastweekText() {
    const lastweek = this.getLastweek()
    return lastweek[0] + ' --- ' + lastweek[lastweek.length-1]
  },
  //获取上个星期星期的日期范围
  //return 2020-01-01 - 2020-01-07
  getLastweekSection() {
    const lastweek = this.getLastweek()
    return `${lastweek[0]} - ${lastweek[lastweek.length-1]}`
  },
  //获取指定日期的年和月
  //arguments: 1.date: Number|String
  //return 2020-01
  getTomonth(date) {
    const now = date ? new Date(date) : new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    return year + '-' + month
  },
  //获取指定日期当月的最后一天
  //arguments: 1.date: Number|String
  //return 2020-01-31
  getTomonthLastday(e) {
    const fullMonth = e ? this.getTomonth(e) : this.getTomonth()
    let [year, month] = fullMonth.split('-')
    let nextYear = year,nextMonth = parseInt(month) + 1
    if(nextMonth > 12) {
      nextMonth = 1
      nextYear++
    }
    const begin = year + '-' + this.add0ForDate(month) + '-01'
    let end = nextYear + '-' + nextMonth + '-01'
    end = new Date(new Date(end) - 24*60*60*1000)
    return end.getFullYear() + '-' + this.add0ForDate(end.getMonth()+1) + '-' + this.add0ForDate(end.getDate())
  },
  //获取指定日期当月的第一天和最后一天
  //arguments: 1.date: Number|String
  //return 2020-01-01 - 2020-01-31
  getTomonthSection(e) {
    const fullMonth = e ? this.getTomonth(e) : this.getTomonth()
    let [year, month] = fullMonth.split('-')
    let nextYear = year,nextMonth = parseInt(month) + 1
    if(nextMonth > 12) {
      nextMonth = 1
      nextYear++
    }
    const begin = year + '-' + this.add0ForDate(month) + '-01'
    let end = nextYear + '-' + nextMonth + '-01'
    end = new Date(new Date(end) - 24*60*60*1000)
    return {begin: begin, end: end.getFullYear() + '-' + this.add0ForDate(end.getMonth()+1) + '-' + this.add0ForDate(end.getDate())}
  },
  //获取上个月的年和月
  //return 2020-01
  getLastmonth() {
    let lastmonth
    if (new Date().getDate() > 15) {
      lastmonth = new Date(new Date() - 31*24*60*60*1000)
    }else {
      lastmonth = new Date(new Date() - 20*24*60*60*1000)
    }
    const month = lastmonth.getMonth() + 1
    const year = lastmonth.getFullYear()
    return year + '-' + month
  },
  //获取上个月的最后一天
  //arguments: 1.date: Number|String
  //return 2020-01-31
  getLastmonthLastday() {
    const fullMonth = this.getLastmonth()
    let [year, month] = fullMonth.split('-')
    let nextYear = year,nextMonth = parseInt(month) + 1
    if(nextMonth > 12) {
      nextMonth = 1
      nextYear++
    }
    const begin = year + '-' + this.add0ForDate(month) + '-01'
    let end = nextYear + '-' + nextMonth + '-01'
    end = new Date(new Date(end) - 24*60*60*1000)
    return end.getFullYear() + '-' + this.add0ForDate(end.getMonth()+1) + '-' + this.add0ForDate(end.getDate())
  },
  //获取上个月的第一天和最后一天
  //arguments: 1.date: Number|String
  //return 2020-01-01 - 2020-01-31
  getLastmonthSection() {
    const fullMonth = this.getLastmonth()
    let [year, month] = fullMonth.split('-')
    let nextYear = year,nextMonth = parseInt(month) + 1
    if(nextMonth > 12) {
      nextMonth = 1
      nextYear++
    }
    const begin = year + '-' + (month < 10 ? "0" + month : month) + '-01'
    let end = nextYear + '-' + nextMonth + '-01'
    end = new Date(new Date(end) - 24*60*60*1000)
    return {begin: begin, end: end.getFullYear() + '-' + this.add0ForDate(end.getMonth()+1) + '-' + this.add0ForDate(end.getDate())}
  },
  //获取指定日期的前7天数组
  //arguments: 1.date: Number|String
  //return ["2020-01-01", "2020-01-02", ...]
  getBefore7Day(e) {
    const now = e ? new Date(e) : new Date()
    let before = []
    for(let i = 0; i< 7; i++) {
        before.push(new Date(now - i * 24*60*60*1000))
        const mouth = Number(before[i].getMonth())+1
        before[i] = before[i].getFullYear() + "-" + this.add0ForDate(mouth) + "-" + this.add0ForDate(before[i].getDate())
    }
    return before
  },
  getTimeAgo(e) {
    const now = new Date(), target = new Date(e)
    const s=1000, m = s*60, h = m*60, d = h*24, mon=d*30, y=mon*12
    const gap = now - target
    if (gap - s < 0) {
      return '刚刚'
    } else if (gap - s > 0 && gap - m < 0) {
      return parseInt(gap / s) + '秒钟前'
    } else if (gap - m > 0 && gap - h < 0) {
      return parseInt(gap / m) + '分钟前'
    } else if (gap - h > 0 && gap - d < 0) {
      return parseInt(gap / h) + '小时前'
    } else if (gap - d > 0 && gap - mon < 0) {
      return parseInt(gap / d) + '天前'
    } else if (gap - mon > 0 && gap - y < 0) {
      return parseInt(gap / mon) + '月前'
    } else if (gap - y > 0) {
      return parseInt(gap / y) + '年前'
    }
  },
  sort(arr) {
    const _this = this
    arr.map((item, index) => {
      arr[index] = new Date(item).getTime()
    })
    arr.sort()
    arr.map((item, index) => {
      arr[index] = _this.getToday(item)
    })
    return arr
  },
  getTwoTimeSection(min, max) {
    const oneDay = 24*60*60*1000,
    minDate = new Date(min),
    maxDate = new Date(max),
    manyDays = Math.ceil((maxDate - minDate) / oneDay)
    let arr = []
    for (let i = 0; i < manyDays + 1; i++) {
      arr.push(this.getToday(minDate.getTime() + (i * oneDay)))
    }
    return arr
  },
  getDayofweekShowTimes(min, max, dayofweek) {
    // const allDays = this.getTwoTimeSection(min, max)
    // // const firstDay = allDays[0]
    // // const firstDayAllWeek = this.getToweek(firstDay)
    // const dayOfWeek = (new Date(dayofweek)).getDay()
    // allDays.indexOf(dayofweek)
    // if (dayOfWeek > -1) {
    //
    // }
    // for (let i = 0; i < Math.ceil((allDays.length) / 7); i++) {
    //   allDays[i]
    // }
  },
  getTimeEquation(start = new Date(), end) {
    if(!end || end === '') return null
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const equation = Math.abs(new Date(end) - new Date(start))
    const hourResult = this.add0ForDate(parseInt(equation / hour))
    const minuteResult = this.add0ForDate(parseInt((equation % hour) / minute))
    const secondResult = this.add0ForDate(parseInt((equation % minute) / second))
    const result = `${hourResult}:${minuteResult}:${secondResult}`
    return result
  },
  getNumberFormatTime(num) {
    const second = 1
    const minute = second * 60
    const hour = minute * 60
    const equation = Math.abs(parseInt(num))
    const hourResult = this.add0ForDate(parseInt(equation / hour))
    const minuteResult = this.add0ForDate(parseInt((equation % hour) / minute))
    const secondResult = this.add0ForDate(parseInt((equation % minute) / second))
    if (parseInt(hourResult) < 1) {
      return `${minuteResult}:${secondResult}`
    }
    return `${hourResult}:${minuteResult}:${secondResult}`
  },
  getDiffFormatMinute(end, begin) {
    if (!end) {
      return ''
    }
    const now = begin ? new Date(begin) : new Date()
    , target = new Date(end)
    , diff = Math.abs(target - now)
    , second = 1000
    , minute = second * 60

    return Math.ceil(diff / minute)
  },
  getTimeFormatDate(e) {
    if (!e) {
      return '00:00:00'
    }
    //十分钟以内显示为刚刚
    const target = new Date(e), now = new Date(), dayNum = 1000*60*60*24
    if (Math.abs(now - target) > dayNum) {
      return e
    }
    const time = this.getTodayFormat(e).split(' ')
    return time[1]
  },
  add0ForDate(e) {
    return parseInt(e) < 10 ? ("0" + e) : e
  }
}
