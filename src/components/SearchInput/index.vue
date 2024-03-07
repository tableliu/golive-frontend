<template>
    <v-autocomplete
      @click.stop="clickHandler(payload)"
      @click:clear="clearHandler"
      v-model="searchModel"
      :items="items"
      box
      chips
      no-data-text="没有匹配项"
      :loading="loading"
      color="blue-grey lighten-2"
      :label="label"
      :placeholder="placeholder"
      item-text="name"
      :item-value="itemValue ? itemValue : 'name'"
      :multiple="multiple"
      :clearable="!noClearable"
    >
      <template
        slot="selection"
        slot-scope="data"
      >
        <div v-if="!chip">
          <div v-show="false" name="selectedId">{{ data.item.id }}</div>
          {{ data.item.name }}
        </div>
        <v-chip v-else
          :selected="data.selected"
          close
          class="chip--select-multi"
          @input="remove(data.item)"
        >
          <v-avatar>
            <img :src="data.item.logo">
          </v-avatar>
          <div v-show="false" name="selectedId">{{ data.item.id }}</div>
          {{ data.item.name }}
        </v-chip>
      </template>
      <template
        slot="item"
        slot-scope="data"
      >
        <template v-if="typeof data.item !== 'object'">
          <v-list-tile-content v-text="data.item"></v-list-tile-content>
        </template>
        <template v-else>
          <v-list-tile-avatar v-if="data.item.logo">
            <v-icon v-if="data.item.logoType === 'icon'">{{data.item.logo}}</v-icon>
            <img v-else :src="data.item.logo"></img>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
            <v-list-tile-sub-title class="group" v-html="data.item.group"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </template>
    </v-autocomplete>
</template>

<script>
  export default {
    props: {
      vModel: Function,
      vModelEdit: [String, Array],
      items: Array,
      loading: Boolean,
      label: String,
      placeholder: String,
      itemValue: String,
      payload: [String, Array, Object, Number, Function],
      multiple: {
  			default: false,
  			type: Boolean
  		},
      clickHandler: {
        type: Function,
        default: ()=> {

        }
      },
      prestrain: {
        type: Boolean,
        default: true
      },
  		chip: {
  			default: false,
  			type: Boolean
  		},
      noClearable: Boolean
  	},
    data () {
      return {
        searchModel: null,
        name: 'Midnight Crew'
      }
    },
    mounted() {
      if (this.clickHandler && this.prestrain) {
        this.clickHandler()
      }
      this.searchModel = this.vModelEdit
    },
    watch: {
      searchModel() {
        if(this.searchModel) {
          this.stopWatch = false
        }
        if (!this.stopWatch) {
          this.$emit('bindModel', this.searchModel, this.payload)
        }
      },
      vModelEdit() {
        if(!this.vModelEdit || this.vModelEdit.length < 1) {
          this.removeAll()
        }else {
          this.stopWatch = false
        }
        this.searchModel = this.vModelEdit
      }
    },
    methods: {
      clearHandler() {
        this.$emit('clear')
      },
      remove (item) {
        let index
        switch(typeof this.searchModel) {
          case 'string':
            this.searchModel = []
          break
          case 'object':
            if (this.searchModel instanceof Array) {
              index = this.searchModel.indexOf(item.name)
            }
          break
          default:
            this.searchModel = []
          break
        }
        if (index >= 0) {
          this.searchModel.splice(index, 1)
        }
        this.$emit('remove', item)
      },
      removeAll () {
        this.stopWatch = true
        this.searchModel = []
      }
    }
  }
</script>
<style media="screen">
  .group {
    color: #ccc !important;
    font-size: 0.75rem !important;
  }
</style>
