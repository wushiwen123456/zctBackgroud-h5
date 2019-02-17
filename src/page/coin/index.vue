<template>
  <div class="app-container">
    <el-scrollbar>
    <div class="filter-container">
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
      <el-table-column label="币种名称" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.symbol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冲币地址" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.deposit_addr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最低提币限额" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withdraw_minimum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大提币限额" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withdraw_maxmum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提币手续费" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withdraw_fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提币实名认证限额" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.certificate_threshold}}</span>
        </template>
      </el-table-column>
      <el-table-column label="转换手续费" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trans_fee}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最低托管限额" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trustee_minimum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="托管手续费" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trustee_fee }}</span>
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
  </el-scrollbar>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-bind:style="{height:fullHeight}" customClass="customWH">
      <el-scrollbar style="height:100%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
        <el-form-item label="币种名称" prop="symbol">
          <el-input v-model="temp.symbol" :disabled="true"/>
        </el-form-item>
        <el-form-item label="冲币地址" prop="deposit_addr">
          <el-input type="textarea" v-model="temp.deposit_addr" width="300px" placeholder="请设置冲币地址"/>
        </el-form-item>
        <el-form-item label="冲币须知" prop="deposit_notice">
          <el-input v-model="temp.deposit_notice" type="textarea" :rows="6" placeholder="请输入冲币须知"/>
        </el-form-item>
        <el-form-item label="最小提币数量" prop="withdraw_minimum">
          <el-input v-model="temp.withdraw_minimum" placeholder="请设置最小提币数量"/>
        </el-form-item>
        <el-form-item label="最大提币数量" prop="withdraw_maxmum">
          <el-input v-model="temp.withdraw_maxmum" placeholder="请设置最大提币数量"/>
        </el-form-item>
        <el-form-item label="提币须知" prop="withdraw_notice">
          <el-input v-model="temp.withdraw_notice" type="textarea" :rows="6" placeholder="请输入提币须知"/>
        </el-form-item>
        <el-form-item label="提币手续费" prop="withdraw_fee">
          <el-input v-model="temp.withdraw_fee" :disabled="true" placeholder="请设置提币手续费"/>
        </el-form-item>
        <el-form-item label="提币实名认证限额" prop="certificate_threshold">
          <el-input v-model="temp.certificate_threshold" placeholder="请设置提币实名认证限额"/>
        </el-form-item>
        <el-form-item label="转换手续费(个)" prop="trans_fee">
          <el-input v-model="temp.trans_fee" placeholder="请设置转换手续费"/>
        </el-form-item>
        <el-form-item label="转换须知" prop="trans_notice">
          <el-input v-model="temp.trans_notice" type="textarea" :rows="6" placeholder="请输入转换须知"/>
        </el-form-item>
        <el-form-item label="托管数量(个)" prop="trustee_minimum">
          <el-input v-model="temp.trustee_minimum" placeholder="请设置最小托管数量"/>
        </el-form-item>
        <el-form-item label="托管费用(个)" prop="trustee_fee">
          <el-input v-model="temp.trustee_fee" placeholder="请设置托管费用"/>
        </el-form-item>
        <el-form-item label="托管须知" prop="trustee_notice">
          <el-input v-model="temp.trustee_notice" type="textarea" :rows="6" placeholder="请输入托管须知"/>
        </el-form-item>
        <el-form-item label="币种介绍" prop="profile">
          <tinymce :height="300" v-model="temp.profile"/>
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
import { getCoinList, updateCoinInfo } from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/util'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'

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
  components: { Pagination, Tinymce },
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
      fullHeight: document.documentElement.clientHeight + 'px',
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
        profile: '',
        deposit_addr: '',
        deposit_notice: '',
        withdraw_minimum: '',
        withdraw_maxmum: '',
        withdraw_notice: '',
        withdraw_fee: '',
        certificate_threshold:'',
        trans_minimum: '',
        trans_notice: '',
        trustee_minimum: '',
        trustee_notice: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '数字货币参数设置',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        deposit_addr: [{ required: true, message: '请设置充币地址', trigger: 'blur' }],
        deposit_notice: [{ required: true, message: '请填写充币须知', trigger: 'blur' }],
        withdraw_minimum: [{ required: true, message: '请设置提币最小数量', trigger: 'blur' }],
        withdraw_maxmum: [{ required: true, message: '请设置提币最大数量', trigger: 'blur' }],
        withdraw_notice: [{ required: true, message: '请填写提币须知', trigger: 'blur' }],
        certificate_threshold: [{ required: true, message: '请设置提币实名限额', trigger: 'blur' }],
        trans_fee: [{ required: true, message: '请设置转换手续费', trigger: 'blur' }],
        trans_notice: [{ required: true, message: '请填写转换须知', trigger: 'blur' }],
        trustee_minimum: [{ required: true, message: '请设置托管最小数量', trigger: 'blur' }],
        trustee_fee: [{ required: true, message: '请设置托管费用', trigger: 'blur' }],
        trustee_notice: [{ required: true, message: '请填写托管须知', trigger: 'blur' }],
        profile: [{ required: true, message: '请填写币种介绍', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getCoinList()
  },
  methods: {
    getCoinList(){
      this.listLoading = true
      getCoinList().then(response => {
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
          updateCoinInfo(this.temp).then((res) => {
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

