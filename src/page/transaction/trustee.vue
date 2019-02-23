<template>

  <div class="app-container">
    <el-scrollbar>
    <div class="filter-container">
      <el-input placeholder="会员手机号" v-model="listQuery.phone" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/>
      <el-input placeholder="订单编号" v-model="listQuery.orderid" style="width: 200px; margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select @change="selectedChange" v-model="listQuery.type" placeholder="托管类型" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
        <el-option v-for="item in trusteeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select @change="selectedChange" v-model="listQuery.status" placeholder="托管状态" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
        <el-option v-for="item in trusteeStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
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
      <el-table-column label="用户名称" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="托管币种" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="托管类型" min-width="150px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否自动续托" min-width="90px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.auto_renewal == 1 ? '是' :  '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="托管金额" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收益" min-width="150px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == '随托随取'">{{ scope.row.amount }}(累计)</span>
          <span v-else>{{ scope.row.income.total }}(预期)</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="托管状态" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter(0)" >{{ scope.row.status | statusFilter(1) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary"  size="mini" @click="handleDetail(scope.row)">详 情</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-scrollbar>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTrusteeList" />
    <el-dialog title="充币详情" :visible.sync="dialogFormVisible" v-bind:style="{height:fullHeight}" customClass="customWH">
      <el-scrollbar>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
        <el-form-item label="用户名称">
          <span>{{ temp.username }}</span>
        </el-form-item>
        <el-form-item label="手机号码">
          <span>{{ temp.phone }}</span>
        </el-form-item>
        <el-form-item label="订单编号">
          <span>{{ temp.orderid }}</span>
        </el-form-item>
        <el-form-item label="托管币种">
          <span>{{ temp.title }}</span>
        </el-form-item>
        <el-form-item label="托管类型">
          <span>{{ temp.type }}</span>
        </el-form-item>
        <el-form-item label="是否自动续托">
          <span>{{ temp.auto_renewal == 1 ? '是' :  '否' }}</span>
        </el-form-item>
        <el-form-item label="托管金额">
          <span>{{ temp.amount }}</span>
        </el-form-item>
        <el-form-item label="托管手续费">
          <span>{{ temp.fee }}</span>
        </el-form-item>
        <el-form-item label="开始日期">
          <span>{{ temp.start_date }}</span>
        </el-form-item>
         <el-form-item label="结束日期">
          <span>{{ temp.stop_date }}</span>
        </el-form-item>
        <el-form-item label="昨日收益">
          <span>{{ temp.income.yesterday }}</span>
        </el-form-item>
        <el-form-item label="昨日收益(CNY)">
          <span>{{ temp.income.yesterday_cny }}</span>
        </el-form-item>
         <el-form-item label="总收益">
          <span v-if="temp.type == '随托随取'">{{ temp.income.total}}(累计)</span>
          <span v-else>{{ temp.income.total }}(预期)</span>
        </el-form-item>
         <el-form-item label="总收益(CNY)">
          <span >{{ temp.income.total_cny }}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ temp.create_time }}</span>
        </el-form-item>
        <el-form-item label="托管状态">
          <span>{{ temp.status | statusFilter(1) }}</span>
        </el-form-item>
      </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
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

  .customWH {
  margin-top: 5vh!important;
  width: 60%;
  height: 90%;
}
.el-dialog__body{
  padding: 15px 20px
}
</style>

<script>
import { getTrusteeList } from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/util'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { uniqueArr } from '../../util';

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

const trusteeTypeOptions = [
  { key: '随托随取', display_name: '随托随取' },
  { key: '托管30天', display_name: '托管30天' },
  { key: '托管90天', display_name: '托管90天' },
  { key: '托管180天', display_name: '托管180天' }
]

const trusteeStatusOptions = [
  { key: 0, display_name: '已取消' },
  { key: 1, display_name: '托管中' },
  { key: 2, display_name: '已完成' }
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
            0: 'danger',
            1: 'success',
            2: 'info'
          }
        return statusMap[status]
      } else {
        const statusMap = {
            0: '已取消',
            1: '托管中',
            2: '已完成'
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
      fullHeight: document.documentElement.clientHeight + 'px',
      listQuery: {
        page: 1,
        limit: 20,
        orderid: undefined,
        phone: undefined,
        type:undefined,
        status:undefined
      },
      importanceOptions: [1, 2, 3],
      trusteeTypeOptions,
      trusteeStatusOptions,
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        income:{}
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
    this.getTrusteeList()
  },
  methods: {
    selectedChange(){
      this.handleFilter()
    },
    getTrusteeList(e){
      if (e != null) {
      }
      this.listLoading = true
      getTrusteeList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getTrusteeList()
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
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '创建成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleDetail(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {
          //   for (const v of this.list) {
          //     if (v.id === this.temp.id) {
          //       const index = this.list.indexOf(v)
          //       this.list.splice(index, 1, this.temp)
          //       break
          //     }
          //   }
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
    },
    handleDownload() {
      this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal, this.list)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
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
