<template>
  <div class="singleImageUpload2 upload-container">
    <el-upload
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      class="image-uploader"
      drag
      action="https://zct.51kdd.com/admin/upload">
      <i class="el-icon-upload"/>
      <div class="el-upload__text">Drag或<em>点击上传</em></div>
    </el-upload>
    <div v-show="imageUrl.length>0" class="image-preview">
      <div v-show="imageUrl.length>1" class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/api/index'

export default {
  name: 'SingleImageUpload2',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' }
    }
  },
  computed: {
    imageUrl() {
      return this.value == '' ? '' : "https://zct.51kdd.com/" + this.value 
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(file) {
      this.emitInput(file.data)
    },
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
					console.log(response)
          const key = response.data.qiniu_key
          const token = response.data.qiniu_token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          this.tempUrl = response.data.qiniu_url
          resolve(true)
        }).catch(() => {
          reject(false)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  width: 360px;
  height: 180px;
  position: relative;
  .image-uploader {
    height: 100%;
  }
  .image-preview {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;
    .image-preview-wrapper {
      position: relative;
      width: 360px;
      height: 180px;
      img {
        width: 100%;
        height: 100%;
        
      }
    }
    .image-preview-action {
      position: absolute;
      width: 360px;
      height: 180px;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
