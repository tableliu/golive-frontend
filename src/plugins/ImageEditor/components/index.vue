<template>
    <v-dialog v-model="dialog" max-width="1000px" max-height="700px">
      <v-card class="v-card-table">
        <div class="imageEditorApp">
            <tui-image-editor ref="tuiImageEditor"
              :include-ui="useDefaultUI"
              :options="options"
              @addText="onAddText"
              @objectMoved="onObjectMoved"
              @init="imageEditorInit"
            >
            </tui-image-editor>
            <v-btn @click="sendCaptureFile" color="#4A7BAF" class="d-inline-flex float-right image-editor-send-btn">
              <v-icon color="#fff">send</v-icon>
              <span class="login-font-white">{{ $t("message.send") }}</span>
            </v-btn>
        </div>

      </v-card>
    </v-dialog>
</template>

<script>
// To use the default UI, the svg files for the icons is required.
import 'tui-image-editor/dist/svg/icon-a.svg';
import 'tui-image-editor/dist/svg/icon-b.svg';
import 'tui-image-editor/dist/svg/icon-c.svg';
import 'tui-image-editor/dist/svg/icon-d.svg';

// Load Style Code
import 'tui-image-editor/dist/tui-image-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import ImageEditor from './editor.vue';
import { locale_zh_cn } from '../lang/cn';
import { blackTheme } from '../js/black-theme'

export default {
  components: {
    'tui-image-editor': ImageEditor
  },
  props: {
    name: {
      type: String,
      default: 'default'
    },
    path: {
      type: String,
      default: 'static/img/agency-welcome.png'
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      useDefaultUI: true,
      loading: false,
      options: {
        includeUI: {
          loadImage: {
            path: '/static/img/none.png',
            name: 'default',
            includeUI: {
              uiSize: {
                width: this.getClientWidth,
                height: this.getClientHeight
              }
            }
          },
          locale: locale_zh_cn,
          theme: blackTheme,
          // initMenu: 'filter'
        },
        cssMaxWidth: 800,
        cssMaxHeight: 600
      }
    };
  },
  mounted() {
    this.mode = process.env.NODE_ENV === "production"
  },
  watch: {
    path() {
      const _this = this
      if (_this.editorInstance) {
        _this.editorInstance.loadImageFromURL(_this.path, _this.name).then(sizeValue => {
            exitCropOnAction();
            _this.editorInstance.ui.initializeImgUrl = _this.path;
            _this.editorInstance.ui.resizeEditor({imageSize: sizeValue});
            _this.editorInstance.clearUndoStack();
        })
        // _this.editorInstance.addImageObject(_this.path).then(result => {
        //   _this.editorInstance.setObjectProperties(result.id, {
        //     width: 800,
        //     height: 550
        //   });
        // })
      }
    },
    dialog() {
      !this.dialog && this.removeImg()
    }
  },
  computed: {
    getClientHeight() {
      return document.documentElement.clientHeight * 0.85
    },
    getClientWidth() {
      return document.documentElement.clientWidth * 0.85
    }
  },
  methods: {
    imageEditorInit(e) {
      this.editorInstance = e
    },
    sendCaptureFile() {
      const dataURL = this.editorInstance.toDataURL()
      this.$emit('send', dataURL)
    },
    removeImg() {
      this.editorInstance.removeActiveObject()
    },
    onAddText(res) {
      /* eslint-disable no-console */
      if (!this.mode) {
        console.group('addText');
        console.log('Client Position : ', res.clientPosition);
        console.log('Origin Position : ', res.originPosition);
        console.groupEnd();
      }
      /* eslint-enable no-console */
    },
    onObjectMoved(res) {
      /* eslint-disable no-console */
      if (!this.mode) {
        console.group('objectMoved');
        console.log('Left : ', res.left);
        console.log('Top : ', res.top);
        console.groupEnd();
      }
      /* eslint-enable no-console */
    }
  }
};
</script>
<style scoped>
.imageEditorApp {
    width: 100%;
    height: 100%;
}
.image-editor-send-btn {
  position: absolute;
  right: 15px;
  top: 91%;
  z-index: 9999999;
}
</style>
<style media="screen">
  .tui-image-editor-canvas-container canvas {
    max-width: 1000px;
    max-height: 700px;
  }
  .tui-image-editor-container .tui-image-editor-main {
    top: 10px;
  }
</style>
