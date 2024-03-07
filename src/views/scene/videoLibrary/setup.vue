<template lang="html">
  <div>
    <page-title-bar></page-title-bar>
    <h1 class="card-title">《{{ this.power.name || '' }}》</h1>
    <Card
      type="edit"
      :width=600
      :cards="cards"
      :action="action"
      :upload = "upload"
      :clickHandel="(()=>null)"
    >
      <message
      :model = "message"
      :type = "messageType"
      ></message>

    </Card>
  </div>

</template>

<script>
import Card from '@/components/Card/Card'
import Axios from 'axios'
export default {
  components: {
    Card
  },
  data() {
    return {
      cards: [],
      defaultCards:{id:1, title: '', label:{title:'标题：', text: '内容：'}, describe:'', type:'edit', flex: 6, replaceImg: false, step: 1, showtitle: '步骤' },
      defaultFlex: 4,
      action:[
        {icon: 'edit', tooltip: '编辑/预览',func: this.toggle },
        {icon: 'add', tooltip: '添加',func: this.create },
        {icon: 'add_to_photos', tooltip: '复制',func: this.copy },
        {icon: 'delete', tooltip: '刪除',func: this.delete }
      ],
      message: {
				show: false,
				type: 'confim',
				title: '确认删除',
				msg: '确认删除此步骤？'
			},
      messageType: {model: 'confim', func: this.checked},
      stepId: null,
      power: {}
    }
  },
	beforeMount() {
		// 获取url参数
		const param = this.getQuery
    this.power = param
		this.searchClass = new this.$Search({
			type: 'get',
			path: `video-job/step-index?v_id=${parseInt(param.id)}&iipsearch=true`,
			body: {}
		}, 10000)
		this.paginationAll = this.searchClass.getDefaultPagination()
	},
  mounted(){
    this.getPageData()
  },
  computed: {
		getQuery() {
			// 获取url参数
      const params = this.$router.history.current.params
      return params
    }
  },
  methods: {
    getPageData() {
      const _this = this
      Axios.get('video-job/step-index?v_id=' + this.power.id)
      .then(res => {
        if (res.data.code === 1) {
          const dat = res.data.data
          if(dat !== '' && dat){
            for (let i = 0; i < dat.length; i++) {
              dat[i].sid = dat[i].id
              dat[i].flex = _this.defaultCards.flex
              dat[i].type = 'view'
              dat[i].isSave = true
              dat[i].describe = dat[i].content
              dat[i].label = _this.defaultCards.label
              dat[i].replaceImg = false
              dat[i].showtitle = _this.defaultCards.showtitle
              if(dat[i].images === null || dat[i].images === '') dat[i].images = _this.defaultCards.images
            }
            _this.cards = dat
          }else {
            _this.createDefaultCard()
          }
        }
      })
    },
    toggle(e) {
      e.type = e.type === 'edit' ?  'view' : 'edit'
    },
    delete(e) {
      this.stepId = e.id
      this.messageType = {model: 'confim', func: this.checked}
      this.message = {
				show: true,
				type: 'confim',
				title: '确认删除',
				msg: '确认删除此步骤？'
			}
    },
    createDefaultCard() {
      const card = Object.assign({}, this.defaultCards)
      card.setp = 1
      this.cards = [card]
    },
    create(e) {
      let obj = Object.assign({}, this.defaultCards)
      obj.id = this.cards[this.cards.length -1].id + 1
      obj.step = e.step + 1
      obj.type = 'edit'
      this.cards.splice(e.step, 0, obj)
      for (let i = obj.step; i < this.cards.length; i++) {
        this.cards[i].step++
      }
    },
    copy(e) {
      let obj = Object.assign({}, e)
      obj.id = this.cards[this.cards.length -1].id + 1
      obj.step = e.step + 1
      obj.type = 'edit'
      this.cards.splice(e.step, 0, obj)
      for (let i = obj.step; i < this.cards.length; i++) {
        this.cards[i].step++
      }
    },
    checked(e) {
      const _this = this
      this.message.show = false
      if(e) {
        let column = _this.cards.filter((elt, index) => {
            elt.index = index
            return elt.id === this.stepId
        })
        if(column[0].isSave === true){
          Axios.post(`video-job/step-delete?id=${this.stepId}`)
          .then(res => {
            if(res.data.code === 1){
              _this.cards.splice(column[0].index, 1)
    					_this.$store.commit('setRequest', {
    						valid: false,
    						url: `video-job/step-delete`,
    						type: 'success',
    						msg: '删除成功.'
    					})
              this.getPageData()
            }else {
    					_this.$store.commit('setRequest', {
    						valid: false,
    						url: `video-job/step-delete`,
    						type: 'error',
    						msg: '刪除失敗.'
    					})
            }
          })
        }else{
          _this.cards.splice(column[0].index, 1)
          _this.createDefaultCard()
          _this.$store.commit('setRequest', {
            valid: false,
            url: `video-job/step-delete`,
            type: 'success',
            msg: '删除成功.'
          })
        }
      }
    },
    upload(e) {
      let _this = this
      if (e.isSave) {
        const sendData = {
          title: e.title,
          content: e.describe
        }
        Axios.post(`video-job/step-update?id=${e.id}`, sendData)
        .then(res => {
          if(res.data.code === 1) {
            _this.cards[e.step-1].type='view'
            _this.cards[e.step-1].isSave=true
  					_this.$store.commit('setRequest', {
  						valid: false,
  						url: `video-job/step-save`,
  						type: 'success',
  						msg: '步骤保存成功.'
  					})
          }
        })

      }else {
        const sendData = {
          v_id: _this.power.id,
          step: e.step,
          title: e.title,
          content: e.describe
        }
        Axios.post('video-job/step-save', sendData)
        .then(res => {
          if(res.data.code === 1) {
            _this.cards[e.step-1].type='view'
            _this.cards[e.step-1].isSave=true
  					_this.$store.commit('setRequest', {
  						valid: false,
  						url: `video-job/step-save`,
  						type: 'success',
  						msg: '步骤保存成功.'
  					})
          }
        })
      }
      setTimeout(() => {
        _this.getPageData()
      }, 1000)
    }
  }
}
</script>

<style lang="css">
  .upload {
    width: 50%;
    margin: 0 25% 50px 25%;
    letter-spacing: 5px;
  }
</style>
