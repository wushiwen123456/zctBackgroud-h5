<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <!-- <sticky :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
      </sticky> -->

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name">
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="90px" label="发布时间:" prop="display_time" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="封面图片:" label-width="90px" prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" :height="400" v-model="postForm.content" />
        </el-form-item>
        <el-form-item>
        <el-button :loading="loading" type="primary" style="width:160px; text-align:center" @click.native.prevent="submitForm">
          {{subBtnName}} 
        </el-button>
    </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/TinymceAll'
import Upload from '@/components/Upload/singleImage2'
import MDinput from '@/components/MDinput'
// import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/util/validate'
import { publishArticle, updateArticle, fetchArticle } from '@/api/index'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        // image_uri: [{ validator: validateRequire }],
        // title: [{ validator: validateRequire }],
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        display_time: [{ required: true, message: '请选择发布时间', trigger: 'blur' }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    lang() {
      return this.$store.getters.language
    },
    subBtnName(){
      return this.isEdit ? '修 改' : '发 布'
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm.id = response.data.id
        this.postForm.title = response.data.title
        this.postForm.content = response.data.content
        this.postForm.image_uri = response.data.index_img
        this.postForm.display_time = new Date(response.data.display_time * 1000)
        
        // Set tagsview title
        // this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm() {
      //this.postForm.display_time = parseInt(this.display_time / 1000)
      
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.display_timestamp = this.postForm.display_time.getTime() / 1000
          if (this.postForm.image_uri == ''){
            this.postForm.image_uri = 'uploads/default_index_image.png'
          }
          if (this.isEdit) {
            updateArticle(this.postForm).then( res => {
              if (res.code == 200) {
                this.$message({
                  message: '修改文章成功',
                  type: 'success'
                })
              }
            })
          } else {
            publishArticle(this.postForm).then( res => {
              if (res.code == 200) {
                this.$message({
                  message: '发布文章成功',
                  type: 'success'
                })
              }
            })
          }
          
          this.loading = false
        } else {
          console.log('validate failed!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      // userSearch(query).then(response => {
      //   if (!response.data.items) return
      //   this.userListOptions = response.data.items.map(v => v.name)
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 10px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      &:after {
      content: "";
      display: table;
      clear: both;
    }
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
