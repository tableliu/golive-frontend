<template lang="html">
  <div ref="audio_toast" style="height: 0">
    <embed v-if="browserType === 'IE'" name="embedPlay" :src="src" autostart="true" hidden="true" loop="false"></embed>
    <audio v-else ref="audioPlay" :src="src" muted loop controls style="height: 0"></audio>
  </div>
</template>

<script>
import { getBrowerInfo } from '@/helpers/getBrowerInfo'
export default {
  //---src: 音频文件路径(/static/sound/xxx)
  props: ["src"],
  data: function() {
    return {
      browserType: null
    }
  },
  watch:{
    src() {
      if (this.src && this.src !== "") {
        this.playBmgToast()
      }
    }
  },
  methods: {
    playBmgToast() {
      const _this = this
      const borswer = getBrowerInfo()
      const root = this.$refs["audio_toast"]
      this.browserType = borswer.browserType
      this.$nextTick(() => {
        if ( borswer.browserType === 'IE' ){
          //IE内核浏览器
          var embed = document.embedPlay;
          //浏览器不支持 audion，则使用 embed 播放
          embed.volume = 100;
        } else{
          //非IE内核浏览器

          var audio = _this.$refs["audioPlay"]

          //浏览器支持 audio
          audio.currentTime = 0;//设置播放的音频的起始时间
          audio.volume = 1;//设置音频的声音大小
          audio.muted = false;//关闭静音状态
          audio.play();
        }
      })
    }
  }
}
</script>
