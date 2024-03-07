// const BaseServe = 'http://192.168.3.43'
// const BaseServe = 'https://www.iipback.qualisafe.com.cn'
const BaseServe = 'https://www.goliveback.qualisafe.com.cn'

// const BaseServe = 'https://www.shback.qualisafe.com.cn/'
// const MapApi = 'http://api.map.baidu.com/api?v=3.0&ak=y6V4zc7U8r6uQOPopEqtxFZByP8FdUbW'
const ak = "y6V4zc7U8r6uQOPopEqtxFZByP8FdUbW";
const MapApi = "https://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";
// const Socket = 'ws://192.168.3.43:8091'
// const Socket = 'wss://www.iipback.qualisafe.com.cn:8090'
const Socket = 'wss://www.goliveback.qualisafe.com.cn:8090'
//环信Appkey
const EmediaAppkey = '1115200729041583#iip'

export default {BaseServe, MapApi, Socket, EmediaAppkey}
