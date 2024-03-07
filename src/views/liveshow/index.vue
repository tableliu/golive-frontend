<!-- /liveshow/index -->
<!-- 现场检查 ->>>>- 远程协作 -->
<template>
<div id="liveshow">
  <!-- <page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader> -->

  <message
  :model = "message"
  :type = "messageType"
  ></message>

<template v-for="item in destroyMessage">
  <message
  :model = "item.message"
  :type = "item.messageType"
  ></message>
</template>

  <image-editor @send="sendCaptureFile" :dialog="captureImageDialog" :path="bigImageSource" :name="bigImageName"></image-editor>

  <v-container fluid grid-list-xl py-0>
    <v-layout row wrap style="margin:0;" class="full-block">

      <!-- 邀请悬浮页面 -->
      <room-invite :dialog="inviteDialog" @onCalled="roomInviteCalled" :room-id="getCurrentRoom ? getCurrentRoom.id : null" :people="invitePeopleEnter.items" @close="inviteDialog=false"></room-invite>


      <app-card  customClasses="custom-app-card" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12 appcard-no-padding" align="center">
        <v-app id="roomInspire" class="room-app-container">
          <Loading v-if="loadingRoomData" opacity="0.9" text="loading"></Loading>
          <div>
            <v-toolbar class="room-app-background" tabs height="50">
              <v-toolbar-title>
                <v-tooltip bottom>
                  <template slot="activator">
                    <v-btn @click.stop="$router.replace('/')" flat icon color="#fff" class="d-inline-flex float-left">
                      <v-icon color="#fff">home</v-icon>
                    </v-btn>
                    <!-- <v-slider max="100" v-show="videoSetting.volume" v-model="videoSetting.voice" class="room-volume"></v-slider> -->
                  </template>
                  <span>{{ $t('message.home') }}</span>
                </v-tooltip>
                <!-- quick links -->
                <!-- <v-tooltip bottom>
        					<template slot="activator">
        						<quick-links></quick-links>
        					</template>
        					<span>{{ $t('message.quickLinks') }}</span>
        				</v-tooltip> -->

              </v-toolbar-title>

              <v-spacer></v-spacer>
              <!-- 房间历史 -->
              <template>
                <v-menu
                  v-model="historyMenu"
                  :close-on-content-click="false"
                  :nudge-width="100"
                  :max-height="getClientHeight"
                  :max-width="200"
                  offset-x
                  left
                  bottom
                  transition="slide-y-transition"
                >
                  <v-badge  bottom slot="activator" overlap>
                    <template v-slot:badge>
                      <span>{{ roomHistory.length }}</span>
                    </template>
                    <v-tooltip bottom>
                      <template slot="activator">
                        <v-avatar @click="loadRoomHistory" size="36" color="#fff">
                          <v-btn icon large>
                            <v-icon color="primary red--after">history</v-icon>
                          </v-btn>
                        </v-avatar>
                      </template>
                      <span>{{ $t('message.history') }}</span>
                    </v-tooltip>
                  </v-badge>
                  <v-card light :max-height="getClientHeight">
                    <v-card-text class="pa-6" style="background:#fff !important;">
                      <template v-if="roomHistory && roomHistory.length > 0">
                        <v-card v-for="item in roomHistory" :key="item.id" >
                          <div @click.stop="enterHistoryRoom(item.id)" class="room-history-block cursor-pointer">
                            <!-- <video-player class="video-player vjs-custom-skin" :ref="'videoPlayer_history_' + item.id" :playsinline="true" :options="item.playerOptions"></video-player> -->
                            <v-img src="/static/img/tvroom.png" contain  height="80" color="black"></v-img>
                          </div>
                          <div style="text-align:center;font-size:0.7rem;">{{ item.name }}</div>
                          <v-divider></v-divider>
                        </v-card>
                      </template>
                      <template v-else>
                        <span style="width:200px;text-align:center;font-size:0.7rem;color:#000;">{{ $t("message['NoMoreHistory']") }}</span>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </template>

              <v-tooltip bottom v-if="roomList.length > 1">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="switchMode = !switchMode" icon large>
                    <v-icon color="#fff">view_module</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('message.switchMode') }}</span>
              </v-tooltip>

              <!-- <v-tooltip bottom v-if="roomList.length > 1">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon large @click.stop="chatSwitch=!chatSwitch">
                    <v-icon color="#fff">{{ chatSwitch ? 'chat_bubble_outline' : 'forum' }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ chatSwitch ? '关闭' : '打开' }}聊天窗口</span>
              </v-tooltip> -->

              <invite-pop :max-height="getClientHeight" :dialog="dialog" :people="calledOnlinePeople" @onPeopleCallFinish="calledOnlinePeople = null" @onCalled="inviteOnCalled" @close="dialog=false"></invite-pop>


              <template v-slot:extension>
                <v-tabs v-show="!switchMode" v-model="tabs" centered color="transparent" slider-color="white">
                  <v-tab v-for="(room, index) in roomList" :key="room.id" :href="'#tab-' + room.id" :class="tabs === 'tab-' + (room.id) ? 'room-tab-avtive' : ''">
                    <span class="room-tab-font">{{ room.name }}</span>
                  </v-tab>
                </v-tabs>
              </template>
            </v-toolbar>
            <!-- 切换模式为多排多个单元格显示 -->
            <template>
              <div v-show="switchMode" class="fade-in">
                <v-container fluid grid-list-xl py-0>
                  <v-layout row wrap>
                    <v-flex xs12 sm12 v-for="room in roomList" :key="room.id" class="room-layout-card" :class="'md' + (roomList.length < 3 ? '6' : '4')">
                      <v-card>
                        <div style="min-height:300px">
                          <video-player class="video-player vjs-custom-skin" :ref="'videoPlayer_layout_' + room.id" :playsinline="true" :options="room.playerOptions"></video-player>
                        </div>

                        <v-card-actions>
                          <h3 class="headline mb-0">{{ room.name }}</h3>
                          <v-spacer></v-spacer>
                          <v-btn @click="quit(room)" color="#4A7BAF" class="d-inline-flex float-right">
                            <v-icon color="#fff">exit_to_app</v-icon>
                            <span class="login-font-white">{{ $t("message.quit") }}</span>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </div>
            </template>
            <!-- <Home v-if="!roomList || roomList.length < 1" loading></Home> -->
            <v-tabs-items v-show="!switchMode" v-model="tabs" centered>
              <v-tab-item v-for="room in roomList" :key="room.id" :value="'tab-' + room.id" lazy>
                <v-card>
                  <v-container fluid grid-list-xl py-0 class="show-card-background">
                    <v-layout row wrap style="margin: 0;">
                      <v-flex xs12 sm12 :class="'md' + (room.chatSwitch ? getVideoFlex : '12')">
                        <!-- 播放器 -->
                        <div class="room-block room-block-show" :style="{height: chatSwitchHeight + 'px'}">
                          <!-- <video autoPlay ref="videoPlayer_alias_1"></video> -->
                          <video-player v-show="room.videoComplete" class="video-player vjs-custom-skin vjs-full-height" :ref="'videoPlayer_' + room.id" :playsinline="true" :options=" videoSetting.playerOptions"></video-player>
                          <!-- 框选组件 -->
                          <Draw
                            v-show="room.videoComplete && room.draw"
                            :clear-all="room.drawClearAll"
                            :customStyle="getDrawStyles"
                            :menus="drawMenus"
                            @clear="room.drawClearAll=false"
                            @drawCompelete="sendDrawToBackend"
                          ></Draw>
                          <template v-show="!room.videoComplete">
                            <div v-if="room.videoErrMsg" style="height:30px;width:30%;background:#f39c12;border-radius:5px;">
                              <span style="color:#fff;font-size: 1rem;line-height: 30px;">{{ room.videoErrMsg }}</span>
                            </div>
                            <Circle8 ></Circle8>
                          </template>

                          <div class="liveshow-audio-list">
                            <video src="" autoplay v-for="audio in room.audioList" :ref="'audio_' + audio.member.id"></video>
                          </div>
                          <video src="" autoplay :ref="'audio_myself_' + room.id"></video>
                        </div>
                        <div style="margin-bottom: 20px;">
                          <v-tooltip top>
                            <template slot="activator">
                              <v-btn @click.stop="videoFullscreen(room.id)" flat icon color="#ccc" class="d-inline-flex float-left liveshow-video-actions">
                                <v-icon color="#000">fullscreen</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t('message.fullScreen') }}</span>
                          </v-tooltip>

                          <v-tooltip top>
                            <template slot="activator">
                              <v-btn @click.native="micVolume(room)" flat icon color="#ccc" class="d-inline-flex float-left liveshow-video-actions">
                                <v-icon color="#000">{{videoSetting.mic ? 'mic' : 'mic_off'}}</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t('message.mic') }}</span>
                          </v-tooltip>

                          <v-tooltip top>
                            <template slot="activator">
                              <v-btn @click.stop="videoVolume(room)" flat icon color="#ccc" class="d-inline-flex float-left liveshow-video-actions">
                                <v-icon color="#000">{{ videoSetting.volume ? 'volume_up' : 'volume_off' }}</v-icon>
                              </v-btn>
                              <!-- <v-slider max="100" v-show="videoSetting.volume" v-model="videoSetting.voice" class="room-volume"></v-slider> -->
                            </template>
                            <span>{{ $t('message.volume') }}</span>
                          </v-tooltip>

                          <v-tooltip top>
                            <template slot="activator">
                              <v-btn @click.stop="screenshot(room)" flat icon color="#ccc" class="d-inline-flex float-left liveshow-video-actions">
                                <v-icon color="#000">camera_alt</v-icon>
                              </v-btn>
                              <!-- <v-slider max="100" v-show="videoSetting.volume" v-model="videoSetting.voice" class="room-volume"></v-slider> -->
                            </template>
                            <span>{{ $t('message.screenshot') }}</span>
                          </v-tooltip>

                          <div>
                            <v-tooltip top>
                              <template slot="activator">
                                <v-btn :disabled="!room.videoComplete" @click.stop="openDraw(room)" flat icon color="#ccc" class="d-inline-flex float-left liveshow-video-actions" style="margin-right:0;">
                                  <v-icon :color="room.draw && room.videoComplete ? '#e74c3c' : '#000'">{{ room.draw && room.videoComplete ? 'highlight_off' : 'select_all' }}</v-icon>
                                </v-btn>
                                <!-- <v-slider max="100" v-show="videoSetting.volume" v-model="videoSetting.voice" class="room-volume"></v-slider> -->
                              </template>
                              <span>{{ (room.draw ? $t("message['close']") : $t("message['open']")) + $t("message['FrameSelection']") }}</span>
                            </v-tooltip>
                            <div style="float:left;width: 1px;height: 25px; background: #000;margin-top: 1.3rem;"></div>
                            <v-tooltip top>
                              <template slot="activator">
                                <v-btn :disabled="!room.draw" @click.stop="drawClearAllHandel(room)" flat icon color="#ccc" class="d-inline-flex float-left liveshow-video-actions" style="margin-left:0;">
                                  <v-icon size="20" color="#000">not_interested</v-icon>
                                </v-btn>
                                <!-- <v-slider max="100" v-show="videoSetting.volume" v-model="videoSetting.voice" class="room-volume"></v-slider> -->
                              </template>
                              <span>清空框选</span>
                            </v-tooltip>
                          </div>

                          <v-menu lazy v-if="room.news.length > 0 && showNews" light top offset-y transition="slide-y-transition" class="d-inline-flex liveshow-video-actions">
                            <span slot="activator" class="v-btn">{{ $t("message['messages']") + '：' + room.news[room.news.length - 1].text }}</span>
                            <v-card light class="room-people-list">
                              <v-card-text class="pa-6">
                                <v-list dense subheader expand>
                                  <v-subheader>{{$t("message['messages']")}} ({{ room.news.length }})</v-subheader>
                                  <template v-for="(item, index) in room.news">
                                    <v-list-tile :key="item.id" avatar @click="">
                                      <v-list-tile-content>
                                        <v-list-tile-title v-html="item.text"></v-list-tile-title>
                                        <!-- <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title> -->
                                      </v-list-tile-content>
                                    </v-list-tile>
                                    <v-divider v-if="index !== room.news.length-1"></v-divider>
                                  </template>
                                </v-list>
                              </v-card-text>
                            </v-card>
                          </v-menu>

                          <v-btn @click="quit(room)" color="#4A7BAF" class="d-inline-flex float-right liveshow-video-actions-margin">
                            <v-icon color="#fff">exit_to_app</v-icon>
                            <span class="login-font-white">{{ $t("message.quit") }}</span>
                          </v-btn>
                          <v-btn @click="inviteDialog = true" color="#4A7BAF" class="d-inline-flex float-right liveshow-video-actions-margin">
                            <v-icon color="#fff">supervised_user_circle</v-icon>
                            <span class="login-font-white">{{ $t("message.invite") }}</span>
                          </v-btn>
                          <!-- <v-btn @click="quit(room)" class="d-inline-flex float-right" color="error">退出</v-btn> -->
                          <!-- <v-btn @click="inviteDialog = true" class="d-inline-flex float-right" color="warning">邀请</v-btn> -->
                          <v-menu left light top offset-x transition="slide-y-transition" class="d-inline-flex float-right" style="margin-top:15px;">
                            <v-badge slot="activator" overlap class="room-badge-margintop">
                              <template v-slot:badge>
                                <span>{{ room.people.length }}</span>
                              </template>
                              <v-tooltip top>
                                <template slot="activator">
                                  <v-avatar size="36" color="primary red--after">
                                    <v-btn flat icon color="#fff" class="d-inline-flex float-right">
                                      <v-icon color="#fff">people</v-icon>
                                    </v-btn>
                                  </v-avatar>
                                </template>
                                <span>{{ $t('message.people') }}</span>
                              </v-tooltip>
                            </v-badge>
                            <v-card light class="room-people-list">
                              <v-card-text class="pa-6">
                                <v-list dense subheader expand>
                                  <v-subheader>{{ $t("message['people']") }}({{ room.people.length }})</v-subheader>
                                  <template v-for="(item, index) in room.people">
                                    <v-list-tile :key="item.id" avatar @click="">
                                      <v-list-tile-avatar>
                                        <img :src="$getImageLocation(item.avatar, 'avatar')">
                                      </v-list-tile-avatar>

                                      <v-list-tile-content>
                                        <v-list-tile-title v-html="item.user_name + (item.full_name && ` (${item.full_name}) `)"></v-list-tile-title>
                                        <!-- <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title> -->
                                      </v-list-tile-content>
                                    </v-list-tile>
                                    <v-divider v-if="index !== room.people.length-1"></v-divider>
                                  </template>
                                </v-list>
                              </v-card-text>
                            </v-card>
                          </v-menu>

                          <!-- <v-tooltip top>
	                    					<template slot="activator">
	                                <v-btn flat icon color="pink" class="d-inline-flex float-right">
	                                  <v-icon color="#ccc">people</v-icon>
	                                </v-btn>
	                    					</template>
	                    					<span>{{ $t('message.people') }}</span>
	                    				</v-tooltip> -->
                        </div>
                      </v-flex>
                      <v-tooltip md1 left class="chat-area-hide">
                        <v-btn :color="room.chatSwitch ? '#ccc' : '#fff'" slot="activator" icon @click.stop="room.chatSwitch=!room.chatSwitch">
                          <v-icon :color="room.chatSwitch ? '#fff' : '#000'">{{ room.chatSwitch ? 'keyboard_arrow_right' : 'keyboard_arrow_left' }}</v-icon>
                        </v-btn>
                        <span>{{ room.chatSwitch ? $t("message['close']") : $t("message['open']") }} {{ $t("message['chat']") }}</span>
                      </v-tooltip>
                      <!-- 聊天室 -->
                      <v-flex xs12 sm12 v-if="room.chatSwitch" :class="'md' + getChatFlex" style="padding: 0 12px 0 0 !important;">
                        <div :id="room.id" ref="chatList" class="room-block room-block-chat" :style="{height: chatSwitchHeight + 'px'}">
                          <!-- <chat-pop :items="room.chat.list" @loadMore="loadMore(room)" @downloadFile="downloadFile(room)"></chat-pop> -->
                          <Chat-Area :items="room.chat.list" :loadingHistory="room.chat.loading" :noMoreHistory="room.chat.noMoreHistory" @loadMore="loadMore(room)" ></Chat-Area>
                        </div>
                        <div>
                          <div class="d-inline-block send-message-block send-more-options">
                            <v-text-field height="20" max-height="20" :label="$t('message.TypeIn')" clearable persistent-hint hide-details outline light v-model="room.chat.input" @keyup.enter="sendMessage(room)" @click:append-outer="sendMessage(room)">
                              <template v-slot:append>
                                <v-menu top offset-y>
                                  <template v-slot:activator="{ on }">
                                    <v-tooltip top>
                                      <template slot="activator">
                                        <v-btn icon @click="sendMessage(room)" class="send-more-options-btn">
                                          <v-icon dark>reply</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>{{ $t('message.send') }}</span>
                                    </v-tooltip>

                                    <v-btn icon v-on="on" class="send-more-options-btn">
                                      <v-icon>add</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <input :id="'uploadImage-' + room.id" :ref="'uploadImage-' + room.id" style="display:none;" type="file" accept=".jpg,.jpeg,.png,.gif,.bmp" @change.prevent="sendImage(room)" name="" value="">
                                    <input :id="'uploadFile-' + room.id" :ref="'uploadFile-' + room.id" style="display:none;" type="file" accept=".txt,.doc,.docx,.xls,.xlsx,.pdf,.pptx,.ppt" @change.prevent="sendFile(room)" name="" value="">
                                    <v-card-text class="pa-6">
                                      <v-tooltip top>
                                        <template slot="activator">
                                            <label class="v-btn icon" :for="'uploadImage-' + room.id">
                                              <v-icon dark>image</v-icon>
                                            </label>
                                        </template>
                                        <span>{{ $t('message.images') }}</span>
                                      </v-tooltip>
                                      <v-tooltip top>
                                        <template slot="activator">
                                          <label class="v-btn icon" :for="'uploadFile-' + room.id">
                                            <v-icon dark>folder_open</v-icon>
                                          </label>
                                        </template>
                                        <span>{{ $t('message.file') }}</span>
                                      </v-tooltip>
                                    </v-card-text>
                                  </v-card>
                                </v-menu>
                              </template>
                            </v-text-field>
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-app>
      </app-card>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Search from '@/components/SearchInput'
