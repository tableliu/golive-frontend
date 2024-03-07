<!-- 组件(已弃用) -->
<!-- 聊天室 -->
<template>
  <div id="chat-pop" style="height:100%;">
    <v-dialog  v-model="dialog" max-width="70%">
      <v-card class="v-card-table">
        <v-img
          :src="bigImageSource"
          contain
          class="grey darken-4 white--text cursor-pointer"
          max-height="800"
        ></v-img>
      </v-card>
    </v-dialog>
    <a @click.stop="loadMore" class="load-more">加载历史记录</a>
    <div v-for="(item, index) in items" :class="`room-chat ${item.self ? 'room-chat-self' : 'room-chat-others'}`">
      <div v-if="!item.self" class="room-bubble-avatar">
        <v-avatar size="40" class="v-avatar-fixed">
            <div>
              <img :src="$getImageLocation(item.avatar, 'avatar')">
              <span>{{ item.name }}</span>
            </div>
        </v-avatar>
      </div>
      <div :class="`room-bubble ${item.type === 'image' ? 'room-bubble-image no-background-color' : ''} ${item.self ? 'room-bubble-right' : 'room-bubble-left'} ${item.type === 'file' ? 'file-background-color' : ''}`">
        <v-tooltip top v-if="item.type === 'image'">
            <template slot="activator">
              <img @click="viewBigImg(item.value)" :src="item.value" alt="图片">
            </template>
            <span>查看大图</span>
          </v-tooltip>
        <!-- <img v-if="item.type === 'image'" :src="item.value" alt="图片"> -->
        <div v-else-if="item.type === 'file'" class="room-bubble-file"><v-icon size="30">attach_file</v-icon>附件<a @click="downloadFile" class="load-more-file" href="javascript:void(0)">{{ item.value }}</a></div>
        <span v-else class="room-bubble-content">{{ item.value }}</span>
      </div>
      <div v-if="item.self" class="room-bubble-avatar">
        <v-avatar size="40" class="v-avatar-fixed">
            <div>
              <img :src="$getImageLocation(item.avatar, 'avatar')">
              <span>{{ item.name }}</span>
            </div>
        </v-avatar>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: Array
  },
  data: () => ({
    dialog: false
  }),
  methods: {
    loadMore() {
      this.$emit('loadMore')
    },
    downloadFile() {
      this.$emit('downloadFile')
    },
    viewBigImg(url) {
      this.bigImageSource = url
      this.dialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
  .room-chat {
    display: flex;
    align-items: flex-start;
    margin: 15px 0;
    max-width: 100%;
    min-width: 60%;
  }
  .room-chat-others {
    float: left;
  }
  .room-chat-self {
    float: right;
  }
  .room-bubble {
    display: inline-block;
    position: relative;
    max-width: 60%;
    min-height: 30px;
    background: #fff;
    border-radius: 2px;
    margin-top: -10px;
    min-width: 40%;
    border-radius: 3px;
    text-align: left;
    padding-left: 10px;
  }
  .room-bubble-image {
    background: rgba(0,0,0,0);
  }
  .room-bubble-image img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 3px;
    margin-left: -10px;
  }
  .room-bubble-left {
    margin-right: auto;
  }
  .room-bubble-right {
    background: #9EEA6A;
    margin-left: auto;
  }
  .room-bubble-right:after{
    content: '';
    position: absolute;
    left: 100%;
    top: 5px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent;
    border-left-width: 10px;
    border-left-color: currentColor;
    color: #9EEA6A;
  }
  .room-bubble-left:after{
    content: '';
    position: absolute;
    right: 100%;
    top: 5px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent;
    border-right-width: 10px;
    border-right-color: currentColor;
    color: #fff;
  }
  .room-bubble-content {
    line-height: 30px;
    // margin-left: 10px;
    color: #000 !important;
    font-size: 0.9rem;
    font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  }
  .room-bubble-avatar {
    display: inline-block;
    margin: 0 20px;
  }
  .room-bubble-avatar img {
    width: 40px;
    margin-bottom: -0.5rem;
  }
  .room-bubble-avatar span {
    color: #5C5C5C !important;
    font-size: 11px;
  }
  .v-avatar-fixed img {
    width: 40px;
    height: 40px;
    border: 1px solid #ccc;
  }
  .load-more {
    color: #4b6797 !important;
    text-decoration: underline;
    display:block;
  }
  .load-more-file {
    text-decoration: underline;
    display:block;
  }
  .room-bubble img {
    max-width: 100%;
    margin-left: 0;
  }
  .no-background-color {
    background: none;
  }
  .file-background-color {
    background: #e67e22;
  }
  .file-background-color:after{
    color: #e67e22;

  }
  .room-bubble-file {
    display: flex;
    align-items: center;
    background-color: #e67e22;
  }
  .room-bubble-file a {
    letter-spacing: 2px;
    padding: 5px;
    padding-left: 10px;
  }
</style>
