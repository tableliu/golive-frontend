<!-- /video-library/index -->
<!-- 现场作业 -> 视频作业 -->
<template>
	<div>
		<page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader>
  	<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>

				<v-dialog  v-model="mapDialog" max-width="80%">
					<v-card class="v-card-table">
						<Map
				      :center="location"
				      :point="point"
				    >
				    </Map>
					</v-card>
				</v-dialog>

				<v-dialog  v-model="setpDialog" max-width="80%">
					<v-card class="v-card-table">
						<v-img
							:src="setpDialogImageSource"
							contain
							class="grey darken-4 white--text cursor-pointer"
							max-height="800"

						></v-img>
					</v-card>
				</v-dialog>

				<v-dialog  v-model="dialog" max-width="75%">
					<v-card>
						<v-container>
							<v-layout wrap style="margin-top: 0">
								<v-flex xs6 sm6 md9>
									<video-player
										class="video-player vjs-custom-skin"
										ref="videoPlayer_full"
										:playsinline="true"
										:options="playerOptions"
										@ready="playerReadied"
										></video-player>
								</v-flex>
								<v-flex
									xs6 sm6 md3 :style="{'overflow-y': 'scroll', height: setpDialogHeight + 'px'}"
								>
									<v-list three-line>
										<template v-for="(item, index) in setpVideoList">
											<v-subheader
												v-if="item.header"
												:key="item.header"
											>
												{{ item.header }}
											</v-subheader>

											<v-divider
												v-else-if="item.divider"
												:key="index"
												:inset="item.inset"
											></v-divider>

											<v-list-tile
												v-else
												:key="item.time"
												avatar
												@click="viewCurrentTime(item.len)"
												class="cursor-pointer"
											>
												<v-img
													:src="item.avatar"
													height="80"
													width="80"
													contain
	                				class="grey darken-4 white--text cursor-pointer dialog-list-img"
                				></v-img>

												<v-list-tile-content>
													<v-list-tile-title v-html="item.time"></v-list-tile-title>
													<v-list-tile-sub-title v-html="item.content"></v-list-tile-sub-title>
												</v-list-tile-content>
											</v-list-tile>
										</template>
									</v-list>
								</v-flex>
							</v-layout>
						</v-container>
						<!-- <div style="inline-block">

						</div>
						<div style="inline-block">

						</div> -->
					</v-card>
				</v-dialog>

				<app-card
					customClasses="card-table custom-app-card"
					:fullBlock="true"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
          <v-container>
            <v-layout wrap style="margin-top: 0">
              <v-flex md3 style="align-items:center;text-align:center;">

                <v-tooltip right>
                  <template slot="activator">
                    <v-icon @click.native="viewFullVideo" class="cursor-pointer" size="200" dark>play_circle_filled</v-icon>
                  </template>
                  <span>播放完整视频</span>
                </v-tooltip>
              </v-flex>
              <v-flex md6>
                <h1 style="margin-left:12px;">{{ items.title }}</h1>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs6 sm6 md3>
                      <h5 class="container-padding-tiny">时长：</h5>
                    </v-flex>
                    <v-flex xs6 sm6 md9>
                      <h5 class="active-value container-padding-tiny">{{ getVideoEq(items.start_time, items.end_time) }}</h5>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs6 sm6 md3>
                      <h5 class="container-padding-tiny">步骤：</h5>
                    </v-flex>
                    <v-flex xs6 sm6 md9>
                      <h5 class="active-value container-padding-tiny">{{ items.step_content }}</h5>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs6 sm6 md3>
                      <h5 class="container-padding-tiny">作业人：</h5>
                    </v-flex>
                    <v-flex xs6 sm6 md9>
                      <h5 class="active-value container-padding-tiny">{{ items.created_by }}</h5>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs6 sm6 md3>
                      <h5 class="container-padding-tiny">作业地点：</h5>
                    </v-flex>
                    <v-flex xs6 sm6 md9>
                      <v-tooltip top>
                        <template slot="activator">
                          <a @click.stop="viewMap(items.longitude, items.latitude)" class="active-value container-padding-tiny">{{ items.location }}</a>
                        </template>
                        <span>查看地图</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs6 sm6 md3>
                      <h5 class="container-padding-tiny">开始时间：</h5>
                    </v-flex>
                    <v-flex xs6 sm6 md9>
                      <h5 class="active-value container-padding-tiny">{{ items.start_time }}</h5>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs6 sm6 md3>
                      <h5 class="container-padding-tiny">结束时间：</h5>
                    </v-flex>
                    <v-flex xs6 sm6 md9>
                      <h5 class="active-value container-padding-tiny">{{ items.end_time }}</h5>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>

            <v-timeline dense clipped>

              <v-timeline-item
                v-for="(item, index) in setps"  :key="index"
                class="mb-3"
                color="grey"
                icon-color="grey lighten-2"
                small
              >
              <template v-slot:icon>
                <span style="color:white;">{{ index + 1 }}</span>
              </template>
              <div style="margin-bottom:12px;">
              	<span style="margin-bottom:10px;" class="headline font-weight-bold">{{ `${item.title} ${getVideoTimeFormat(item.timeline)} 时长:${item.time_length}秒` }}</span>
              </div>
              <v-layout>
                <v-flex xs6 sm4 v-for="(imageData, imageIndex) in item.image_data" :key="imageIndex">
                  <v-tooltip top>
                    <template slot="activator">
                      <v-img
												@click="viewBigImg(imageData.image)"
                        :src="imageData.image"
                        :lazy-src="imageData.image"
												contain
												height="200"
                				class="grey darken-4 white--text cursor-pointer"
                      >
												<template v-slot:placeholder>
			                    <v-row
			                      class="fill-height ma-0"
			                      align="center"
			                      justify="center"
			                    >
			                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
			                    </v-row>
			                 	 </template>
                    	  </v-img>
                      	<div class="text-xs-center">{{ getVideoTimeFormat(imageData.image_timeline) }}</div>
												<div class="text-xs-center"> {{ imageData.content }} </div>
                    	</template>
                    	<span>查看大图</span>
                	  </v-tooltip>
                	</v-flex>
                </v-layout>
              </v-timeline-item>
            </v-timeline>
          </v-container>
				</app-card>
			</v-layout>
  	</v-container>
	</div>
