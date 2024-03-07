/**
 * 环信功能类
 */
import webrtc from 'easemob-webrtc'
import axios from 'axios'
import DateHandel from '@/tools/dateHandel'
const emedia = webrtc.emedia
let _this
// 环信配置服务器
const host = {
  REACT_APP_RTC_HOST: 'https://a1.easemob.com',
  REACT_APP_IM_HOST: 'https://a1.easemob.com',
  REACT_APP_WHITE_BOARD_HOST: 'https://wbrtc.easemob.com'
}

export default class {
  /**
   * 构造函数
   * @param  {Object} {appkey: (String) 环信Appkey, videoTag: (dom Object) 绑定环信的video标签, user: (Object) 环信用户对象, onStreamAdded: (Function) 房间内任意用户推流监听事件, onVideoComplete: (Function) 播主加入监听函数 }
   */
  constructor({appkey, videoTag, user, onStreamAdded, onVideoComplete }) {
    _this = this
    const restPrefix = host.REACT_APP_IM_HOST
    // 全局配置
    this.parmars = {
      appkey,
      restPrefix,
      videoTag,
      audioList: []
    }
    this.onStreamAdded = onStreamAdded
    this.onVideoComplete = onVideoComplete
    this.user = user
    this.state = {}
    // 设置环信配置
    emedia.config({
     restPrefix, //配置服务器域名、必填 比如: 'https://a1-hsb.easemob.com'
     appkey //环信Appkey
    })
    this.init()
  }

  init() {
    //开启监听
    this.linsteners()
    // this.register()
  }

  linsteners() {
    // 有人推流的事件
   // member：发布流人员的信息、stream：流信息
    emedia.mgr.onStreamAdded = function(member, stream) {
      if(!stream.located()){  //他人发送的数据流
        _this.subscribe({member, stream})
      }else {
        _this.state.own_stream = stream
      }
    }
  }

  register() {
    const BASE = this.parmars.restPrefix,
     APPKEY = this.parmars.appkey,
     org_name = APPKEY.split('#')[0],
     app_name = APPKEY.split('#')[1],
     register_url = `${BASE}/${org_name}/${app_name}/users`,
     login_url = `${BASE}/${org_name}/${app_name}/token`

    axios.post(register_url, this.user)
    .then(res => {
    })
    .catch(err => {
    })
  }
  // 登录环信
  login() {
    // 如果已登录，则直接返回请求结果
    if (this.loginStatus === 1) {
      return new Promise(resolve => {
        resolve(_this.loginResponse)
      })
    }
    const BASE = this.parmars.restPrefix,
     APPKEY = this.parmars.appkey,
     org_name = APPKEY.split('#')[0],
     app_name = APPKEY.split('#')[1],
     register_url = `${BASE}/${org_name}/${app_name}/users`,
     login_url = `${BASE}/${org_name}/${app_name}/token`

    const memName = _this.parmars.appkey +'_'+ _this.user.username
    const token = _this.user.token
    if (token && token !== '') {
      const loginRequest = new Promise((resolve, reject) => {
        // 环信登录
        emedia.mgr.setIdentity(memName, token)
        resolve()
      })
      return loginRequest
    }

     let params = {
       grant_type: "password",
       username: _this.user.username,
       password: _this.user.password,
       timestamp: new Date().getTime()
     }
     const request = axios.post(login_url, params)
     this.waitForLogin = request
     request.then(res => {
       const token = res.data.access_token
       emedia.mgr.setIdentity(memName, token);
       _this.loginStatus = 1
       _this.loginResponse = res.data
     })
     request.catch(err => {
     })
     return request
  }

  create(nickName) {
    const password = _this.randomString(12)
    // 支持对象形式的参数

    let params = {
         confrType: 10,
         password,
         rec: false,
         recMerge: false,
         supportWechatMiniProgram: true,
         // maxTalkerCount:2,//会议最大主播人数
         // maxVideoCount:1, //会议最大视频数
         // maxPubDesktopCount:1, //会议最大共享桌面数
         // maxAudienceCount：100 //会议最大观众数
    }
    const request = emedia.mgr.createConference(params)
    const room = request.then(res => {
      _this.room = res
      return res
    })
    request.catch(err => {
    })

    return room
  }

  join({confr, password, ext={}, ticket}) {

    // const {confrId, ticket} = this.room
    const pms = new Promise((resolve, reject) => {
      const joinRoom = function(confr, ticket, ext) {
        emedia.mgr.joinConferenceWithTicket(confr, ticket, ext)
        .then(function(res){
          _this.state.mic = true
          resolve(res)
        })
        .catch(function(error){
          reject(error)
        })
      }
      if (!ticket || ticket == '') {
        const getTicket = emedia.mgr.getConferenceTkt(confr, password)
        getTicket.then(res => {
          const myTicket = res.ticket
          joinRoom(confr, myTicket, ext)
        })
        getTicket.catch(err => {
          reject(err)
        })
      }else {
        joinRoom(confr, ticket, ext)
      }
    })
    return pms
  }
  //推送流
  publish({tag, ext={}}) {
    const _this = this
    const constaints = {audio: true, video: false}
    let videoTag
    if (tag) {
      _this.parmars.videoTag_myself = videoTag = tag
    }else {
      videoTag = this.parmars.videoTag
    }
    emedia.mgr.publish(constaints, videoTag, ext)
  }

