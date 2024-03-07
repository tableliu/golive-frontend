<template lang="html">
  <v-dialog
    v-model="model.show"
    width="300"
    persistent
  >
    <v-card>
      <div v-if="model.important">
        <v-card-title
          style="color:red"
          class="headline grey lighten-2"
          primary-title
        >
          {{'！' + model.title}}
        </v-card-title>

        <v-card-text style="color:red">
          {{'警告：' + model.msg}}
        </v-card-text>
      </div>
      <div v-else>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          {{model.title}}
        </v-card-title>

        <v-card-text>
          {{model.msg}}
        </v-card-text>
      </div>

      <v-divider></v-divider>

      <v-card-actions v-if="type.model === 'confim'">
        <v-spacer></v-spacer>
        <div v-if="type.func">
          <v-btn
            color="primary"
            flat
            @click="type.func(true, type.payload)"
          >
            {{ model.confimText || '确定'}}
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="type.func(false, type.payload)"
          >
            {{ model.cancelText || '取消' }}
          </v-btn>
        </div>
        <div v-else>
          <v-btn
            color="primary"
            flat
            @click="model.show = false"
          >
            {{ model.confimText || '确定'}}
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="model.show = false"
          >
            {{ model.cancelText || '取消' }}
          </v-btn>
        </div>
      </v-card-actions>
      <v-card-actions v-else>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="model.show = false;type.func && type.func(false, type.payload)"
        >
          {{ model.confimText || '确定'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: {
				show: false,
				type: '',
				title: '',
				msg: '',
        confimText: '确定',
        cancelText: '取消',
      },
      required: true
    },
    type: {
      type: Object,
      default: {
        model: 'confim'
      }
    }
  },
  watch: {
    model: function(e) {
      let _this = this
      if(this.type === 'alert') {
        if(e.show === true) {
          setTimeout(v => _this.model.show = false, 2000)
        }
      }
    }
  },
  mounted() {
  }
}
</script>

<style lang="css">
</style>
