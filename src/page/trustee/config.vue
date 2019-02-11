<template>
  <div class="app-container">
    <div class="filter-container">
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种名称" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.symbol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日收益百分比(最小值)" align="center" width="180px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.income_rate_min }}%</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="日收益百分比(最大值)" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.income_rate_max }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="托管类型" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime() }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="修改时间" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">查看&修改</el-button>          
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" customClass="customWH">
      <el-scrollbar style="height:100%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 600px; margin-left:50px;">
        <el-form-item label="币种名称">
          <el-input v-model="temp.symbol" disabled="true"/>
        </el-form-item>
        <el-form-item label="日收益百分比最小值" prop="income_rate_min">
          <el-input v-model="temp.income_rate_min" placeholder="请输入日收益百分比最小值"/>
        </el-form-item>
        <el-form-item label="日收益百分比最大值" prop="income_rate_max">
          <el-input v-model="temp.income_rate_max" placeholder="请输入日收益百分比最大值"/>
        </el-form-item>
        <el-form-item label="托管类型">
          <el-input v-model="temp.type" disabled="true" placeholder="请输入冲币须知"/>
        </el-form-item>
      </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
.customWH {
  margin-top: 5vh!important;
  width: 60%;
  height: 90%;
}
.el-dialog__body{
  height:75%;
  padding: 15px 20px
}
</style>

<script>
import { trusteeConfigs, updateTrusteeConfig } from '@/api/index'
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
  name: 'CoinList',
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
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    parseTime(time, timestamp){
      if (time == null) return null
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
        pageSize: 20,
        phone: undefined,
        inviterPhone: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        symbol: '',
        income_rate_min: '',
        income_rate_max: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '数字货币托管收益参数设置',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        income_rate_min: [{ required: true, message: '请填写日收益百分比最小值', trigger: 'blur' }],
        income_rate_max: [{ required: true, message: '请填写日收益百分比最大值', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.trusteeConfigs()
  },
  methods: {
    trusteeConfigs(){
      this.listLoading = true
      trusteeConfigs().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getUserList()
    },
    handleModifyStatus(row) {

      let title = ''
      if (row.status == 1)
        title = '当前操作将会冻结该用户，是否继续？'
      else 
        title = '当前操作将会恢复该用户，是否继续？'

      this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          modifyUserStatus(row.id).then(res => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateTrusteeConfig(this.temp).then((res) => {
            if (res.code == 200) {
              this.dialogFormVisible = false
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.error,
                type: 'error'
              })
            }
            
          })
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
  }
}
</script>
