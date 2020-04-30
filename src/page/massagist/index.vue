<template>

  <div class="app-container">
    <el-scrollbar>
        <div class="filter-container">
      <!-- <el-input placeholder="技师名称" v-model="listQuery.nickname" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/> -->
        <el-input placeholder="技师手机号" v-model="listQuery.phone" class="filter-item" style="width: 150px;"  @keyup.enter.native="handleFilter"/>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addMassagist">添 加</el-button>
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
      <el-table-column label="姓名" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.realname }}</el-tag>
        </template>	
      </el-table-column>
      <!-- <el-table-column label="手机号" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="用户头像" width="110px" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.head }}</span> -->
          <img class="user-head" :src="scope.row.avatarurl" />
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="注册时间" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后一次登录时间" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_time | parseTime() }}</span>
        </template>
      </el-table-column> -->
      
      <!-- <el-table-column label="用户状态" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter(0)" >{{ scope.row.status | statusFilter(1) }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">详情</el-button>          
          <el-button type="info"  size="mini" @click="handleModifyStatus(scope.row.id)">编辑</el-button>
          <el-button type="danger"  size="mini" @click="deleted(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-scrollbar>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserList" />


        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <el-scrollbar>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
        <el-form-item label="姓名">
          <span>{{ temp.realname }}</span>
        </el-form-item>
        <el-form-item label="头像">
          <span><img style="width: 100px;height: 100px;" :src="temp.avatarurl" alt=""></span>
        </el-form-item>
        <el-form-item label="性别">
          <span>{{ temp.gender == 1 ? '男' : '女' }}</span>
        </el-form-item>
        <el-form-item label="职称">
          <span>{{ temp.title}}</span>
        </el-form-item>
        <el-form-item label="电话">
          <span>{{ temp.phone}}</span>
        </el-form-item>
        <el-form-item label="所属区域">
          <span>{{area}}</span>
        </el-form-item>
        <el-form-item label="技师级别">
          <span>{{ temp.level }}</span>
        </el-form-item>
        <el-form-item label="从业经验">
          <span>{{ temp.experience }}年</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ temp.create_time }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{ temp.username }}</span>
        </el-form-item>
      </el-form>
      </el-scrollbar>
    </el-dialog>


    <!-- 编辑 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2" customClass="customWH">
      <el-scrollbar style="height:100%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
        <el-form-item label="姓名" prop="symbol">
          <el-input v-model="temp.realname"  width="300px" placeholder="请填写您的姓名"/>
        </el-form-item>
        <el-form-item label="头像:" label-width="90px" prop="cover" style="margin-bottom: 30px;">
          <el-upload
        	  class="avatar-uploader"
            action="https://zct.51kdd.com/admin/upload"
            :show-file-list="false"
            :on-success="edithandleAvatarSuccess"
            :before-upload="editbeforeAvatarUpload">
          <img v-if="temp.avatarurl" :src="indexImg(temp.avatarurl)" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
         <el-form-item label="性别" prop="symbol">
          <el-select  v-model="temp.gender" placeholder="选择性别" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
				    <el-option v-for="item in ganderOption" :key="item.value" :label="item.name" :value="item.value"/>
				  </el-select>
        </el-form-item>
         <el-form-item label="职称" prop="symbol">
          <el-input v-model="temp.title"  width="300px" placeholder="请填写您的职称"/>
        </el-form-item>
         <el-form-item label="电话" prop="symbol">
          <el-input type="number" v-model="temp.phone"  width="300px" placeholder="请填写您的电话(数字)"/>
        </el-form-item>
         <el-form-item label="所属国家" prop="symbol">
          <!-- <el-date-picker placeholder="开始时间" type="date" v-model="temp.display_time" class="filter-item" style="width: 170px;" format="yyyy-MM-dd"  value-format="yyyy-MM-dd" ></el-date-picker> -->
          <el-input v-model="chooseMyCountry"  width="300px" :disabled="true" placeholder="请选择您的国家"/>
        </el-form-item>
         <el-form-item label="所属区域" prop="symbol">
          <!-- <el-date-picker placeholder="开始时间" type="date" v-model="temp.display_time" class="filter-item" style="width: 170px;" format="yyyy-MM-dd"  value-format="yyyy-MM-dd" ></el-date-picker> -->
          <el-cascader size="large" :options="areaOptions" v-model="selectAreaOptions" @change="handleChange"/>
        </el-form-item>
        <el-form-item label="技师级别" prop="symbol">
          <el-input-number :min="0" v-model="temp.level"  width="300px" placeholder="技师级别"/>  
        </el-form-item>
        <el-form-item label="从业经验" prop="symbol">
          <el-input-number :min="0" v-model="temp.experience"  width="300px" placeholder="请填写您的从业时间"/>
        </el-form-item>
        <el-form-item label="用户名" prop="symbol">
          <el-input v-model="temp.username"  width="300px" placeholder="请填写您的用户名"/>
        </el-form-item>
         <el-form-item v-if="!temp.id" label="密码" prop="symbol">
          <el-input v-model="temp.password"  width="300px" placeholder="请填写您的密码"/>
        </el-form-item>
      </el-form>
      </el-scrollbar>
      
       <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>
