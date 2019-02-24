<template>
  <div class="app-container">
    <el-scrollbar>
      <div class="user-reply">
        <div>
          <span>测试用户</span>
          <span>2019-02-24 02:03</span>
        </div>
        <div class="content-reply">
          <span>
              亲爱哒~ 店铺左边有具体的分类指示，你喜欢哪个分类都可以点击进去查找，如果没有你的心爱宝贝，也可以在搜索引擎框内打入你想找的宝贝关键字如：“雨伞”，你想要的宝贝就会为您呈现哦。
          </span>
        </div>
      </div>
      <div class="admin-reply">
        <div>
          <span>测试用户</span>
          <span>2019-02-24 02:03</span>
        </div>
        <div class="content-reply">
          <span>
            亲爱哒~ 店铺左边有具体的分类指示，你喜欢哪个分类都可以点击进去查找，如果没有你的心爱宝贝，也可以在搜索引擎框内打入你想找的宝贝关键字如：“雨伞”，你想要的宝贝就会为您呈现哦。
          </span>
        </div>
      </div>
      <div style="clear:both"></div>
      <div class="user-reply">
        <div>
          <span>测试用户</span>
          <span>2019-02-24 02:03</span>
        </div>
        <div class="content-reply">
          <span>
              亲爱哒~ 店铺左边有具体的分类指示，你喜欢哪个分类都可以点击进去查找，如果没有你的心爱宝贝，也可以在搜索引擎框内打入你想找的宝贝关键字如：“雨伞”，你想要的宝贝就会为您呈现哦。
          </span>
        </div>
      </div>
      <div class="user-reply">
        <div>
          <span>测试用户</span>
          <span>2019-02-24 02:03</span>
        </div>
        <div class="content-reply">
          <span>
              亲爱哒~ 店铺左边有具体的分类指示，你喜欢哪个分类都可以点击进去查找，如果没有你的心爱宝贝，也可以在搜索引擎框内打入你想找的宝贝关键字如：“雨伞”，你想要的宝贝就会为您呈现哦。
          </span>
        </div>
      </div>
      <div class="user-reply">
        <div>
          <span>测试用户</span>
          <span>2019-02-24 02:03</span>
        </div>
        <div class="content-reply">
          <span>
              亲爱哒~ 店铺左边有具体的分类指示，你喜欢哪个分类都可以点击进去查找，如果没有你的心爱宝贝，也可以在搜索引擎框内打入你想找的宝贝关键字如：“雨伞”，你想要的宝贝就会为您呈现哦。
          </span>
        </div>
      </div>
      <div class="admin-reply">
        <div>
          <span>测试用户</span>
          <span>2019-02-24 02:03</span>
        </div>
        <div class="content-reply">
          <span>
            亲爱哒~ 店铺左边有具体的分类指示，你喜欢哪个分类都可以点击进去查找，如果没有你的心爱宝贝，也可以在搜索引擎框内打入你想找的宝贝关键字如：“雨伞”，你想要的宝贝就会为您呈现哦。
          </span>
        </div>
      </div>
      <div style="clear:both"></div>
      </el-scrollbar>
      <el-input placeholder="请输入回复内容按回车发送" v-model="listQuery.phone" class="filter-item" style="margin-top:30px;width: 100%;"  @keyup.enter.native="handleFilter"/>
  </div>
</template>
<style>
.user-reply{
  margin-top: 15px;
  padding: 10px;
  max-width: 500px;
  border-radius: 5px;
  background-color: rgba(144, 147, 153, 0.1);
  border-color: rgba(144, 147, 153, 0.2);
  color: #909399;
}
.content-reply{
  margin-top: 5px;
}
.admin-reply{
  float: right;
  margin-top: 15px;
  margin-right: 80px;
  padding: 10px;
  max-width: 500px;
  border-radius: 5px;
  background-color: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}
</style>


<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'CreateForm',
  components: { ArticleDetail },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },      
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
   }
  },
  created() {
    this.getFeedbacks()
  },
  methods: {
    getFeedbacks(){
      this.listLoading = true
      getFeedbacks(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        if (this.list.length == this.listQuery.limit)
          this.listQuery.limit++
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getFeedbacks()
    },
    modifyNewsStatus(row) {

      let title = ''
      if (row.status == 0)
        title = '当前操作将会下架该文章，是否继续？'
      else 
        title = '当前操作将会上架该文章，是否继续？'

      this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          modifyNewsStatus(row.id).then(res => {
          if (res.code == 200) {
              this.$message({
                message: res.data.desc,
                type: 'success'
              })
              row.status = res.data.status
            } else {
              this.$message({
                message: res.error,
                type: 'warn'
              })
            }
          })
          
        }).catch(() => {
        });
    }
  },
}
</script>

