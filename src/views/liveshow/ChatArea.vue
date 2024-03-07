<!-- 组件 -->
<!-- 聊天室 -->
<template>
	<div class="chat-wrapper">

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
		<template>
			<!-- <v-toolbar class="chat-head">
				<div class="chat-head-left d-custom-flex align-items-center">
					<v-btn class="mr-2 ham-menu-icon d-none gray--text" @click="toggleChatSidebar" flat icon small>
						<v-icon dark>menu</v-icon>
					</v-btn>
					<div class="media align-items-center">
						<div class="media-left mr-3 pos-relative">
							<img :src="getImageLocation(item.avatar)" alt="user-profile" class="rounded-circle pos-relative" width="40" height="40">
							<span :class="{'v-badge success rounded floating': !!items.room}">{{ items.room }}</span>
						</div>
						<div class="media-body">
							<h6 class="mb-0">{{items.room}}</h6>
							<span class="grey--text fs-12 d-inline-block" v-if="!!items.room">online</span>
							<span class="grey--text fs-12 d-inline-block" v-else>在线</span>
						</div>
					</div>
				</div>
				<div class="chat-head-right">
					<v-btn icon color="primary" class="video-icon">
						<v-icon>videocam</v-icon>
					</v-btn>
					<v-btn icon color="primary">
						<v-icon>phone</v-icon>
					</v-btn>
					<v-menu
						offset-y
						origin="left left"
						transition="scale-transition"
						left
					>
						<v-btn slot="activator" icon>
							<v-icon>more_vert</v-icon>
						</v-btn>
						<v-list>
							<v-list-tile @click="console.log('clear chat')">
								<v-list-tile-title>清空记录</v-list-tile-title>
							</v-list-tile>
							<v-list-tile @click="console.log('mute notifications')">
								<v-list-tile-title>Mute Notifications</v-list-tile-title>
							</v-list-tile>
							<v-list-tile @click="console.log('block')">
								<v-list-tile-title>Block</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>
				</div>
			</v-toolbar> -->
			<vue-perfect-scrollbar :style="getScrollHeight()" class="chat-area-scroll" :settings="settings">

				<span v-if="noMoreHistory" style="color:#ccc !important;font-weight:600;" class="body-1">没有更多数据...</span>
				<template v-else>
					<v-tooltip top>
						<template slot="activator" >
							<Circle7 v-if="loadingHistory"></Circle7>
							<a v-else @click.stop="loadMore" href="javascript:void(0)">
								<v-icon style="color: #4b6797 !important;">more_horiz</v-icon>
							</a>
						</template>
						<span>{{ $t("message['Load history']") }}</span>
					</v-tooltip>
				</template>

				<div class="chat-body">
					<template v-for="(item, index) in items">
						<div class="chat-block mb-3" :key="index" :class="{'flex-row-reverse': item.self}">
							<template>

								<div class="avatar-wrap" :class="!item.self ? 'mr-3' : 'ml-3'">
									<img :src="$getImageLocation(item.avatar, 'avatar')" class="rounded-circle" width="40" height="40" />
									<span class="fs-12 grey--text d-block mt-1 fw-light">{{ item.name }}</span>
								</div>

								<div class="chat-bubble-wrap">
									<v-tooltip bottom v-if="item.sendError" class="chat-pop-block" :class="item.self || 'float-right'">
										<template slot="activator">
											<v-btn icon class=" ma-0" dark >
												<v-icon style="font-size: 1.5rem;" class="message-error">error_outline</v-icon>
											</v-btn>
										</template>
										<span>{{ $t("message['The message failed to be sent']") }}</span>
									</v-tooltip>
									<div class="chat-bubble chat-pop-block px-3 d-custom-flex align-items-center" :class="getPopStyle(item)">

										<v-tooltip top v-if="item.type === 'image'">
					            <template slot="activator">
					              <img @click="viewBigImg(item.value)" :src="item.value" alt="image" style="max-width:100%;max-height:100px;">
					            </template>
					            <span>{{ $t("message['View Big Image']") }}</span>
					          </v-tooltip>
										<div v-else-if="item.type === 'file'" @click="downloadFile(item)"><v-icon size="30">attach_file</v-icon>附件<a class="load-more-file" href="javascript:void(0)">{{ item.file_name || $t("message['Uname File']") }}</a></div>
										<span v-else class="d-inline-block fs-14" style="text-align:left;">{{item.value}}</span>

									</div>

									<span class="fs-12 grey--text  d-block mt-1 fw-light" :class="!item.self ? 'text-xs-left' : 'text-xs-right'">{{ getTimeAgo(item.created_at) || $t("message['Unknow Time']") }}</span>

								</div>
							</template>
							<!-- <template v-else>
								<div class="avatar-wrap ml-3">
									<img :src="getImageLocation(item.avatar)" class="rounded-circle" width="40" height="40" />
									<span class="fs-12 grey--text d-block mt-1 fw-light">{{ item.name }}</span>
								</div>
								<div class="chat-bubble-wrap">
									<div class="chat-bubble odd primary px-3 d-custom-flex align-items-center">
										<v-tooltip top v-if="item.type === 'image'">
					            <template slot="activator">
					              <img @click="viewBigImg(item.value)" :src="item.value" alt="图片" style="max-width:100%;">
					            </template>
					            <span>查看大图</span>
					          </v-tooltip>
										<div v-else-if="item.type === 'file'" class="room-bubble-file"><v-icon size="30">attach_file</v-icon>附件<a @click="downloadFile" class="load-more-file" href="javascript:void(0)">{{ item.value }}</a></div>
										<span v-else class="d-inline-block fs-14 white--text">{{item.value}}</span>
									</div>
									<span class="fs-12 grey--text text-xs-right d-block mt-1 fw-light">{{ getTimeAgo(item.create_at) || '未知时间' }}</span>
								</div>
							</template> -->
						</div>
					</template>
				</div>
			</vue-perfect-scrollbar>
			<!-- <div class="chat-footer px-3">
				<div class="d-custom-flex">
					<v-text-field
						hide-details
						name="input-1-3"
						label="Send Message..."
						single-line
						:value="newMessage"
						v-model="newMessage"
						@keyup.enter="sendMessage"
					></v-text-field>
					<v-btn fab small>
						<v-icon dark>attachment</v-icon>
					</v-btn>
					<v-btn fab dark small color="primary" @click="sendMessage">
						<v-icon dark>send</v-icon>
					</v-btn>
				</div>
			</div> -->
		</template>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import SingleChatLoader from "./SingleChatLoader";
