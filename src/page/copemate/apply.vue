<template>

  <div class="app-container">
    <el-scrollbar>
    <!-- <div class="filter-container">
      <el-input placeholder="会员名称" v-model="listQuery.nickname" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/>
      <el-input placeholder="会员手机号" v-model="listQuery.phone" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleFilter">查询</el-button>
    </div> -->
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
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.nickname }}</el-tag>
        </template>	
      </el-table-column>
      <el-table-column label="申请时间" min-width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime() }}</span>
        </template>
      </el-table-column>
			<el-table-column label="申请状态" min-width="150px" align="center">
			  <template slot-scope="scope">
			    <el-tag v-if="scope.row.status==0">审核中</el-tag>
					<el-tag v-if="scope.row.status==1">已是合伙人</el-tag>
			  </template>
			</el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==0" type="success" size="small" @click="pass(scope.row.user_id)">审核通过</el-button>          
          <!-- <el-button type="danger"  size="mini" @click="handleModifyStatus(scope.row)">{{ scope.row.status | statusOpFilter() }}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    </el-scrollbar>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserList" />
  </div>
</template>
<style>
  .user-head{
    width:58px;
    height: 58px;
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
import { getCopemateList, modifyUserStatus,passAudits } from '@/api/index'
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
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status, type) {
      if (type == 0) {
        const statusMap = {
            1: 'success',
            2: 'danger'
          }
        return statusMap[status]
      } else {
        const statusMap = {
            1: '正常',
            2: '冻结'
          }
        return statusMap[status]
      }
    },
    statusOpFilter(status) {
      const statusMap = {
            1: '冻结',
            2: '恢复'
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
//         nickname: "",
//         phone: "",
        // inviterPhone: undefined
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
    this.getUserList()
  },
  methods: {
    getUserList(){
      this.listLoading = true
      getCopemateList(this.listQuery).then(response => {
        this.list = response.data.list
				this.total = response.data.count
				if (this.list.length == this.listQuery.size)
				  this.listQuery.size++
				this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getUserList()
    },
    pass(id){
			this.listLoading = true
				passAudits(id).then(res => {
			  if(res.code == 200){
						this.$message({
						  message: '审核通过',
						  type: 'success'
						})
						this.getUserList()
					}else{
						this.$message({
						  message: res.data,
						  type: 'warning'
						})
					}
			  this.listLoading = false
			})
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  },
  computed: {
    headImg() {
      return function(head) {
        //return this.$static + 'uploads/' + '20190121/567429d6137b7e075648b600a87dcfd2.jpg'
          if (head == null || head == '')
          return this.$static + 'uploads/' + 'default_head.png'
          else 
          return this.$static + 'uploads/' + head
      }
      
    },
  }
}
</script>
