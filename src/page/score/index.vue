<template>

  <div class="app-container">
    <el-scrollbar>
    <div class="filter-container">
			<el-date-picker   placeholder="月份" type="month" v-model="listQuery.month" class="filter-item" style="width: 170px;" format="yyyy-MM"  value-format="yyyy-MM" ></el-date-picker>
      <!-- <el-input placeholder="会员名称" v-model="listQuery.nickname" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/> -->
      <!-- <el-input placeholder="会员手机号" v-model="listQuery.phone" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleFilter">查询</el-button>
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
      <el-table-column label="技师姓名" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.realname }}</el-tag>
        </template>	
      </el-table-column>
      <el-table-column label="技师手机号" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="技师职称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业绩提成" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.commission }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手工费" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.handwork }}</span>
        </template>
      </el-table-column>
      
      <!-- <el-table-column label="用户状态" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter(0)" >{{ scope.row.status | statusFilter(1) }}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width"> -->
        <!-- <template slot-scope="scope"> -->
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">详情</el-button>           -->
          <!-- <el-button type="danger"  size="mini" @click="handleModifyStatus(scope.row)">{{ scope.row.status | statusOpFilter() }}</el-button> -->
        <!-- </template> -->
      <!-- </el-table-column> -->
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
import { getScoreList, modifyUserStatus } from '@/api/index'
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
        month: "",
        // inviterPhone: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList(){
      this.listLoading = true
      getScoreList(this.listQuery).then(response => {
        this.list = response.data.list
				this.total = response.data.count
				if (this.list.length == this.listQuery.limit)
				  this.listQuery.limit++
				this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
			this.listQuery.month = this.listQuery.month.replace("-","")
			console.log(this.listQuery.month)
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
