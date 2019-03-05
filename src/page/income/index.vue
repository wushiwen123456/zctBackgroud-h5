<template>

  <div class="app-container">
    <el-scrollbar>
    <div class="filter-container">
      <el-input placeholder="用户手机号" v-model="listQuery.phone" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/>
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
      <el-table-column label="用户手机号" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
			</el-table-column>
			<el-table-column label="用户名" align="center" min-width="150px">
				<template slot-scope="scope">
				  <span>{{ scope.row.username }}</span>
				</template>
      </el-table-column>
      <el-table-column label="收益金额" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请人数" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary"  size="mini" @click="handleUpdate(scope.row)">修 改</el-button>
					<el-button type="primary"  size="mini" @click="addRecord(scope.row.user_id)">添加邀请返佣</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-scrollbar>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="incomeList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" customClass="customWH">
         <el-scrollbar style="height:100%">
         <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
           <el-form-item label="用户手机号" prop="phone">
             <el-input v-model="temp.phone" :disabled="true"/>
           </el-form-item>
           <el-form-item label="邀请人数" prop="count">
             <el-input v-model="temp.count" placeholder="请设置邀请人数"/>
           </el-form-item>
           <el-form-item label="收益金额" prop="amount">
             <el-input v-model="temp.amount" placeholder="请设置收益金额"/>
           </el-form-item>
         </el-form>
         </el-scrollbar>
         <div slot="footer" class="dialog-footer">
           <el-button @click="dialogFormVisible = false">取消</el-button>
           <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
         </div>
       </el-dialog>
       <el-dialog :title="textMap1[dialogStatus1]" :visible.sync="dialogFormVisible1" customClass="customWH">
        <el-scrollbar style="height:100%">
        <el-form ref="dataForm1" :rules="rules1" :model="temp1" label-position="left" label-width="130px" style="height=100%;width: 600px; margin-left:50px;">
          <el-form-item label="被邀请人手机号" prop="phone">
            <el-input v-model="temp1.phone" placeholder="请输入被邀请人手机号"/>
          </el-form-item>
          <el-form-item label="收益金额" prop="amount">
            <el-input v-model="temp1.amount" placeholder="请设置收益金额"/>
          </el-form-item>
        </el-form>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus1==='create'?createData1():updateData1()">确认</el-button>
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
   
   .el-table__body-wrapper{
       width: auto;
       display: inline-block;
       vertical-align: bottom;
   }
   .el-dialog__body{
     padding: 15px 20px
   }
   .el-table{
     display: inline-block;
     width: auto;
     max-width: fit-content;
   }
   </style>
   
   <script>
   import { incomeList, setFakeCounting, setFakeRecord } from '@/api/index'
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
         listQuery: {
           page: 1,
           pageSize: 20,
           phone: undefined,
         },
         importanceOptions: [1, 2, 3],
         calendarTypeOptions,
         sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
         statusOptions: ['published', 'draft', 'deleted'],
         showReviewer: false,
         temp: {
           user_id: undefined,
           count:'',
					 amount:''
         },
				 temp1: {
				   user_id: undefined,
				   phone:'',
				 	 amount:''
				 },
         dialogFormVisible: false,
         dialogStatus: '',
         textMap: {
           update: '邀请人数和收益设置',
           create: 'Create'
         },
				 dialogFormVisible1: false,
				 dialogStatus1: '',
				 textMap1: {
				   update: '添加邀请返佣收益',
				   create: 'Create'
				 },
         dialogPvVisible: false,
         pvData: [],
         rules: {
           count: [{ required: true, message: '请设置邀请人数', trigger: 'blur' }],
           amount: [{ required: true, message: '请设置收益金额', trigger: 'blur' }],
         },
				 rules1: {
				   phone: [{ required: true, message: '请输入被邀请人手机号', trigger: 'blur' }],
				   amount: [{ required: true, message: '请设置收益金额', trigger: 'blur' }],
				 },
         downloadLoading: false
       }
     },
     created() {
       this.incomeList()
     },
     methods: {
       incomeList(e){
         this.listLoading = true
         incomeList(this.listQuery).then(response => {
           this.list = response.data.list
           this.total = response.data.total
           this.listLoading = false
         })
       },
       handleFilter() {
         this.listQuery.page = 1
         this.incomeList()
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
       handleUpdate(row) {
         this.temp = Object.assign({}, row) // copy obj
         // this.temp.timestamp = new Date(this.temp.timestamp)
         this.dialogStatus = 'update'
         this.dialogFormVisible = true
         this.$nextTick(() => {
           this.$refs['dataForm'].clearValidate()
         })
       },
			 createData() {
			   this.$refs['dataForm'].validate((valid) => {
			     if (valid) {
			       this.temp.user_id = parseInt(Math.random() * 100) + 1024 // mock a id
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
       updateData() {
         this.$refs['dataForm'].validate((valid) => {
           if (valid) {
             setFakeCounting(this.temp).then((res) => {
               if (res.code == 200) {
                 this.dialogFormVisible = false
                 this.$message({
                   message: '更新成功',
                   type: 'success'
                 })
								 this.incomeList()
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
			 addRecord(row) {
			   this.temp1.user_id = row // copy obj
				 console.log(this.temp1)
			   this.dialogStatus1 = 'update'
			   this.dialogFormVisible1 = true
			   this.$nextTick(() => {
			     this.$refs['dataForm1'].clearValidate()
			   })
			 },
			  createData1() {
			   this.$refs['dataForm1'].validate((valid) => {
			     if (valid) {
			       this.temp1.user_id = parseInt(Math.random() * 100) + 1024 // mock a id
			       this.temp1.author = 'vue-element-admin'
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
			 updateData1() {
			   this.$refs['dataForm1'].validate((valid) => {
			     if (valid) {
			       setFakeRecord(this.temp1).then((res) => {
			         if (res.code == 200) {
			           this.dialogFormVisible1 = false
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