  //订阅并观看视频
  subscribe({member, stream}) {
    const _this = this
    let audioList = this.parmars.audioList
    const hasMember = audioList.find(item => {
      return item.id === member.id
    })
    const callback = function ({member, stream, tag}) {
      emedia.mgr.subscribe(member, stream, true, true, tag)
    }
    // if (!hasMember && stream.voff > 0) {
    //如果是有视频的(手持设备端),就直接订阅到主video上

    if (stream.voff < 1) {
      const tag = this.parmars.videoTag
      emedia.mgr.subscribe(member, stream, true, true, tag)
      .then(() => {
        _this.state.videoStream = stream
        _this.onVideoComplete({member, stream, tag})
      })
      return
    }
    if (!hasMember) {
      audioList.push({ member, stream })
      this.onStreamAdded({member, stream, audioList, callback})
    }
  }

  //截屏
   captureVideo() {
     const videoStream = this.state.videoStream
     , tag = this.parmars.videoTag
     , filename = this.randomFileName()

     const base64Img2Blob = function(code) {
       var parts = code.split(';base64,');
       var contentType = parts[0].split(':')[1];
       var raw = window.atob(parts[1]);
       var rawLength = raw.length;

       var uInt8Array = new Uint8Array(rawLength);

       for (var i = 0; i < rawLength; ++i) {
           uInt8Array[i] = raw.charCodeAt(i);
       }

       // if(emedia.isSafari){
       //     return new Blob([uInt8Array], {type:"application/octet-stream"});
       // }

       return new Blob([uInt8Array], { type: contentType });
     }

     const getCaptureBase64Context = function(videoObj) {
       var canvas = document.createElement("canvas");
       var id = canvas.id = "__capture_video_" + new Date().getTime();

       canvas.width = videoObj.videoWidth;
       canvas.height = videoObj.videoHeight;

       var canvas2dContext = canvas.getContext('2d');
       canvas2dContext.drawImage(videoObj, 0, 0, canvas.width, canvas.height);

       var base64 = canvas.toDataURL('images/png');
       //console.log(base64);

       return base64;
     }
     return new Promise((resolve, reject) => {
       if (videoStream && tag) {
         // var blob = base64Img2Blob(getCaptureBase64Context(tag))
         var blob = getCaptureBase64Context(tag)
         resolve({blob, filename})
       }else {
         reject("暂无视频信息或手持设备端视频流,无法截图！")
       }
     })

   }

  //切换麦克风状态
  toggleMic() {
    const _this = this
    return new Promise((resolve, reject) => {
      const own_stream = _this.state.own_stream
      if (!own_stream) {
        reject({code: 0, msg: '您还加入视频会议'})
      }

      if (_this.state.mic) {
        emedia.mgr.resumeAudio(own_stream).then(() => {
          _this.state.mic = true
          resolve({code: 1, msg: '麦克风开启成功', mic_open: true})
        })
      }
      else {
        emedia.mgr.pauseAudio(own_stream).then(() => {
            _this.state.mic = false
            resolve({code: 1, msg: '麦克风关闭成功', mic_open: false})
        })
      }
    })
  }

  toggleAudio(status, videoTag) {
    if (status) {
      //仅订阅音频
      emedia.mgr.triggerResumeAudio(videoTag)
      .then(function(){

      })
      .catch(function(error){

      });
    } else {
      //仅暂停订阅音频
      emedia.mgr.triggerPauseAudio(videoTag)
      .then(function(){

      })
      .catch(function(error){

      });
    }


  }

  getConfrInfo(confrId, password) {
    const request = emedia.mgr.selectConfr(confrId, password)
    return request
  }

  exit() {
    emedia.mgr.exitConference();
  }

  //生成随机字符串
  randomString(n) {
    let str = 'abcdefghijklmnopqrstuvwxyz9876543210';
    let tmp = '',
        i = 0,
        l = str.length;
    for (i = 0; i < n; i++) {
      tmp += str.charAt(Math.floor(Math.random() * l));
    }
    return tmp;
  }

  //生成随机字符串
  randomFileName() {
    const today = DateHandel.getToday()
    let str = 'abcdefghijklmnopqrstuvwxyz9876543210';
    let tmp = '',
        i = 0,
        l = str.length;
    for (i = 0; i < 6; i++) {
      tmp += str.charAt(Math.floor(Math.random() * l));
    }
    return today + '_' + tmp
  }
}