import ChatPop from './chatPops.vue'
import ChatArea from './ChatArea.vue'
import InvitePop from './invitePop.vue'
import RoomInvite from './roomInvite.vue'
import Home from "./home/home.vue"
import Draw from "./draw/index.vue"
import QuickLinks from "@/components/Header/QuickLinks";
import Loading from "@/components/Loading/Loading"
import User from '@/auth/user'
import ValidFile from '@/tools/validFileSize'
import {
  videoPlayer
} from 'vue-video-player'
import 'videojs-contrib-hls'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import CloundFile from '@/tools/CloundFile.js'
import Emedia from '@/tools/emedia'
import { getBrowerInfo } from '@/helpers/getBrowerInfo'
import ImageEditor from '@/plugins/ImageEditor/install'


let _this
export default {
  components: {
    Search,
    videoPlayer,
    ChatPop,
    ChatArea,
    InvitePop,
    Home,
    RoomInvite,
    QuickLinks,
    Loading,
    ImageEditor,
    Draw
  },
  data() {
    const options = {
      //playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
      autoplay: false, //如果true,浏览器准备好时开始回放。
      muted: false, // 默认情况下将会消除任何音频。
      loop: false, // 导致视频一结束就重新开始。
      preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
      language: 'zh-CN',
      aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      // sources: [{
      //     type: "application/x-mpegURL",
      //     src: "" //你的m3u8地址（必填）
      // }],
      sources: [{
        type: "application/x-mpegURL",
        src: "" //你的m3u8地址（必填）
      }],
      poster: "poster.jpg", //你的封面地址
      width: 300,
      notSupportedMessage: '无法连接到视频服务器，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      //  controlBar: {
      //   timeDivider: true,
      //   durationDisplay: true,
      //   remainingTimeDisplay: false,
      //   fullscreenToggle: true //全屏按钮
      //  }
    }

    const historyOptions = {
      //playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
      autoplay: false, //如果true,浏览器准备好时开始回放。
      muted: false, // 默认情况下将会消除任何音频。
      loop: false, // 导致视频一结束就重新开始。
      preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
      language: 'zh-CN',
      aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      // sources: [{
      //     type: "application/x-mpegURL",
      //     src: "" //你的m3u8地址（必填）
      // }],
      sources: [{
        type: "application/x-mpegURL",
        src: "" //你的m3u8地址（必填）
      }],
      poster: "poster.jpg", //你的封面地址
      width: 150,
      notSupportedMessage: '无法连接到视频服务器，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      //  controlBar: {
      //   timeDivider: true,
      //   durationDisplay: true,
      //   remainingTimeDisplay: false,
      //   fullscreenToggle: true //全屏按钮
      //  }
    }

    const srcs = {
      1: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      2: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      3: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
      4: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
      5: 'https://cdn.vuetifyjs.com/images/lists/5.jpg'
    }
    return {
      $user: null,
      switchMode: false,
      showNews: false,
      historyMenu: false,
			message: {
				show: false,
				type: '',
				title: '',
				msg: ''
			},
			messageType: {model: 'confim', func: this.checked},
      destroyMessage: [],
      dialog: false,
      captureImageDialog: false,
      bigImageSource: null,
      bigImageName: null,
      loadingRoomData: false,
      inviteDialog: false,
      invitePeopleEnter: {
        dialog: false,
        items: []
      },
      defaultInvitePeopleEnter: {
        dialog: false,
        items: []
      },
      calledOnlinePeople: null,
      playerOptions: [],
      liveSource: ['http://116.77.70.98:5080/livestream/g9bfmwth.flv', 'http://116.77.70.98:5080/livestream/wn5fsvdn.flv', 'http://116.77.70.98:5080/livestream/etv27dex.flv'],
      inviteItems: [],
      roomList: [
        // {
        //   id: 4, //房间ID
        //   created: {
        //     id: 123,
        //     name: '李四',
        //     avatar: 'https://xxxx'
        //   }, //创建者ID(创建房间必须要有1个创建者和1个直播人),
        //   player: {
        //     id: 444,
        //     name: '张三',
        //     avatar: 'https://xxxx',
        //     playDate: '2019-12-27 08:20'
        //   }, //直播人信息,
        //   name: '李四的直播间',
        //   people: [{
        //       id: 134,
        //       name: '张三',
        //       avatar: srcs[1]
        //     }
        //   ], //房间人员ID
        //   url: '', //直播流地址
        //   create_at: '2019-12-27', //创建时间
        //   chat: {
        //     input: null,
        //     list: [
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: false,
        //         type: 'text',
        //         value: '你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，小帅哥0.0'
        //       },
        //       {
        //         name: '李四',
        //         avatar: srcs[2],
        //         self: true,
        //         type: 'text',
        //         value: '你好啊，小帅哥ddd',
        //         sendError: true
        //       },
        //       {
        //         name: '王五',
        //         avatar: srcs[3],
        //         self: false,
        //         type: 'image',
        //         value: srcs[3]
        //       },
        //       {
        //         name: '李四',
        //         avatar: srcs[2],
        //         self: true,
        //         type: 'text',
        //         value: '哇，好漂亮的小妹妹！'
        //       },
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: false,
        //         type: 'text',
        //         value: '你那是喜欢吗？你那是馋她身子，你下贱！'
        //       },
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: false,
        //         type: 'image',
        //         value: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg'
        //       },
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: false,
        //         type: 'file',
        //         value: 'ssgggg.png'
        //       },
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: true,
        //         type: 'file',
        //         value: 'readme.doc'
        //       }
        //     ]
        //   }, //聊天记录
        //   news: [
        //     {
        //       id: 1,
        //       text: '张三离开了房间'
        //     },
        //     {
        //       id: 1,
        //       text: '李四加入了房间'
        //     }
        //    ], //房间消息
        //
        //   playerOptions: {
        //     //playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        //     autoplay: false, //如果true,浏览器准备好时开始回放。
        //     muted: false, // 默认情况下将会消除任何音频。
        //     loop: false, // 导致视频一结束就重新开始。
        //     preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        //     language: 'zh-CN',
        //     aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        //     fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        //     // sources: [{
        //     //     type: "application/x-mpegURL",
        //     //     src: "http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8" //你的m3u8地址（必填）
        //     // }],
        //     sources: [{
        //       type: "application/x-mpegURL",
        //       src: "" //你的m3u8地址（必填）
        //     }],
        //     poster: "poster.jpg", //你的封面地址
        //     width: 300,
        //     notSupportedMessage: '无法连接到视频服务器，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //     //  controlBar: {
        //     //   timeDivider: true,
        //     //   durationDisplay: true,
        //     //   remainingTimeDisplay: false,
        //     //   fullscreenToggle: true //全屏按钮
        //     //  }
        //   }
        // },
        // {
        //   id: 2, //房间ID
        //   created: {
        //     id: 123,
        //     name: '李四',
        //     avatar: 'https://xxxx'
        //   }, //创建者ID(创建房间必须要有1个创建者和1个直播人),
        //   player: {
        //     id: 444,
        //     name: '张三',
        //     avatar: 'https://xxxx',
        //     playDate: '2019-12-27 08:20'
        //   }, //直播人信息,
        //   name: '馬六的直播间',
        //   people: [{
        //       id: 134,
        //       name: '张三',
        //       avatar: srcs[1]
        //     }
        //   ], //房间人员ID
        //   url: '', //直播流地址
        //   create_at: '2019-12-27', //创建时间
        //   chat: {
        //     input: null,
        //     list: [
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: false,
        //         type: 'text',
        //         value: '你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，你好啊，小帅哥0.0'
        //       },
        //       {
        //         name: '李四',
        //         avatar: srcs[2],
        //         self: true,
        //         type: 'text',
        //         value: '你好啊，小帅哥ddd',
        //         sendError: true
        //       },
        //       {
        //         name: '王五',
        //         avatar: srcs[3],
        //         self: false,
        //         type: 'image',
        //         value: srcs[3]
        //       },
        //       {
        //         name: '李四',
        //         avatar: srcs[2],
        //         self: true,
        //         type: 'text',
        //         value: '哇，好漂亮的小妹妹！'
        //       },
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: false,
        //         type: 'text',
        //         value: '你那是喜欢吗？你那是馋她身子，你下贱！'
        //       },
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: false,
        //         type: 'image',
        //         value: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg'
        //       },
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: false,
        //         type: 'file',
        //         value: 'ssgggg.png'
        //       },
        //       {
        //         name: '张三',
        //         avatar: srcs[1],
        //         self: true,
        //         type: 'file',
        //         value: 'readme.doc'
        //       }
        //     ]
        //   }, //聊天记录
        //   news: [
        //     {
        //       id: 1,
        //       text: '张三离开了房间'
        //     },
        //     {
        //       id: 1,
        //       text: '李四加入了房间'
        //     }
        //    ], //房间消息
        //
        //   playerOptions: {
        //     //playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        //     autoplay: false, //如果true,浏览器准备好时开始回放。
        //     muted: false, // 默认情况下将会消除任何音频。
        //     loop: false, // 导致视频一结束就重新开始。
        //     preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        //     language: 'zh-CN',
        //     aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        //     fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        //     // sources: [{
        //     //     type: "application/x-mpegURL",
        //     //     src: "http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8" //你的m3u8地址（必填）
        //     // }],
        //     sources: [{
        //       type: "application/x-mpegURL",
        //       src: "" //你的m3u8地址（必填）
        //     }],
        //     poster: "poster.jpg", //你的封面地址
        //     width: 300,
        //     notSupportedMessage: '无法连接到视频服务器，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //     //  controlBar: {
        //     //   timeDivider: true,
        //     //   durationDisplay: true,
        //     //   remainingTimeDisplay: false,
        //     //   fullscreenToggle: true //全屏按钮
        //     //  }
        //   }
        // }
      ],
      chatInput: null,
      chatModel: {
        name: '李四',
        avatar: srcs[2],
        self: true,
        type: 'text',
        value: null
      },
      roomHistory: [
        // {
        //   id: 1,
        //   name: '张三',
        //   playerOptions: historyOptions
        // }
      ],
      tabs: null,
      inviteLoading: false,
      edited: {
        editedIndex: -1,
        editedItem: {
          MDP: [],
          invite: []
        },
        defaultItem: {
          MDP: [],
          invite: []
        }
      },
      message: {
        show: false,
        type: '',
        title: '',
        msg: ''
      },
      videoSetting: {
        show: true,
        voice: 0,
        volume: true,
        mic: true,
        playerOptions: {
          //playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: true, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          // sources: [{
          //     type: "application/x-mpegURL",
          //     src: "" //你的m3u8地址（必填）
          // }],
          sources: [{
            type: "application/x-mpegURL",
            src: "https://easemob.com" //你的m3u8地址（必填）
          }],
          poster: "poster.jpg", //你的封面地址
          width: this.getClientWidth,
          notSupportedMessage: '无法连接到视频服务器，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          //  controlBar: {
          //   timeDivider: true,
          //   durationDisplay: true,
          //   remainingTimeDisplay: false,
          //   fullscreenToggle: true //全屏按钮
          //  }
        }
      },
      locale: {
        x: null,
        y: null
      },
      points: [],
      drawMenus: []
    }
  },
  beforeMount() {
    //do something before creating vue instanceif (this.roomList.length < 1) {

  },
  mounted() {
    _this = this
    // this.joinLiveRoom(this.roomList[0])
    // 获取当前用户信息
    this.getUserInfo()
    // 页面数据初始化
    this.init()
    // 被呼叫进入房间初始化
    this.beCalled()
    // 聊天内容拉置底部最后一条
    // this.scrollToBottom()
    this.initDarwMenus()
  },
  beforeDestroy() {
    //打开音视频授权窗口
    this.roomList.forEach((item, i) => {
      item.Emedia.exit()
    });

  },
  computed: {
    ...mapGetters(["activeHeaderFilter", "getSocketCode", "getRole", 'getLiveShowCreateRoomList', "selectedLocale"]),
    getClientHeight() {
      return document.documentElement.clientHeight - 135
    },
    getClientWidth() {
      return document.documentElement.clientWidth
    },
    // 获取直播容器的宽度
    getVideoFlex() {
      const dw = this.getClientWidth
      , dh = this.getClientHeight
      , videoWidth = dh * 1.78

      const aaa = ((videoWidth / dw) * 12).toFixed()
      return aaa
    },
    // 获取聊天容器的宽度
    getChatFlex() {
      return 12 - (parseInt(this.getVideoFlex))
    },
    formTitle() {
      return '添加人员并创建房间'
    },
    // 获取直播容器的高度
    chatSwitchHeight() {
      // return this.getClientHeight
      const room = this.getCurrentRoom
      return room.chatSwitch ? this.getClientHeight : this.getClientHeight * 1.34
    },
    // 获取当前所在的房间对象
    getCurrentRoom() {
      if (this.tabs) {
        const id = parseInt(this.tabs.split('-')[1])
        const room = this.roomList.find(item => {
          return item.id === id
        })
        return room
      }
      return null
    },
    getDrawStyles() {
      const _this = this
      let style
      // _this.$nextTick(() => {
      //   const room = _this.getCurrentRoom
      //   , videoDoom = _this.$refs['videoPlayer_' + room.id]
      //   , videwidth = videoDoom.offsetWidth
      //   style = {
      //     width: videwidth,
      //     height: _this.chatSwitchHeight
      //   }
      // })
      style = {
        height: _this.chatSwitchHeight + 'px'
      }
      return style
    }
  },
  watch: {
    getLiveShowCreateRoomList() {
      this.beCalled()
    },
    roomList() {
      if (this.roomList.length < 1) {
        this.$router.replace({
  	      path: '/home' // 将跳转的路由path作为参数，登录成功后跳转到该路由
  	    })
      }
    }
  },
  methods: {
    // 加载页面数据,房间数据
    init() {
      // 加载历史记录
      this.loadRoomHistory()
      //打开音视频授权窗口
      this.initUserMedia(true)
      //开启监听
      this.listener()
    },
    // 监听函数
    listener() {
      // 启动人员离开或进入监听
      this.onUserEnterLeave()
      // 启动人员接受/拒绝邀请监听
      this.onUserAnswaer()
      // 启动消息接收监听
      this.onMessage()
      // 启动房间被销毁监听
      this.onRoomDestroy()
    },
    // 获取用户信息
    getUserInfo() {
			const auth = new User()
			const user = auth.getUser()
			this.$user = user
    },
    // 聊天窗口发送消息
    sendMessage(obj) {
      const _this = this
      let model = Object.assign({}, this.chatModel)
      // 输入的消息
      const message = model.value = obj.chat.input
      if (!message) {
        return
      }
      model = {
        id: null,
        name: _this.$user.name,
        avatar: _this.$user.aevterUrl,
        self: true,
        type: 'text',
        created_at: (() => new Date())(),
        value: message
      }
      // 将消息放入房间聊天列表
      obj.chat.list.push(model)
      // 清空输入框
      obj.chat.input = null
      // 将聊天容器的滚动条拉到最底部
      this.scrollToBottom(obj.id)

      // socket push成功回调函数
      const callback = function(res) {
        if (res.result.code === 1) {
          // 将id和创建时间赋给刚刚发出的聊天内容对象
          model.id = res.result.data.id
          model.created_at = res.result.data.created_at
        }
      }
      /*
      socket push数据到后台
        props:{
          room_id: Number - 房间ID,
          type: 'text' | 'image' | 'file',
          value: 'text' - String | 'image' - COS的预览url | 'file' - COS的预览url,
          file_name: value为file时为文件的原始名称，否则为null,
          callback: Fcuntion - 发送成功的回调
        }
      */
      this.$store.dispatch('publishActions', {
        name: 'liveshow',
        publishName: 'rpc/live/send-msg',
        data: {
          room_id: obj.id,
          type: 'text',
          value: message,
          file_name: null
        },
        callback
      })
    },
    // 将聊天容器的滚动条拉到最底部
    scrollToBottom(tabid) {
      const _this = this
      //页面下次渲染完成后执行
      this.$nextTick(() => {
        //获取当前聊天容器
        const domList = _this.$refs.chatList
        let dom
        if (tabid) {
          // dom = domList.find(item => {
          //   parseInt(item.id) === tabid
          // })
          for (var i = 0; i < domList.length; i++) {
            if (parseInt(domList[i].id) === parseInt(tabid)) {
              dom = domList[i]
              break
            }
          }
        } else {
          dom = domList[0]
        }
        //将当前聊天容器的滚动条距离设为滚动条高度
        dom.scrollTop = dom.scrollHeight
      })
    },
    /*
    视频全屏
      --parmars
        id: roomId
    */
    videoFullscreen(id) {
      this.$refs['videoPlayer_' + id][0].player.requestFullscreen()
    },

		/**
		 * 保存
		 * @param  {Object} room
		 */
    videoVolume(room) {
      const _this = this
      // 设置全局的videoSetting.volume为静音/开启声音
      const volume = this.videoSetting.volume = !this.videoSetting.volume
      // 设置当前房间所有的audio为静音/开启声音
      room.audioList.forEach((audio, i) => {
        const target = _this.$refs['audio_' + audio.member.id ][0]
        target.muted = !volume
      });
      // 设置Emedia对象的静音属性
      room.Emedia.parmars.videoTag.muted = !volume
    },
    /*
    麦克风静音/开启声音
      --parmars
        room: 房间对象
    */
    micVolume(room, state) {
      const _this = this
      // 设置全局的videoSetting.mic为静音/开启声音
      const mic = state === undefined ? (this.videoSetting.mic = !this.videoSetting.mic) : state
      const em = room.Emedia
      em.state.mic = mic
      /*
      设置Emedia切换静音/开启声音
        --return Promise
        --parmars:
          1.code: 0 | 1
          2.msg: 成功|错误 提示
      */
      em.toggleMic()
      .then((code, msg) => {
        if (code === 0) {
          _this.$store.commit('setRequest', {
            valid: false,
            url: ``,
            type: 'error',
            msg
          })
        }
      })
    },
    /*
    设置Emedia截屏，并用tui-image-editer处理图片
      --Emedia.captureVideo() return Promise
      --parmars:
        1.Blob: image对象,base64|Blob
    */
    screenshot(room) {
      const _this = this
      const em = room.Emedia
      if (!em) {
        return
      }
      em.captureVideo()
      .then(res => {
        if (!res.blob) {
          return
        }
        //打开截屏dialog
        _this.captureImageDialog = true
        //设置tui-image-editer的图片地址为截屏返回对象
        _this.bigImageSource = res.blob
        //设置tui-image-editer的图片名称为图片原名称
        _this.bigImageName = res.filename + '.png'
      })
      .catch(errMsg => {
        _this.$store.commit('setRequest', {
          valid: false,
          url: ``,
          type: 'error',
          msg: errMsg
        })
      })
    },
    // 获取房间历史列表
    loadRoomHistory() {
      const _this = this
      const historyOptions = {
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "application/x-mpegURL",
          src: "" //你的m3u8地址（必填）
        }],
        poster: "poster.jpg", //你的封面地址
        width: 150,
        notSupportedMessage: '无法连接到视频服务器，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      }

      this.$axios.get('live/living-room-history')
      .then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          let arr = []
          dat.forEach(({id, name, url}) => {
            historyOptions.sources.src = url
            arr.push({
              id,
              name,
              playerOptions: historyOptions
            })
          })
          _this.roomHistory = arr
        }
      })
    },
    // 获取房间信息 -> 创建房间 -> 加入房间 ->获取房间人员
    getRoomInfo(rid) {
      const _this = this
      // 加载数据背景
      this.loadingRoomData = true
      // 获取当前用户的socket sessionId
      const sessionId = this.getSocketCode('liveshow')
      const request = this.$axios.get(`live/room-info?room_id=${rid}&wamp_session_id=${sessionId}`)
      request.then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          // 获取房间信息成功,创建房间
          _this.createRoomTab(dat)
        }else {
          this.message = {
  					show: true,
  					type: 'alert',
  					title: _this.$t("message.ServerConnectFail"),
  					msg: _this.$t("message.GetRoomInfoFail")
  				}
    			this.messageType.model = 'alert'
        }
      })
    },
    /*
    获取房间人员
      --parmars:
        1.id: room_id
    */
    getRoomPeoples(id) {
      const _this = this
      this.$axios.get(`live/room-users?room_id=${id}`)
      .then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          const room = _this.getCurrentRoom
          room.people = dat
        }
      })
    },
    /*
    加入历史房间
      --parmars:
        1.rid: room_id
    */
    enterHistoryRoom(rid) {
      const _this = this
      // 查看当前是否拥有对应ID的room对象,如果有,就直接进入
      const exist = this.checkRoomExist(rid)
      if (exist) {
        this.tabs = 'tab-' + rid
        return
      }
      // 加载数据背景
      this.loadingRoomData = true
      // 获取当前用户的socket sessionId
      const sessionId = this.getSocketCode('liveshow')
      // 请求返回房间
      const request = this.$axios.get(`live/back?room_id=${rid}&wamp_session_id=${sessionId}`)
      request.then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          // 返回房间成功,关闭历史房间列表,并创建房间
          _this.historyMenu = false
          _this.createRoomTab(dat)
        }else {
          _this.message = {
  					show: true,
  					type: 'alert',
  					title: _this.$t("message.ServerConnectFail"),
  					msg: _this.$t("message.FailedToGetBackRoom")
  				}
          _this.loadingRoomData = false
    			_this.messageType.model = 'alert'
        }
      })
      request.finally(() => {
        _this.initRoomFunc = null
      })
    },
		/**
		 * 查看房间是否存在
		 * @param  {String | Number} rid 房间id
		 * @return  {Boolean}
		 */
    checkRoomExist(rid) {
      const target = this.findTargetRoom(rid)
      return target ? true : false
    },
		/**
		 * 获取对应ID的room对象
		 * @param  {String | Number} rid 房间id
		 * @return  {Object} room对象
		 */
    findTargetRoom(rid) {
      const roomList = this.roomList
      // 如果当前房间已存在,则进入当前房间
      const targetRoom = roomList.find(item => {
        return item.id === rid
      })
      return targetRoom
    },
    /*
    创建房间
      --arguments:
      {
        id: String | Number 房间ID
        name: String 房间名称
        url:  String 直播流地址(暂时无法使用)
        create_at: String 创建时间
        streamer: Object Emedia类的播主对象
        confr: String Emedia类的房间门票
        confr_user: Array->Object Emedia类的房间人员对象数组
      }
    */
    createRoomTab({ id, name, url, create_at, streamer, confr, confr_user }) {
      const option = {
        id, //房间ID
        creator: {
          id: null,
          name: null,
          avatar: 'https://xxxx'
        }, //创建者ID(创建房间必须要有1个创建者和1个直播人),
        player: {
          id: streamer.id,
          name: streamer.name,
          avatar: streamer.avatar,
          playDate: null
        }, //直播人信息,
        conference: {
          target: 'videoPlayer_' + id,
          room: confr,
          user: confr_user
        },
        name,
        people: [], //房间人员ID
        news: [], //房间消息
        url, //直播流地址
        create_at, //创建时间
        chat: {
          value: null,
          loading: false,
          noMoreHistory: false,
          list: []
        }, //聊天记录
        playerOptions: this.playerOptions,
        videoComplete: false,
        draw: false,
        drawClearAll: false,
        audioList: [],
        chatSwitch: true
      }
      // 将房间对象放入房间列表生成房间
      this.roomList.push(option)
      // 加入环信房间
      this.joinLiveRoom(option)
      this.tabs = 'tab-' + option.id
      // 获取房间人员
      this.getRoomPeoples(id)
      // 关闭加载数据背景
      this.loadingRoomData = false
    },
    /*
    创建房间
      --arguments:
      1.room: 房间对象
    */
    joinLiveRoom(room) {
      const _this = this
      _this.$nextTick(() => {
        // 获取对应房间直播流的video标签ID
        const target = room.conference.target
        // 获取对应房间直播流的video标签
        const videoTag = this.$refs[target][0].$refs.video
        // 设置加入房间的USER INFO
        const user = {
          username : room.conference.user.name,
          token: room.conference.user.token
        }
        // 设置加入房间的ID和PASSWORD
        const confrInfo = {
          confrId: room.conference.room.id,
          password: room.conference.room.password
        }
        /*
        有观众加入的回调函数
          --arguments:
          1.member: 发布流人员的信息、
          2.stream：流信息
          3.audioList: 观众音频列表
          4.callback: emedia.mgr.subscribe() 订阅观众的音频
        */
        const onStreamAdded = function ({member, stream, audioList, callback}) {

          room.audioList = audioList
          _this.$nextTick(() => {
            const tag = _this.$refs['audio_' + member.id][0]
            callback({member, stream, tag})
          })
        }
        /*
        有播主(移动端)加入的回调函数
          --arguments:
          1.member: 发布流人员的信息、
          2.stream：流信息
          3.audioList: 观众音频列表
          4.callback: emedia.mgr.subscribe() 订阅观众的音频
        */
        const onVideoComplete = function ({member, stream, audioList, callback}) {
          setTimeout(() => {
            _this.$nextTick(() => {
              // 关闭播主未加入加载遮罩
              room.videoComplete = true
              // 打开画板
              room.draw = true
              // 如果当前用户是静音状态,那么播主进来设置视频为静音
              if (!_this.videoSetting.volume) {
                room.Emedia.parmars.videoTag.muted = true
              }
              // 如果当前用户是禁麦状态,那么播主进来设置视频为禁用麦克风
              if (!_this.videoSetting.mic) {
                _this.micVolume(room, false)
              }
            })
          }, 1000)
        }
        // 生成Emedia实例，放入ROOM对象中
        const em = new Emedia({appkey: this.$EmediaAppkey, videoTag, user, onStreamAdded, onVideoComplete})
        room.Emedia = em
        // 创建并加入环信房间
        _this.createAndJoinLiveRoom(em, confrInfo, room.id)
      })
    },
    /*
    创建并加入环信房间
      --arguments:
      1.em: Emedia实例
      2.confrInfo: { //环信房间的账号密码
          confrId: 房间ID,
          password: 房间密码
        }
      3.rid: ROOM实例的ID
    */
    createAndJoinLiveRoom(em, { confrId, password }, rid) {
      const _this = this
      // em.register()
      em.login().then(res => {
        em.join({confr: confrId, password, ext: {}}).then(info => {
          em.getConfrInfo()
          .then(room => {
            const tag = _this.$refs['audio_myself_' + rid ][0]
            em.publish({tag})
          })
        })
      })
    },
		/**
		 * 呼叫的移动端用户接受应答事件
		 * @param  {Object} data
     * data: {
         is_accept: {Number} [0 | 1], //接受|拒绝
         called_user_id: {Number} 999, //被呼叫的用户的ID
         created_room_id: {Number} 888, //呼叫成功创建的房间ID
       }
		 */
    inviteOnCalled(data) {
      // 获取房间信息并创建房间
      this.getRoomInfo(data.created_room_id)
    },
    /**
		 * SOCKET --- 用户加入或离开房间
		 */
    onUserEnterLeave() {
      const _this = this
      // 人员离开或加入时的socket触发函数
      this.$store.dispatch('socketRegisterActions', {
        name: 'liveshow',
        uri: 'live/push/user-enter-leave',
        callback: (uri, dat) => {
          // 只加载当前房间的news
          // is_enter:1->进入,0->离开
          const roomId = parseInt(dat.room_id)
          // const currentRoom = _this.getCurrentRoom
          const target = _this.findTargetRoom(roomId)
          if (target) {
            //添加新闻，并在3秒后关闭
            target.news.push({
              id: target.news.length,
              text: `${dat.user_name}${dat.full_name && (' (' + dat.full_name + ') ')} ${parseInt(dat.is_enter) ? '进入' : '离开'}了房间`
            })
            _this.showNews = true

            setTimeout(() => {
              _this.showNews = false
            }, 5000)

            // 如果用户离开房间
            // 如果是播主,且播主离开房间
            if (dat.is_streamer > 0 && !dat.is_enter) {
              // 则设置房间播发器为加载状态
               target.videoComplete = false
               target.videoErrMsg = _this.$t("message['Please wait,The broadcaster is not in the room']")
            }
            _this.getRoomPeoples(roomId)
          }
        }
      })
    },
    /**
		 * 人员[接受/拒绝]邀请加入房间
		 */
    onUserAnswaer() {
      const _this = this
      // 人员接受/拒绝邀请时触发
      this.$store.dispatch('socketRegisterActions', {
        name: 'liveshow',
        uri: 'live/push/respond-attend-invite',
        callback: (uri, dat) => {
          const roomId = parseInt(dat.room_id)
          const target = _this.findTargetRoom(roomId)
          if (target) {
            // 查看是否被邀请人员，是则修改被邀请人员的进入状态
            let r = _this.invitePeopleEnter.items.find(item => {
              return item.user_id === dat.called_user_id
            })
            if (r) {
              r.state = dat.is_accept ? 1 : -1
            }
          }
        }
      })
    },
    /**
		 * 接收房间内消息
		 */
    onMessage() {
      const _this = this
      // 发送消息时候触发的函数
      this.$store.dispatch('socketRegisterActions', {
        name: 'liveshow',
        uri: 'live/push/chat-sent',
        callback: (uri, dat) => {
          const roomId = parseInt(dat.room_id)
          // const currentRoom = _this.getCurrentRoom
          const target = _this.findTargetRoom(roomId)
          if (target) {
            if (parseInt(dat.user_id) !== _this.$user.id ) {
              target.chat.list.push({
                id: dat.id,
                name: dat.user_name,
                avatar: dat.user_avatar,
                self: false,
                type: dat.type,
                value: dat.value,
                created_at: dat.created_at
              })
              _this.scrollToBottom(dat.room_id)
            }
          }
        }
      })
    },
    /**
		 * 房间被销毁
		 */
    onRoomDestroy() {
      const _this = this
      // 发送消息时候触发的函数
      this.$store.dispatch('socketRegisterActions', {
        name: 'liveshow',
        uri: 'live/push/room-destroy',
        callback: (uri, dat) => {
          const roomId = parseInt(dat.room_id)
          // const currentRoom = _this.getCurrentRoom
          const target = _this.findTargetRoom(roomId)
          if (target && dat.reason.code > 0) {
            const deleteRoom = function(status, payload) {
              const index = _this.roomList.indexOf(target)
              _this.roomList.splice(index, 1)
              _this.destroyMessage.splice(payload.index, 1)
            }
            const len = _this.destroyMessage.push({
              id: roomId,
              message: {
        				show: true,
        				type: '',
        				title: '确认',
        				msg: _this.selectedLocale.locale === 'en' ? `The room you participated in“${target.name}”Automatically closed，Reason：${dat.reason.msg}` : `你参与的房间“${target.name}”已自动关闭，原因：${dat.reason.msg}`
        			},
        			messageType: {model: 'alert', func: deleteRoom}
            })
            _this.destroyMessage[len-1].messageType.payload = {index: len - 1}
          }
        }
      })
    },
    /**
		 * 被移动端呼叫
		 */
    beCalled() {
      const _this = this
      // 获取需要创建的房间列表
      const list = this.getLiveShowCreateRoomList
      // 依次创建房间,创建后删除列表中的对应项
      list.forEach(item => {
        _this.getRoomInfo(parseInt(item))
        _this.$store.dispatch('delLiveshowRoomListActions', item)
      })

    },
    /**
		 * 房间内邀请观众全部应答完毕
		 * @param  {Array} arr 观众对象
		 */
    roomInviteCalled(arr) {
      // 关闭邀请弹出层(并非邀请结果弹出层)
      this.inviteDialog = false
      // 将观众对象赋给房间邀请人员数组(观众对象中有接受与否,并依此展示邀请结果弹出层)
      this.invitePeopleEnter.items = arr
    },
    /**
		 * 获取对应ID的room对象
		 * @param  {Object} room 房间对象
		 */
    quit(room) {
      const _this = this
      // 退出房间处理函数
      const func = function() {
        // 获取所有房间列表
        const list = _this.roomList
        // 删除对应房间
        list.splice(list.indexOf(room), 1)
        // 获取顶部的历史房间列表
        _this.loadRoomHistory()
      }
      // 请求退出房间接口
      this.$axios.get(`live/leave?room_id=${room.id}`)
      .then(res => {
        if (res.data.code === 1) {
          // 退出环信房间,Emedia:环信处理类
          room.Emedia.exit()
          _this.$store.commit('setRequest', {
            valid: false,
            url: ``,
            type: 'success',
            msg: _this.$t("Left the room successfully")
          })
          // 退出房间成功后处理本地房间列表
          func()
        }else {
          _this.$store.commit('setRequest', {
            valid: false,
            url: ``,
            type: 'error',
            msg: _this.$t("Left the room failed")
          })
        }
      })
    },
    /**
		 * 获取历史聊天记录
		 * @param  {Object} room 房间对象
		 */
    loadMore(room) {
      const _this = this
      // 开启加载历史动画
      room.chat.loading = true
      // 获取最后一条记录的ID(根据ID请求返回该ID记录之前的10条聊天记录)
      const list = room.chat.list
      const firstPopId = list && list.length > 0 ? list[0].id : null
      this.$axios.get(`/live/chat-records?room_id=${room.id}&earliest_chat_id=${firstPopId || 0}&pager=10`)
      .then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          // 循环插入聊天记录(在聊天记录列表前插入)
          for (var i = 0; i < dat.length; i++) {
            const item = dat[i]
            room.chat.list.unshift({
              id: item.id,
              name: item.user_name,
              avatar: item.avatar,
              self: parseInt(item.user_id) === _this.$user.id,
              type: item.type,
              value: item.value,
              created_at: item.created_at
            })
          }
          // 关闭加载历史动画
          room.chat.loading = false
          // 如果返回的聊天历史列表条数少于10条,则显示没有更多记录
          if (dat.length < 10) {
            room.chat.noMoreHistory = true
            return
          }
        }
      })
    },
    /**
		 * 发送图片
		 * @param  {Object} room 房间对象
		 */
    sendImage(room) {
      // 获取对应的File Input
      const domId = 'uploadImage-' + room.id
      const ref = this.$refs[domId]
      // this.saveLocalFile({room, type: 'image', ref})
      // 上传文件,类型'image'
      this.uploadFile({room, type: 'image', ref})
		},
    /**
		 * 发送文件
		 * @param  {Object} room 房间对象
		 */
    sendFile(room) {
      // 获取对应的File Input
      const domId = 'uploadFile-' + room.id
      const ref = this.$refs[domId]
      // this.saveLocalFile({room, type:'file', ref})
      // 上传文件,类型'file'
      this.uploadFile({room, type:'file', ref})
    },
    /**
		 * Base64格式转为File对象
		 * @param  {Base64} dataurl Base64格式的文件对象
		 * @param  {String} filename 文件名称
     * @return {File} 转换完成的file对象
		 */
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    },
    /**
		 * 发送截图到聊天窗口
		 * @param  {Base64} dataURL Base64格式的文件对象
		 */
    sendCaptureFile(dataURL) {
      // 关闭截图弹出窗口
      this.captureImageDialog = false
      // 将大图预览的路径改变为截图地址
      this.bigImageSource = dataURL
      const room = this.getCurrentRoom
      const domId = 'uploadFile-' + room.id
      const ref = this.$refs[domId]
      // 将截图的base64格式文件转为file文件
      const file = this.dataURLtoFile(this.bigImageSource, this.bigImageName)
      // 将文件发送并上传
      this.uploadFile({room, type:'image', ref}, file)
    },
    /**
		 * Base64格式转为File对象
		 * @param  {Object} {room: 房间对象, type: 文件类型['image'| 'file'], ref: File Input的DOM对象}
		 * @param  {File} file 文件对象
		 */
    uploadFile({ room, type, ref }, file) {
      const _this = this
      // 加载文件到本地(并且校验文件格式等可用性)
      const loadLocalFile = this.saveLocalFile({room, type, ref}, file)
      const uploadToClound = function(localFileModel) {
        const cf = new CloundFile({url: 'cos/temp-key', type: 'post', files: [localFileModel.RealFileObj], payload: {type: 'live_msg_file'} })
        cf.upload().then((files) => {
          files.forEach((item, index) => {
            _this.uploadToBackend({room, type, localFileModel, COS_File_Path: item.url, Real_File_Name: item.realFilePath.name})
          })
        })
      }

      loadLocalFile.then(res => {
        const files = res.value
        if (files) {
          uploadToClound(res)
        }
      })

    },
    uploadToBackend({room, type, localFileModel, COS_File_Path, Real_File_Name}) {
      const _this = this

      const callback = function(res) {
        if (res.result.code !== 1) {
          localFileModel.id = res.result.data.id
          localFileModel.sendError = true
        }
      }
      this.$store.dispatch('publishActions', {
        name: 'liveshow',
        publishName: 'rpc/live/send-msg',
        data: {
          room_id: room.id,
          type,
          value: COS_File_Path,
          file_name: Real_File_Name,
          callback
        }
      })
    },
    /**
		 * 加载文件到本地
		 * @param  {Object} {room: 房间对象, type: 文件类型['image'| 'file'], ref: File Input的DOM对象}
		 * @param  {File} file 文件对象
     * @return {Promise} 返回一个异步函数 resolve => {Object} 聊天记录模型对象 reject => 加载文件到本地错误
		 */
    saveLocalFile({ room, type, ref }, file) {
	  	let _this = this
      // 获取File Input的DOM对象
			const target = ref ? ref[0] : null
      if (!target) {
				_this.$store.commit('setRequest', {
					valid: false,
					url: ``,
					type: 'error',
					msg: _this.$t("message['Document not Found, please upload again']")
				})
        return
      }
      // 获取文件File对象
			const files = file || target.files[0]
      // 获取文件校验实例
			const sizeCheck = new ValidFile(files)
      // 如果文件校验结果不合格,弹出错误信息,并清空File Input的值
			if (!sizeCheck.result.valid) {
				_this.$store.commit('setRequest', {
					valid: false,
					url: ``,
					type: 'warning',
					msg: sizeCheck.result.text
				})
				target.value = null
				return
			}
      // 检验文件格式
      let typeCheck
			if (type === 'image') {
        typeCheck = sizeCheck.fileTypeValid(['jpg','jpeg','png','gif','bmp'])
      }
      else {
        typeCheck = sizeCheck.fileTypeValid(['txt','doc','docx','xls','xlsx','pdf','pptx','ppt'])
      }
			if (!typeCheck.result) {
				_this.$store.commit('setRequest', {
					valid: false,
					url: ``,
					type: 'warning',
					msg: typeCheck.msg
				})
				target.value = null
				return
			}
      // 新建文件读取对象
      const fileReader = new FileReader()
      // 读取文件异步函数
      const ReadLocalFile = new Promise((resolve, reject) => {
        try {
          // 文件加载完毕触发
          fileReader.onload = function(e) {
    				const fileBase = e.target.result
            // 如果是图片则传入Base64对象,如果是文件则传入文件名(文件对象上传到COS上,后台只需要原文件名)
            const localFile = type === 'image' ? fileBase : files.name
            // 初始化一个聊天记录模型
            let model = Object.assign({}, _this.chatModel)
            model = {
              id: null,
              name: _this.$user.name,
              avatar: _this.$user.avatar,
              self: true,
              type,
              created_at: new Date(),
              value: localFile,
              RealFileObj: files
            }
            // 将聊天记录模型添加到房间聊天记录列表
            room.chat.list.push(model)
            // 清空File Input的值
            room.chat.input = null
            // 将聊天区域滚动到最底部
            _this.scrollToBottom(room.id)
            // 清空File Input的值
    				target.value = null
            resolve(model)
    			}
        } catch (e) {
          reject('save local file fail.')
        }
      })
      // 用Base64格式读取File文件
			fileReader.readAsDataURL(files)
      return ReadLocalFile
		},
    /**
		 * 下载文件(已弃用,用户自行右键下载)
		 */
    downloadFile() {
      const file = this.dataURLtoFile(this.bigImageSource, this.bigImageName)
      /**
       * 获取 blob
       * @param  {String} url 目标文件地址
       * @return {Promise}
      */
      function getBlob(url) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
            };

            xhr.send();
        });
      }

      /**
       * 保存
       * @param  {Blob} blob
       * @param  {String} filename 想要保存的文件名称
       */
      function saveAs(blob, filename) {
          if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, filename);
          } else {
              const link = document.createElement('a');
              const body = document.querySelector('body');

              link.href = window.URL.createObjectURL(blob);
              link.download = filename;

              // fix Firefox
              link.style.display = 'none';
              body.appendChild(link);

              link.click();
              body.removeChild(link);

              window.URL.revokeObjectURL(link.href);
          }
      }

      /**
       * 下载
       * @param  {String} url 目标文件地址
       * @param  {String} filename 想要保存的文件名称
       */
      function download(url, filename) {
          getBlob(url).then(blob => {
              saveAs(blob, filename);
          });
      }
      download(this.bigImageSource, file.name || '未命名');
    },
    /**
		 * 打开浏览器的音视频授权
		 * @param  {Boolean} open 是否打开音频,默认为true(摄像头为false,因为PC端的不需要上传视频流)
		 */
    initUserMedia(open=true) {
      navigator.getUserMedia  = navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia;

      if (navigator.getUserMedia) {
          // 支持
          navigator.getUserMedia({video: false,audio: open}, function onSuccess(stream) {
              console.log('音视频授权成功');
          }, function onError(error) {
              console.log("音视频授权错误：", error);
          });
      } else {
        // 不支持
        this.$store.commit('setRequest', {
          valid: false,
          url: responseURL,
          type: 'warning',
          msg: '请刷新页面并授权浏览器打开音/视频权限，否则无法使用本功能'
        })
      }
    },
    openDraw(room) {
      if (room.videoComplete) {
        room.draw = !room.draw
      }else {
        // 提示视频流加载完毕后才能使用
        this.$store.commit('setRequest', {
          valid: false,
          url: '',
          type: 'warning',
          msg: _this.$t("message['No video information,Please use box selection after the video has loaded']")
        })
      }
    },
    drawClearAllHandel(room) {
      const callback = function (res) {
        if (res.result.code === 1) {
          this.$store.commit('setRequest', {
            valid: false,
            url: '',
            type: 'success',
            msg: _this.$t("message['Empty Frame Selection']") + _this.$t("message['success']")
          })
        }else {
          this.$store.commit('setRequest', {
            valid: false,
            url: '',
            type: 'error',
            msg: _this.$t("message['Empty Frame Selection']") + _this.$t("message['fail']")
          })
        }
      }
      this.$store.dispatch('publishActions', {
        name: 'liveshow',
        publishName: 'rpc/live/mark-cancel',
        data: {
          room_id: room.id
        },
        callback
      })
    },
    sendDrawToBackend(obj) {
      this.captureImageDialog = false
      const { top, left, width, height } = obj
      const room = this.getCurrentRoom
      const callback = function (res) {

      }
      const fullBlock = document.querySelector('.room-block-show')
      const fullWidth = parseInt(fullBlock.offsetWidth)
      , fullHeight = this.chatSwitchHeight
      , percentageX = Math.round((parseInt(left) / fullWidth) * 100)
      , percentageY = Math.round(( parseInt(top) / fullHeight) * 100)
      , percentageWidth = Math.round((parseInt(width) / fullWidth) * 100)
      , percentageHeight = Math.round((parseInt(height) / fullHeight) * 100)
      if (!percentageX || !percentageY || !percentageWidth || !percentageHeight) {
        return
      }
      this.$store.dispatch('publishActions', {
        name: 'liveshow',
        publishName: 'rpc/live/rect-mark',
        data: {
          x: percentageX,
          y: percentageY,
          width: percentageWidth,
          height: percentageHeight,
          room_id: room.id
        },
        callback
      })
      // 发送完毕后立即清除掉
      setTimeout(() => {
        room.drawClearAll = true
      }, 1000)
    },
    initDarwMenus() {
      this.drawMenus = [
        { title: _this.$t("message['Empty Frame Selection']"), func: this.drawClearAllHandel }
      ]
    }
  }
}
</script>
<style scoped media="screen">
.room-app-container {
  overflow: hidden;
  background: #F4F7FA !important;
}
.room-app-background {
  background: linear-gradient(to right, #4A6696, #3EA8C2) !important;
}

.room-history {
  margin-right: 1rem;
  float: left;
}

.show-card-maigin {
  margin-bottom: 2rem;
}

.show-card-background {
  background: inherit !important;
}

.room-block {
  position: relative;
  margin-top: 10px;
  overflow-y: auto;
}

.room-block-show {
  background: #ccc;
  overflow: hidden;
}

.room-block-chat {
  background: #ecf0f1;
  padding-top: 10px;
}

.room-send-btn {
  margin-bottom: -1rem;
  min-height: 56px;
  max-width: 60px;
  min-width: 50px !important;
}

.room-volume {
  max-width: 200px;
  position: absolute;
}

.room-volume-transform {
  /* Rotate div */
  transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  /* Internet Explorer */
  -moz-transform: rotate(270deg);
  /* Firefox */
  -webkit-transform: rotate(270deg);
  /* Safari 和 Chrome */
  -o-transform: rotate(270deg);
  /* Opera */
}



.send-more-options {
  width: 100%;
}

.send-more-options-btn {
  margin-left: -0.6rem;
}

.room-badge-margintop {
  margin-top: 4px;
  margin-right: 4px;
}

.room-people-list {
  max-height: 600px;
  min-width: 200px;
  overflow-y: auto;
}

.room-invite-people {
  display: block;
  width: 90%;
  margin: 0 auto;
  text-align: right;
}

.room-invite-block {
  width: 60px;
  text-align: center;
  margin-top: 5px;
}

.room-invite-avatar {
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.room-invite-avatar .v-avatar {
  margin: 0 auto;
}

.room-layout-card {
  margin: 20px 0;
  padding: 0;
}

.room-history-block {
  width: 150px;
}
.container.grid-list-xl .layout .appcard-no-padding {
  padding: 0 !important;
}

.room-tab-font {
  color: #ecf0f1;
}

.chat-area-hide {
	position: absolute;
	right: 0;
	top: 0;
  z-index: 1;
}

.liveshow-video-actions {
  padding-top: 1.3rem;
}
.liveshow-video-actions-margin {
  margin-top: 18px;
}
</style>

<style media="screen">

.send-more-options .v-input__prepend-outer, .send-more-options .v-input__append-inner {
  margin: 0 !important;
  padding: 0;
}

.room-history-block .vjs-control-bar,
.room-history-block .vjs-big-play-button {
  display: none !important;
}
.room-app-container .v-toolbar__extension {
  height: 50px;
  position: absolute;
  top: 0;
  width: 50%;
  padding: 0;
  margin: 0 25%;
}
.room-app-container .v-toolbar__extension .v-tabs__bar {
  background-color: rgba(0, 0, 0, 0) !important;
}
.room-tab-avtive>a{
  font-weight: bold !important;
  font-size: initial;
  color: #fff !important;
}
.vjs-full-height,.vjs-full-height>div {
  height: 100% !important;
}
</style>
