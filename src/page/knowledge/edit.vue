<template>
  <article-detail :edit_id="id"/>

</template>
<style>
.el-form-item__label{
  width: 90px!important;
  text-align: left;
}
.extend{
  overflow: auto;
}
</style>


<script>
import ArticleDetail from './components/ArticleDetail'
import {fetchArticle} from '@/api/index'
export default {
  name: 'EditForm',
  components: { ArticleDetail },
  data(){
    return {
      id:''
    }
  },
  created(){
    this.id = this.$route.params.id || ''
  }
}
</script>