</template>

<script>
import DateHandel from '@/tools/dateHandel'
import Map from '@/components/Map'

import {
  videoPlayer
} from 'vue-video-player'
import 'videojs-contrib-hls'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

export default {
  components: {
    videoPlayer,
		Map
  },
  data() {
    return {
      loader: false,
			dialog: false,
			mapDialog: false,
			setpDialog: false,
			setpDialogImageSource: '',
			setpDialogHeight: 0,
			setpVideoList: [
        { header: '测试检查1' },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          time: '00:00',
					len: 30,
          content: "测试描述"
        },
        { divider: true, inset: true }
			],
			location: {
				x: null,
				y: null
			},
			point: [],
			items: {},
			setps: [],
			playerSource: '',
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        // sources: [{
        //     type: "application/x-mpegURL",
        //     src: "http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8" //你的m3u8地址（必填）
        // }],
				sources: [{
			    type: "video/mp4", // 类型
			    src: null // url地址
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
    }
  },
	beforeMount() {
		// 获取url参数
		const param = this.getQuery
    this.power = param
		this.getPageData()
	},
  mounted() {
  },
	computed: {
		formTitle() {
			return '视频作业详情'
		},
		getQuery() {
			// 获取url参数
      const params = this.$router.history.current.params
      return params
    }
	},
	watch: {
		dialog() {
			const _this = this
			const videoPlayer = this.$refs.videoPlayer_full.player
			if (!this.dialog) {
				setTimeout(() => {
			    videoPlayer.pause()
				}, 500 )
			}else {
			}
		}
	},
  methods: {
		getPageData() {
			const _this = this
			const param =  this.power
			const request = this.$axios.post('/job/view', {
				type: 'video',
				id: parseInt(param.id)
			})
			request.then(res => {
				if (res.data.code === 1) {
					const dat = res.data.data
					_this.items = dat
					_this.setps = dat.step_data
					_this.playerSource = dat.video
					_this.initSetpVideoList()
				}
			})
		},
		initSetpVideoList() {
			const _this = this
			let arr = []
			_this.setps.forEach(item => {
				arr.push({ header: item.title })
				item.image_data.forEach(i => {
					arr.push({
	          avatar: i.image,
	          time: _this.getVideoTimeFormat(i.image_timeline),
						len: parseInt(i.image_timeline),
	          content: i.content
	        })
				})
			})
			_this.setpVideoList = arr
		},
		viewFullVideo() {
			const _this = this
			const videoPlayer = this.$refs.videoPlayer_full.player
			// videoPlayer.src = this.playerSource
			this.playerOptions = {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
				sources: [{
			    type: "video/mp4", // 类型
			    src: _this.playerSource // url地址
			  }],
        poster: "poster.jpg", //你的封面地址
        width: 300,
        notSupportedMessage: '无法连接到视频服务器，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      }
			this.dialog = true
		},
		getVideoEq(start, end) {
			return DateHandel.getTimeEquation(start, end)
		},
		getVideoTimeFormat(num) {
			return DateHandel.getNumberFormatTime(num)
		},
		viewMap(lat, lng) {
			this.mapDialog = true
			this.location = {
				x: lat,
				y: lng
			}
			this.point = [{
				x: lat,
				y: lng
			}]
		},
		viewBigImg(src) {
			this.setpDialog = true
			this.setpDialogImageSource = src
		},
		playerReadied(e) {
			this.setpDialogHeight = e.el_.offsetHeight
		},
		viewCurrentTime(e) {
			const _this = this
			const videoPlayer = this.$refs.videoPlayer_full.player
			videoPlayer.currentTime(e)
		}
  }
}
</script>
<style media="screen" scoped>
	.dialog-list-img {
		flex: none;
		margin-right: 2px;
	}
</style>
<style media="screen">
	.text-xs-center {
		text-align: center !important
	}
	.card-title {
		width: 100%;
		font-size: 2rem;
		color: rgba(0,0,0,0.54) !important;
		text-align: center !important
	}
	.v-datatable__actions {
		/* display: none !important; */
	}
</style>