import { getCurrentAppLayout } from "Helpers/helpers";
import DateHandel from '@/tools/dateHandel';

export default {
  props: {
		// 聊天记录数组
    items: Array,
		// 加载聊天记录动画
		loadingHistory: {
			type: Boolean,
			default: false
		},
		// 没有更多记录状态
		noMoreHistory: {
			type: Boolean,
			default: false
		}
  },
	computed: {
	},
	data() {
		return {
			// vue-perfect-scrollbar滚动条高度
			settings: {
				maxScrollbarLength: 260
			},
			// 查看大图弹出窗口状态
	    dialog: false
		};
	},
	components: {
		SingleChatLoader
	},
	mounted(){
		// 将聊天列表滚动到底部
		this.scrollToEnd();
	},
	computed: {
	},
	updated(){
		// 聊天记录插入或删除时,如果不是新数据,将聊天列表滚动到底部
		if(this.newMessage == ''){
			this.scrollToEnd();
		}
	},
	methods: {
		// 触发加载更多事件
    loadMore() {
      this.$emit('loadMore')
    },
		// 下载文件
    downloadFile(item) {
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
			download(item.value, item.file_name || '未命名');
      // this.$emit('downloadFile')
    },
		/**
		 * 发送文本消息
		 */
		sendMessage() {
			if (this.newMessage !== "") {
				// this.$store.dispatch("sendMessage", this.newMessage);
				this.newMessage = "";
				this.scrollToEnd();
			}
		},
		toggleChatSidebar() {
			this.$store.dispatch("toggleChatSidebar", true);
		},
		getScrollHeight() {
			return
			let layout = getCurrentAppLayout(this.$router);
			switch (layout) {
			case "default":
				return "height: calc(100vh - 100px)";
			case "horizontal":
				return "height: calc(100vh - 150px)";
			case "boxed":
				return "height: calc(100vh - 280px)";
			case "boxed-v2":
				return "height: calc(100vh - 280px)";
			default:
				return "height: calc(100vh - 100px)";
			}
		},
    viewBigImg(url) {
      this.bigImageSource = url
      this.dialog = true
    },
		scrollToEnd() {
			var container = document.querySelector(".chat-area-scroll");
			if(container !== null){
				var scrollHeight = container.scrollHeight;
				container.scrollTop = scrollHeight;
			}
		},
		getTimeAgo(time) {
			return DateHandel.getTimeFormatDate(time)
			// return DateHandel.getTimeAgo(time)
		},
		getPopStyle(item) {
			const text = item.type === 'text' ? 'pop-text' : 'pop-file'
			const bg = !item.self ? 'even aqua-bg' : 'odd primary'
			const file = item.type === 'file' ? 'room-bubble-file cursor-pointer' : ''
			return text + ' ' + bg + ' ' + file
		}
	}
};
</script>
<style lang="scss" scoped>
.load-more {
	color: #4b6797 !important;
	text-decoration: underline;
	display:block;
}
.load-more-file {
	color:#fff;
	text-decoration: underline;
	display:block;
}

.room-bubble-file {
	// background-color: #e67e22 !important;
	background-color: #4b6797 !important;
	color: #fff;
}
.message-error {
	color: #c0392b !important;
}
.chat-pop-block {
	display: inline-block !important
}
</style>
