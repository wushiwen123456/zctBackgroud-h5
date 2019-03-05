<template>
  <div class="app-container">
    <el-scrollbar>
    <div class="filter-container">
      <el-input placeholder="邀请人手机号" v-model="listQuery.phone" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/>
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
      <el-table-column label="邀请人手机号" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.inviter_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请人名称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inviter_username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被邀请人手机号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trustee_phone }}</span>
        </template>
      </el-table-column>
			<el-table-column label="被邀请人名称" min-width="150px" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.trustee_username }}</span>
			  </template>
			</el-table-column>
			<el-table-column label="收益金额" min-width="150px" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.amount }}</span>
			  </template>
			</el-table-column>
			<el-table-column label="收益时间" min-width="200px" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.create_time }}</span>
			  </template>
			</el-table-column>
      <!-- <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary"  size="mini" @click="handleUpdate(scope.row)">修 改</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    </el-scrollbar>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="incomeDetailList" />
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
   import { incomeDetailList } from '@/api/index'
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
         dialogFormVisible: false,
         dialogStatus: '',
         dialogPvVisible: false,
         downloadLoading: false
       }
     },
     created() {
       this.incomeDetailList()
     },
     methods: {
       incomeDetailList(e){
         this.listLoading = true
         incomeDetailList(this.listQuery).then(response => {
           this.list = response.data.list
           this.total = response.data.total
           this.listLoading = false
         })
       },
			   sortChange(data) {
			   const { prop, order } = data
			   if (prop === 'id') {
			     this.sortByID(order)
			   }
			 },
       handleFilter() {
         this.listQuery.page = 1
         this.incomeDetailList()
       }
       
     }
   }
   </script>
