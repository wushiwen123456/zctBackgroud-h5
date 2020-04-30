<template>

  <div class="app-container">
    <el-scrollbar>
    <div class="filter-container">
      <router-link :to="'/assemble/add'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">添 加</el-button>
      </router-link>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团名称" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="参团人数" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.number }}</el-tag>
        </template>
      </el-table-column>
			 <el-table-column label="折扣" align="center" min-width="150px">
			  <template slot-scope="scope">
			    <el-tag>{{ scope.row.discount }}</el-tag>
			  </template>
			</el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/assemble/edit/'+scope.row.id">
            <el-button type="primary" size="small">编辑团购</el-button>
          </router-link>
          <el-button type="danger"  size="small" @click="deleted(scope.row.id)">删除团购</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-scrollbar>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getArticles" />

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
  .index-img{
    width:180px;
    height: 90px;
  }
  .el-table__body-wrapper{
    width: auto;
    display: inline-block;
    vertical-align: bottom;
  }
  .el-table{
    display: inline-block;
    width: auto;
    max-width: fit-content;
  }
</style>

<script>
import { groupList, deleteAssemble } from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/util'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'NewsList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status, type) {
      if (type == 0) {
        const statusMap = {
            0: 'success',
            1: 'danger'
          }
        return statusMap[status]
      } else {
        const statusMap = {
            0: '已发布',
            1: '已删除'
          }
        return statusMap[status]
      }
    },
    statusOpFilter(status) {
       const statusMap = {
            0: '删除',
            1: '发布'
          }
       return statusMap[status]
    },
    isMenu(ismenu) {
      const menuMap = {
        1: '菜单',
        0: '按钮'
      }
      return menuMap[ismenu]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    parseTime(time, timestamp){
      if (time == null)
        return ''
      return parseTime(time, timestamp)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getArticles()
  },
  methods: {
    getArticles(){
      this.listLoading = true
      groupList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
		deleted(id){
			 this.listLoading = true
			deleteAssemble(id).then(res => {
			  if(res.code == 200){
					this.$message({
					  message: '删除团购成功',
					  type: 'success'
					})
					this.getArticles();
				}else{
					this.$message({
					  message: res.data,
					  type: 'warning'
					})
				}
			  this.listLoading = false
			})
		},
    handleFilter() {
      this.listQuery.page = 1
      this.getUserList()
    },
    
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    
  },
  computed: {
    indexImg() {
      return function(img) {
        // return "http://localhost/" + img
        return this.$static + img
      }
      
    },
  }
}
</script>
