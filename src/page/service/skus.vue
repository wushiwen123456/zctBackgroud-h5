<template>

  <div class="app-container">
    <el-scrollbar>
    <div class="filter-container">
      <!-- <el-input placeholder="订单编号" v-model="listQuery.number" class="filter-item" style="width: 190px;"  @keyup.enter.native="handleFilter"/>
      <el-date-picker placeholder="开始时间" type="date" v-model="listQuery.date_min" class="filter-item" style="width: 170px;" format="yyyy-MM-dd"  value-format="yyyy-MM-dd" ></el-date-picker>
      <el-date-picker placeholder="结束时间" type="date" v-model="listQuery.date_max" class="filter-item" style="width: 170px;" format="yyyy-MM-dd"  value-format="yyyy-MM-dd" ></el-date-picker> -->
       <el-button @click="tianJiaTaocan" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">添 加</el-button>
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
			<!-- <el-table-column label="订单姓名" min-width="180px" align="center">
			  <template slot-scope="scope">
			    <span v-if="scope.row.mode == 1">到店服务</span>
			    <span v-if="scope.row.mode == 2">上门服务</span>
			  </template>
			</el-table-column> -->
			<el-table-column label="套餐名称" min-width="180px" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.name }}</span>
			  </template>
			</el-table-column>
      <el-table-column label="套餐价格" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>￥{{ scope.row.price }}元</span>
        </template>	
      </el-table-column>
      <!-- <el-table-column label="上门费" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.drop_in_fee }}</span>
        </template>
      </el-table-column> -->
			<el-table-column label="服务次数" min-width="150px" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.times }}</span>
			  </template>
			</el-table-column>
            <el-table-column label="备注" min-width="150px" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.remark }}</span>
			  </template>
			</el-table-column>
			<el-table-column label="推荐奖励现金券（用户）" min-width="300px" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.coupon_for_user_recommend  }}</span>
			  </template>
			</el-table-column>
			<el-table-column label="推广奖励现金券（合伙人）" min-width="150px" align="center">
			  <template slot-scope="scope">
			    <el-tag>{{ scope.row.coupon_for_copemate_recommend}}</el-tag>
			  </template>
			</el-table-column>

     <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width"> -->
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row.id,'bianji')">编辑</el-button>         
          <!-- <el-button type="info" size="small" @click="handleUpdate(scope.row.id,'xiangqing')">详情</el-button>          -->
          <el-button type="danger" size="small" @click="handleUpdate(scope.row.id,'del')">删除</el-button>         
          <!-- <el-button type="danger"  size="mini" @click="handleModifyStatus(scope.row)">{{ scope.row.status | statusOpFilter() }}</el-button> -->
        </template>
     </el-table-column>
    </el-table>
    </el-scrollbar>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserList" />

      <!-- 编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="bianji" >
      <el-scrollbar>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
        <el-form-item label="套餐名称">
          <el-input v-model="temp.name"  width="300px" placeholder="请输入服务名称" :disabled="isTanCanDisabled"/>
        </el-form-item>
        <el-form-item label="套餐价格">
          <el-input v-model="temp.price"  width="300px" placeholder="请输入服务名称" :disabled="isTanCanDisabled"/>
        </el-form-item>
        <el-form-item label="服务次数">
           <el-input v-model="temp.times"  width="300px" placeholder="请输入服务名称" :disabled="isTanCanDisabled"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark"  width="300px" placeholder="请输入服务名称" :disabled="isTanCanDisabled"/>
        </el-form-item>
        <el-form-item label="推荐奖励现金券（用户）">
          <el-input v-model="temp.coupon_for_user_recommend"  width="300px" placeholder="请输入服务名称" :disabled="isTanCanDisabled"/>
        </el-form-item>
        <el-form-item label="推广奖励现金券（合伙人）">
           <el-input v-model="temp.coupon_for_copemate_recommend"  width="300px" placeholder="请输入服务名称" :disabled="isTanCanDisabled"/>
        </el-form-item>
        <el-form-item label="赠送上门服务减免次数">
           <el-input v-model="temp.fee_reduce_count"  width="300px" placeholder="请输入服务名称" :disabled="isTanCanDisabled"/>
        </el-form-item>
         </el-form>
      </el-scrollbar>
      <div style="text-align:center">
        <el-button type="primary" size="success" @click="successForm">完成</el-button>  
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


    <!-- 添加 -->
    <el-dialog :visible.sync="addProduct" title="Reading statistics">
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
	.el-dialog{
		 margin-top: 6vh !important;
	}
</style>

