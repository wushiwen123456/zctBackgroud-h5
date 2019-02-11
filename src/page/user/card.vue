<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="会员姓名" v-model="listQuery.name" style="width: 150px; margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="会员手机号" v-model="listQuery.phone" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/>
      <el-select @change="selectedChange" v-model="listQuery.type" placeholder="审核状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in realnameTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
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
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号码" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.id_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="正面照片" align="center" min-width="180px">
        <template slot-scope="scope">
          <img class="card-img" :src="cardImg(scope.row.id_card_front)" />
        </template>
      </el-table-column>
      <el-table-column label="反面照片" align="center" min-width="180px">
        <template slot-scope="scope">
          <img class="card-img" :src="cardImg(scope.row.id_card_back)" />
        </template>
      </el-table-column>
      <el-table-column label="手持照片" align="center" min-width="180px">
        <template slot-scope="scope">
          <img class="card-img" :src="cardImg(scope.row.id_card_in_hand)" />
        </template>
      </el-table-column>
      <el-table-column label="认证时间" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="认证状态" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter(0)" >{{ scope.row.status | statusFilter(1) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核描述" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getCardList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" customClass="customWH">
      <el-scrollbar style="height:100%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
        <el-form-item label="用户姓名">
          <el-input :disabled="true" v-model="temp.realname"/>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input :disabled="true" v-model="temp.id_number"/>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input :disabled="true" v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="正面照片">
          <img class="card-img-big" :src="cardImg(temp.id_card_front)" />
        </el-form-item>
        <el-form-item label="反面照片">
          <img class="card-img-big" :src="cardImg(temp.id_card_back)" />
        </el-form-item>
        <el-form-item label="手持照片">
          <img class="card-img-big" :src="cardImg(temp.id_card_in_hand)" />
        </el-form-item>
        <el-form-item label="认证状态">
          <span>{{ temp.status | statusFilter(1) }}</span>
        </el-form-item>
        <el-form-item v-if="temp.status != 'success'" label="审核操作" prop="type">
          <el-select @change="checkedChange" v-model="temp.type"  style="width: 180px">
            <el-option v-for="item in checkOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="reason" prop="remark" label="审核拒绝原因">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="请填写审核不通过的原因"/>
        </el-form-item>
      </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

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
  .card-img{
    width: 160px;
    height: 90px;
  }
  .card-img-big{
    width: 320px;
    height: 180px;
  }
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
import { getCardList, verifyUserCard } from '@/api/index'
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

const realnameTypeOptions = [
  { key: 'pend', display_name: '未审核' },
  { key: 'success', display_name: '审核成功' },
  { key: 'fail', display_name: '审核失败' }
]

const checkOptions = [
  { key: 'success', display_name: '审核成功' },
  { key: 'fail', display_name: '审核失败' }
]

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  filters: {
    
    statusOpFilter(status) {
      const statusMap = {
            1: '冻结',
            2: '恢复'
          }
      return statusMap[status]
    },
    statusFilter(status, type) {
      if (type == 0) {
        const statusMap = {
          pend: 'info',
          success: 'success',
          fail: 'danger'
          }
        return statusMap[status]
      } else {
        const statusMap = {
          pend: '未审核',
          success: '审核成功',
          fail: '审核失败'
          }
        return statusMap[status]
      }
      
    },
    parseTime(time, timestamp){
      if (time == null) return ''
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
        name: undefined,
        type: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      realnameTypeOptions,
      checkOptions,
      reason: false,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      row: {},
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: 'success'
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
        type: [{ required: true, message: '请确认审核操作', trigger: 'change' }],
        remark: [{ required: true, message: '请填写审核失败描述', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getCardList()
  },
  methods: {
    selectedChange(){
      this.handleFilter()
    },
    checkedChange(){
      if (this.temp.type == 'fail')
        this.reason = true
      else
        this.reason = false
    },
    getCardList(){
      this.listLoading = true
      getCardList(this.listQuery).then(response => {
        this.list = response.data.cardList
        this.total = response.data.count
        if (this.list.length == this.listQuery.limit)
          this.listQuery.page++
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getCardList()
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
      this.row = row
      this.temp = Object.assign(this.temp, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      if (this.temp.status == 'success') {
        this.dialogFormVisible = false
        return
      }
      let that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tmpData = {}
          tmpData.id = this.temp.id
          tmpData.type = this.temp.type
          tmpData.remark = this.temp.remark

          verifyUserCard(tmpData).then(res => {
          if (res.code == 200) {
              this.$message({
                message: res.data.desc,
                type: 'success'
              })
              that.row.status = res.data.status
              that.row.remark = res.data.remark
              that.dialogFormVisible = false
            } else {
              this.$message({
                message: res.error,
                type: 'warn'
              })
            }
          })
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
  computed:{
    cardImg(){
      return function(img){
        return this.$static + 'uploads/' + img
      }
    }
  }
}
</script>