<style>
  .user-head{
    width:58px !important;
    height: 58px !important;
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
  .index-img{
    width:180px;
    height: 90px;
  }
  .el-table__body-wrapper{
    width: auto;
    display: inline-block;
    vertical-align: bottom;
  }
  .el-dialog{
  	 margin-top: 6vh !important;
  }
  .el-table{
    display: inline-block;
    width: auto;
    max-width: fit-content;
  }
	.car{
		width: 50px;
		height: 50px;
	}
	.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
	.el-upload--picture-card{
		width: 100px;
		height: 100px;
		line-height: 100px;
	}
	.el-upload-list--picture-card .el-upload-list__item{
		width: 100px;
		height: 100px;
	}
	.el-upload-list--picture .el-upload-list__item{
		height: auto!important;
	}
	.el-upload-list--picture .el-upload-list__item-thumbnail{
		width: 450px;
		height: 100px;
	}
</style>

<script>
import { getUserList, modifyUserStatus,getMassagistList,massagistDetail,editMassagist,addMassagist,deleteMassagist } from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/util'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// 引入中国行政数据
import {  provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data'


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
        nickname: "",
        phone: ""
        // inviterPhone: undefined
      },
      dialogFormVisible2:false,
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
      downloadLoading: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      // 性别选择
      ganderOption:[
      {
        name:'男',
        value:1
      },
      {
        name:'女',
        value:0
      },
      ],
      areaOptions:provinceAndCityData,
      selectAreaOptions:[]
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 删除技师
		deleted(id){
			
			this.$confirm('确认要删除该技师吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteMassagist(id).then(res => {
            if(res.code == 200){
          		this.$message({
          		  message: '删除服务成功',
          		  type: 'success'
          		})
          		this.getUserList();
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
    addMassagist(){
      this.temp = {
        id: '',
        title: '',
        type: '',
        gender:1,
        level:0,
        experience:0,

      }
      this.selectAreaOptions = []
      this.dialogFormVisible2 = true
    },
    handleChange(value){
      this.temp.province = CodeToText[value[0]]
      this.temp.city = CodeToText[value[1]]
    },
    getUserList(){
      this.listLoading = true
      getMassagistList(this.listQuery).then(response => {

        this.list = response.data.list
				this.total = response.data.count
				if (this.list.length == this.listQuery.limit)
				  this.listQuery.limit++
				this.listLoading = false
      })
    },
    edithandleAvatarSuccess(res, file) {
      console.log(res)
      console.log(URL.createObjectURL(file.raw))
      this.$set(this.temp,'avatarurl',res.data)
      this.editcover = URL.createObjectURL(file.raw)
		},
    			 editbeforeAvatarUpload(file) {
							console.log(file)
			   const isLt2M = file.size / 1024 / 1024 < 2;
			   if (!isLt2M) {
			     this.$message.error('上传图片大小不能超过 2MB!');
			   }
			   return isLt2M;
			 },
				edithandleSuccess(res, file) {
				  this.fileList.push({url: this.$static + res.data})
				  this.temp.carousel.push(res.data)
			 },
    handleFilter() {
      this.listQuery.page = 1
      this.getUserList()
    },
    handleModifyStatus(id) {
        massagistDetail(id).then(res => {
          const temp = res.data
            this.temp = temp
            if(temp.province && temp.city){
              this.selectAreaOptions =  [TextToCode[temp.province] ? TextToCode[temp.province].code : '',TextToCode[temp.province] ? TextToCode[temp.province][temp.city] ? TextToCode[temp.province][temp.city].code : '' : '']
            }
		         this.dialogFormVisible2 = true
       })
      //  provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode 
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
    handleUpdate(id) {
       massagistDetail(id).then(res => {
            this.temp = res.data
		    this.dialogFormVisible = true
       })
    },
    updateData() {
      console.log(this.temp)
      // editMassagist(this.temp).then(res => {
      //   console.log(res)
      // })
      this.temp.country = this.temp.country || '中国'   
      const temp = this.temp
      if(temp.id){
        // 点击的编辑
        editMassagist(this.temp).then(this.handleCode)
      }else{
        // 点击的添加
        addMassagist(this.temp).then(this.handleCode)
      }
    },
    handleCode(res){
      if(res.code == 200){
						this.$message({
						  message: this.temp.id ? '修改服务成功' : '添加服务成功',
						  type: 'success'
						})
						this.getUserList()
						this.dialogFormVisible2 = false
					}else{
						this.$message({
						  message: res.error,
						  type: 'warning'
						})
					}
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
    area(){
      return this.temp.country + this.temp.province + '省' + this.temp.city + '市'
    },
    indexImg() {
      return function(img) {
        return this.$static + img
        //return this.$static + 'uploads/' + '20190121/567429d6137b7e075648b600a87dcfd2.jpg'
      }
      
    },
    chooseMyCountry(){
      return '中国'
    }
  }
}
</script>
