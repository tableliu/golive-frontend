<template lang="html">
  <v-card :class=" borderShadow || 'card-table'">
    <v-container
      fluid
      grid-list-md
    >
      <v-layout row wrap>
        <v-flex
          v-for="card in cards"
          v-bind="{ [`xs12 md${card.flex} `]: true }"
          :key="card.id"
          style="margin-bottom:20px;"
        >
          <h1 :class="flat ? '' : 'card-title'" class="text-center" v-if="type === 'view' && card.images && card.images !== ''">步骤{{card.step}}</h1>
          <v-card
            @click.native="clickHandel(cards, card, 'click')"
            @mouseover="clickHandel(cards, card, 'mouseover')"
            @mouseout="clickHandel(cards, card, 'mouseout')"
            :width="width"
            class="card-center card-hover"
            elevation="7"
            :style="card.style"
          >
          <div v-if="card.images && card.images !== ''">
              <label v-if="type === 'edit' && card.type === 'edit'" :for="card.id">
                <v-img
                  :src="card.images"
                  :height="width * 0.85"
                  :width="width"
                >
                  <v-container
                    fill-height
                    fluid
                    pa-2
                  >
                  </v-container>
                </v-img>
              </label>
              <v-img v-if="type === 'view' || card.type === 'view'"
                :src="card.images"
                :height="width * 0.85"
                :width="width"
              >
                <v-container
                  fill-height
                  fluid
                  pa-2
                >
                </v-container>
              </v-img>
              <input v-if="type === 'edit' && card.type === 'edit'" :id="card.id" :ref="'uploadFile' + card.id" @change="uploadFile(card.id)" type="file" name="" value="">
          </div>
            <v-card-title v-if="type === 'edit' && card.type === 'edit'">
              <h2 :class="flat ? '' : 'card-title'" class="text-center" v-if="card.showtitle">{{(card.showtitle || '') + card.step}}</h2>
              <!-- <v-text-field v-if="card.isLoad" readonly class="headline primary--text text-center" v-model="card.title" :label="card.label.title"></v-text-field> -->
              <v-text-field clearable class="headline primary--text text-center" v-model="card.title" :label="card.label.title"></v-text-field>
							<v-text-field clearable class="headline primary--text text-center" v-model="card.describe" :label="card.label.text"></v-text-field>
              <slot :card="card" name="editForms"></slot>
						</v-card-title>
            <v-card-title v-if="type === 'view' || card.type === 'view'">
              <h2 :class="flat ? '' : 'card-title'" class="text-center" v-if="card.showtitle">{{(card.showtitle || '') + card.step}}</h2>
              <h3 :class="flat ? '' : 'card-title'" class="headline primary--text text-center">{{card.title}}</h3>
              <p class="mb-0 card-text">{{card.describe}}</p>
              <slot :card="card" name="viewForms"></slot>
            </v-card-title>
            <v-card-actions  v-if="type === 'edit'">
              <v-btn style="color:#fff" v-if="card.type === 'edit'" :color="btnColor" large @click.stop="upload ? upload(card) : false" :loading="card.uploadLoading">
                保 存
              </v-btn>
              <v-spacer></v-spacer>
              <v-tooltip top v-for="(item, index) in action" :key="index">
                <template v-slot:activator="{ on }" >
                  <v-btn v-on="on" icon large :disabled="item.disabled" @click.stop="item.func(card)">
                      <v-icon>{{item.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{item.tooltip}}</span>
              </v-tooltip>
              <!-- <v-btn icon large v-for="(item, index) in action" @click.stop="item.func(card)" :key="index">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">{{item.icon}}</v-icon>
                  </template>
      						<span>{{item.tooltip}}</span>
      					</v-tooltip>
              </v-btn> -->
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs3 sm3 md3>
          <slot name="after"></slot>
        </v-flex>
      </v-layout>
    </v-container>
    <slot></slot>
  </v-card>
</template>

<script>
import Axios from 'axios'
export default {
  props:{
    type: {
       type: String,
       required: true,
       default: 'view'
    },
    cards: {
      type: Array,
      required: true,
      default: []
    },
    width: {
      type: Number,
      default: 708
    },
    action: {
      type: Array,
      default: () => []
    },
    upload: {
      type: Function
    },
    clickHandel: {
      type: Function
    },
    btnColor: {
      type: String,
      default: '#3085DA'
    },
    borderShadow: {
      type: Boolean,
      default: true
    },
    flat: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {

    }
  },
  mounted() {
  },
  methods:{
    uploadFile(e) {
      let _this = this
      const targetId = `uploadFile${e}`
      let target = this.$refs[targetId][0]
      let files = target.files[0]
      const cardId = parseInt(target.id)
      let size = Math.floor(files.size / 1024)
      let fileReader = new FileReader()
      if (size > 2*1024*1024) {
        alert('请选择2M以内的图片！')
        return false
      }
      fileReader.onload = function(e) {
        let imgBase = e.target.result
        for(let i = 0; i < _this.cards.length; i++) {
          if(_this.cards[i].id === cardId) {
            _this.cards[i].images = imgBase
            _this.cards[i].replaceImg = true
            break
          }
        }
        target.value = null
      }
      fileReader.readAsDataURL(files)
    }
  }
}
</script>

<style lang="css">
  .card-center {
    margin: 0 auto;
    width: 100%;
    text-align: left;
    height: max-content !important;
  }
  .text-center {
    margin: 0 auto;
    width: 100%;
    text-align: left;
  }
  input[type=file] {
    display: none
  }
  .card-title{
    margin: 20px auto;
  }
  .text-center{
    text-align: center;
  }
  .card-text{
    text-align: center;
    margin: 20px auto;
    width: 100%;
  }
  @media(max-width:960px){
    .card-title{
      text-align: center;
      margin: 0 !important;
    }
    .v-card__title {
      padding: 0 !important;
    }
    .text-center {
      margin: 0 10px;
    }
  }
</style>
