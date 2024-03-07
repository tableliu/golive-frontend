<!-- 组件(已弃用) -->
<!-- 房间内邀请 -->
<template>
  <div>
    <!-- 邀请提示音 -->
    <toast-bgm :src="bmgSource"></toast-bgm>
    <!-- 邀请人员进入情况悬浮页面-->
    <Calling :items="invitePeopleEnter.items" :dialog="invitePeopleEnter.dialog" show-enter>
      <template v-slot:actions>
        <v-btn v-if="showClose" color="blue darken-1" flat @click.native="invitePeopleEnter.dialog=false">{{ $t('message.close') }}</v-btn>
        <v-btn v-else  style="background:#e74c3c !important;" flat @click.native="stopCalling">{{ $t('message.cancel') }}</v-btn>
      </template>
    </Calling>
    <v-dialog v-model="dialog" max-width="400px" light persistent>
      <v-card class="v-card-table">
        <v-card-title>
          <span class="card-title">{{ $t("message['Invite people from PC to join the room']") }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <Search
                item-value="id"
                @bindModel="loadInviteSearch"
                :label="$t('message.SelectOnlinePersonnelOnPC')"
                :placeholder="$t('message.TypeKeywordToSearch')"
                :multiple="true"
                :clickHandler="loadInvite"
                :loading="inviteLoading"
                :items="inviteItems"
                :vModelEdit="edited.editedItem.invite"
                @remove="removeInvite"
                :prestrain="false"
                chip
                multiple
              >
              </Search>
              <!-- <v-btn @click.stop="personClickHandel(item)" color="#fff" flot left class="btn-large">
                  <v-icon color="#4A7CAF" class="v-icon-active">group_add</v-icon>
                  <span class="btn-font-color">邀请并新建房间</span>
                </v-btn> -->
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="v-card-actions-buttons">
            <v-btn :disabled="valid" flat @click.native="save">{{ $t('message.confim') }}</v-btn>
            <v-btn color="blue darken-1" flat @click.native="close">{{ $t('message.cancel') }}</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Search from '@/components/SearchInput'
import Calling from './calling.vue'
import ToastBgm from '@/components/Toast/bgm.vue'
export default {
  props: {
    dialog: Boolean,
    people: Array,
    roomId: Number
  },
  components: {
    Search,
    Calling,
    ToastBgm
  },
  data: () => ({
    bmgSource: '',
    inviteLoading: false,
    inviteItems: [
      // { header: 'PC端在线人员' },
      // { id: 1, name: '张三', logo: 'https://cdn.vuetifyjs.com/images/lists/1.jpg', logoType: 'img' },
      // { id: 2, name: '李四', logo: 'https://cdn.vuetifyjs.com/images/lists/2.jpg', logoType: 'img' },
      // { id: 3, name: '王五', logo: 'https://cdn.vuetifyjs.com/images/lists/3.jpg', logoType: 'img' },
      // { id: 4, name: '马六', logo: 'https://cdn.vuetifyjs.com/images/lists/4.jpg', logoType: 'img' }
    ],
    inviteItemsOrigin: [
      // { id: 1, name: '张三', logo: 'https://cdn.vuetifyjs.com/images/lists/1.jpg', logoType: 'img' },
      // { id: 2, name: '李四', logo: 'https://cdn.vuetifyjs.com/images/lists/2.jpg', logoType: 'img' },
      // { id: 3, name: '王五', logo: 'https://cdn.vuetifyjs.com/images/lists/3.jpg', logoType: 'img' },
      // { id: 4, name: '马六', logo: 'https://cdn.vuetifyjs.com/images/lists/4.jpg', logoType: 'img' }
    ],
    edited: {
      editedIndex: -1,
      editedItem: {
        invite: []
      },
      defaultItem: {
        invite: []
      }
    },
    invitePeopleEnter: {
      dialog: false,
      items: []
    }
  }),
  computed: {
    ...mapGetters(["getSocketCode"]),
    valid() {
      const invite = this.edited.editedItem.invite
      switch (typeof invite) {
        case 'string':
          if (invite && invite !== '') {
            return false
          }
        case 'object':
          if (invite instanceof Array) {
            if (invite && invite.length > 0) {
              return false
            }
          }
          break
        default :
          if (invite) {
            return false
          }
      }
      return true
    },
    showClose() {
      const notEnter = this.invitePeopleEnter.items.find(item => {
        return item.state === 0
      })
      if (!notEnter) {
        this.closeBgm()
      }
      return !notEnter
    },
    remaininvitePeople() {
      const remaining = this.invitePeopleEnter.items.filter(item => {
        return item.state === 0
      })
      return remaining
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.edited.editedItem.invite = [...this.edited.editedItem.defaultItem]
        this.inviteItems = []
      }
    }
  },
  mounted() {
  },
  methods: {
    save() {
      const _this = this
      const invite = this.edited.editedItem.invite
      this.$axios.post(`live/invite-watcher`, {
        room_id: _this.roomId,
        invited_user_ids: invite,
        invite_user_wamp_session_id: _this.getSocketCode('liveshow')
      })
      .then(res => {
        if (res.data.code === 1) {
          _this.openBgm()
          let arr = []
          const inviteItems = _this.inviteItemsOrigin.filter(item => {
            return invite.includes(parseInt(item.user_id))
          })
          inviteItems.forEach(item => {
            arr.push({
              id: item.id,
              user_id: item.user_id,
              name: item.full_name,
              state: 0,
              avatar: _this.$getImageLocation(item.avatar, 'avatar'),
              answer: false
            })
          })
          _this.$emit('onCalled',arr)
          _this.edited.editedItem.invite = [..._this.edited.defaultItem.invite]
          _this.invitePeopleEnter.items = arr
          _this.invitePeopleEnter.dialog = true
        }
      })
    },
    close() {
      this.$emit('close')
    },
    loadInviteSearch(e) {
      this.edited.editedItem.invite = e
    },
    loadInvite() {
      const _this = this
      this.inviteLoading = true
      this.$axios.get('live/web-online-users')
      .then(res => {
        if (res.data.code === 1) {
          let arr = []
          const dat = res.data.data
          _this.inviteItemsOrigin = dat
          arr.push({ header: _this.$t("message['Online Personnel On PC']") })
          // 如果不是当前房间的人员
          const isPeopleInTheRoom = function(e_id){
            if (_this.prople) {
              const f = _this.prople.find(p => {
                return parseInt(p.user_id) === parseInt(e_id)
              })
              return f ? true : false
            }
            return false
          }
          dat.forEach(item => {
            if(!isPeopleInTheRoom(item.user_id)){
              arr.push({
                id: item.user_id,
                name: item.user_name + (item.full_name ? ` (${item.full_name}) ` : '') ,
                logo: _this.$getImageLocation(item.avatar, 'avatar'),
                logoType: 'img'
              })
            }
          })
          _this.inviteItems = arr
        }
      })
      .finally(() => {
        _this.inviteLoading = false
      })
    },
    removeInvite(e) {
      const list = this.edited.editedItem.invite
      list.filter((item, index) => {
        if (item === e.id) {
          list.splice(index, 1)
        }
      })
    },
    stopCalling() {
      const _this = this
      this.invitePeopleEnter.dialog = false
      let invited_user_ids = []
      _this.remaininvitePeople.forEach((item, i) => {
        invited_user_ids.push(item.user_id)
      });

      this.hangupBgm()
      const sendData = {
        room_id: _this.roomId,
        invited_user_ids,
        invite_user_wamp_session_id: _this.getSocketCode('liveshow')
      }
      this.$axios.post('live/invite-watcher-cancel', sendData)
      .then(res => {
        if (res.data.code === 1) {
          _this.$store.commit('setRequest', {
  					valid: false,
  					url: ``,
  					type: 'success',
  					msg: _this.$t("message['Successfully cancel the invitation to the remaining viewers']")
  				})
        }else {
          _this.$store.commit('setRequest', {
  					valid: false,
  					url: ``,
  					type: 'error',
  					msg: _this.$t("message['Failed cancel the invitation to the remaining viewers']")
  				})
        }
      })
    },
    openBgm() {
      // 打开呼叫音乐
      this.bmgSource = "/static/sound/calling.mp3"
    },
    closeBgm() {
      // 关闭呼叫音乐
      this.bmgSource = ""
    },
    hangupBgm() {
      // 打开挂断音乐,并在1秒后关闭
      const _this = this
      this.bmgSource = "/static/sound/hangup.wav"
      setTimeout(() => {
        _this.closeBgm()
      },1000)
    }
  }
}
</script>