<script>
import { getAppointList, getViewListDetail,getMassigstType,deletEvaluate } from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/util'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// 修改内容
import { getSkus,addSkus,skusDeatil,editSkus,deleteSkus } from '@/api/index'

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
    },

    /**
     * 修改的部分
     */
    dealStatus(status){
        switch (status){
            case 0:
                return '待使用'
            case 1:
                return '使用中'
            case 2:
                return '已用完'
        }
    },
    dealProductImg(url){
        return url
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
				massagist_id:'',
        page: 1,
        size: 20,
        number: "",
        date_min: "",
				date_max: ""
        // inviterPhone: undefined
      },
      importanceOptions: [1, 2, 3],
			trusteeTypeOptions:'',
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: "",
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
      downloadLoading: false,
      addProduct:false,
      bianji:false,
      xiangqing:false,
      shanchu:false,
      isTanCanDisabled:false,
      product_id:''
    }
  },
  created() {
		// this.listQuery.number = this.$route.query.orderNum
    	// this.getUserList();
		// this.massagist();
    const id = this.$route.params && this.$route.params.sid
    this.product_id = id
		console.log(id)
		console.log('开始请求数据')
		this.getTaoCanList(id)
  },
  methods: {
    getTaoCanList(id){
       getSkus({product_id:id}).then(response => {
        this.list = response.data
        // if (this.list.length == this.listQuery.limit)
        // 	this.listQuery.limit++
        this.listLoading = false
	  	})
    },
		selectedChange(){
			this.getUserList()
		},
		massagist(){
			getMassigstType().then(response => {
			  this.trusteeTypeOptions = response.data
			})
		},
    getUserList(){
      this.listLoading = true
      getOrderList(this.listQuery).then(response => {
          
        this.list = response.data.list
				this.total = response.data.count
				if (this.list.length == this.listQuery.limit)
				  this.listQuery.limit++
				this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getUserList()
    },
		display(id){
			console.log('eeee',id)
			deletEvaluate(id).then(response => {
			   if(response.code == 200){
			  			this.$message({
			  					  message: '隐藏评价成功',
			  					  type: 'success'
			  					})
			  					this.handleUpdate();
									this.dialogFormVisible = false
			  				}else{
			  					this.$message({
			  					  message: response.data,
			  					  type: 'warning'
			  					})
			  				}
			  this.listLoading = false
			})
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
    handleUpdate(id,type) {
			// getOrderListDetail(id).then(response => {
			//   this.temp = response.data
			
			// })
        // this.dialogFormVisible = true 
      switch(type){
        case 'bianji':
          skusDeatil(id).then(res => {
            this.temp = res.data
            this.bianji = true
          })
          break;
        case 'xiangqing':
            this.xiangqing = true
            break;
        case 'del':
            // deleteSkus(id).then(res => {
            //   if(res.code == 200){
            //     console.log('删除成功')
            //   }
            // })
            this.deleted(id)
            break;
      }
    },
    // 删除服务
		deleted(id){
			const that = this
			this.$confirm('确认要删除该服务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteSkus(id).then(res => {
            if(res.code == 200){
          		this.$message({
          		  message: '删除服务成功',
          		  type: 'success'
          		})
          		this.getTaoCanList(that.product_id);
          	}else{
          		this.$message({
          		  message: res.data,
          		  type: 'warning'
          		})
          	}
          })
        }).catch(() => {
        });
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
    },
    successForm(){
      const that = this
      const temp = this.temp
      if(temp.id){
        // 是进行编辑
         // 发送请求
      const data = {
        name:temp.name,
        price:temp.price,
        times:temp.times,
        remark:temp.remark,
        coupon_for_user_recommend:temp.coupon_for_user_recommend,
        coupon_for_copemate_recommend:temp.coupon_for_copemate_recommend,
        fee_reduce_count:temp.fee_reduce_count,
        id:temp.id
      }
      console.log(data)
      editSkus(data).then(res => {
        if(res.code == 200){
          console.log('修改成功')
          this.bianji = false
          this.getTaoCanList(that.product_id);
        }
      })
      }else{
        // 是进行修改
        const data = {
          name:temp.name,
          price:temp.price,
          times:temp.times,
          remark:temp.remark,
          coupon_for_user_recommend:temp.coupon_for_user_recommend,
          coupon_for_copemate_recommend:temp.coupon_for_copemate_recommend,
          fee_reduce_count:temp.fee_reduce_count,
          product_id:this.product_id
        }
        console.log(data)
        addSkus(data).then(res => {
          if(res.code == 200){
             console.log('修改成功')
             this.bianji = false
             this.getTaoCanList(that.product_id);
          }
        })
      }
    },
    tianJiaTaocan(){
      this.bianji = true
      this.temp = []

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
