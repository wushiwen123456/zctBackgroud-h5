<template>

  <div class="app-container" ref="test">
    <el-scrollbar>
    <div class="filter-container">
			<el-select @change="selectedChange" v-model="listQuery.category_id" placeholder="服务类型" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
			  <el-option v-for="item in trusteeTypeOptions" :key="item.id" :label="item.name" :value="item.id"/>
			</el-select>
        <el-button @click="dialogFormVisible1 = true" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">添 加</el-button>
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
			<el-table-column label="服务分类名称" align="center" min-width="150px">
			  <template slot-scope="scope">
			    <span>{{ scope.row.category_name }}</span>
			  </template>
			</el-table-column>
      <el-table-column label="服务名称" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
			<el-table-column label="服务简介" align="center" width="350px">
			  <template slot-scope="scope">
			    <span>{{ scope.row.introduction }}</span>
			  </template>
			</el-table-column>
      <el-table-column label="服务图片" align="center" min-width="200px">
        <template slot-scope="scope">
           <img class="user-head" :src="indexImg(scope.row.cover)" />
        </template>
      </el-table-column>
      <el-table-column label="查看人数" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.view }}</el-tag>
        </template>
      </el-table-column>
			<el-table-column label="状态" align="center" min-width="100px">
			  <template slot-scope="scope">
			    <el-tag v-if="scope.row.status == 1">展示</el-tag>
			    <el-tag v-if="scope.row.status == 0">隐藏</el-tag>
			  </template>
			</el-table-column>
      <el-table-column label="操作" align="center" width="360" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleUpdate(scope.row.id)">编辑</el-button>
            <el-button type="info" size="small" @click="editContent(scope.row.id)">详情</el-button>
						<router-link style="margin-left: 10px;" :to="'/service/skus/'+scope.row.id">
						 <el-button type="primary" size="small">套餐</el-button>
						</router-link>
            <el-button type="danger" size="small" @click="deleted(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-scrollbar>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getFeedbacks" />
    <!-- 添加 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible1" customClass="customWH">
		  <el-scrollbar style="height:100%">
		  <el-form ref="dataForm" :rules="rules" :model="add" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
				<el-form-item label="服务分类" prop="category">
				  <el-select  v-model="add.category_id" placeholder="服务类型" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
				    <el-option v-for="item in trusteeTypeOptions" :key="item.id" :label="item.name" :value="item.id"/>
				  </el-select>
				</el-form-item>
		    <el-form-item label="服务名称" prop="symbol">
		      <el-input v-model="add.name"  width="300px" placeholder="请输入服务名称"/>
		    </el-form-item>
		    <el-form-item label="封面图片:" label-width="90px" prop="cover" style="margin-bottom: 30px;">
		      <el-upload
					 class="avatar-uploader"
            action="https://zct.51kdd.com/admin/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <img v-if="cover" :src="cover" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
			  </el-upload>
		    </el-form-item>
				<el-form-item label="轮播图片:" label-width="90px" prop="carousel" style="margin-bottom: 30px;">
				  <el-upload
                  action="https://zct.51kdd.com/admin/upload"
                  list-type="picture-card"
				  :limit="5"
                  :on-preview="handlePictureCardPreview"
				  :on-remove="handleRemoveAdd"
				  :on-success="handleSuccess"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="add.carousel" alt="">
          </el-dialog> -->
		  </el-form-item>
		  <el-form-item label="视频上传" prop="Video">  
		    <el-upload class="avatar-uploader el-upload--text" 
			  action="https://zct.51kdd.com/admin/upload" 
			  :show-file-list="true" 
				:file-list="videoList"
			  :on-success="handleVideoSuccess" 
			  :before-upload="beforeUploadVideo" 
				:on-remove="onRemoveVideoAdd"
			  > 
			  <video v-if="add.vedio !='' && videoFlag == false" :src="$static + add.vedio" class="avatar" controls="controls">您的浏览器不支持视频播放</video> 
			  <i v-else-if="add.vedio =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i> 
			  <!-- <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress> -->
			  </el-upload> 
			<P class="text">请保证视频格式正确，且不超过100M</P> 
			</el-form-item>
		    <el-form-item label="服务简介:" prop="introduction">
		      <el-input v-model="add.introduction" type="textarea" :rows="6" placeholder="请输入服务介绍"/>
		    </el-form-item>
				<el-form-item label="分享标题:" prop="introduction">
				  <el-input v-model="add.share_title" type="textarea" :rows="6" placeholder="请输入分享标题"/>
				</el-form-item>
				 <el-form-item label="上门费:" prop="drop_in_fee">
				  <el-input v-model="add.drop_in_fee"  width="300px" placeholder="请输入上门费"/>
				</el-form-item>
				 <el-form-item label="初级手工费:" prop="introduction">
				  <el-input v-model="add.handwork_fee"  width="300px" placeholder="请输入初级技师手工费"/>
				</el-form-item>
				<el-form-item label="中级手工费:" prop="introduction">
				  <el-input v-model="add.handwork_fee_middle"  width="300px" placeholder="请输入中级技师手工费"/>
				</el-form-item>
				<el-form-item label="高级手工费:" prop="introduction">
				  <el-input v-model="add.handwork_fee_high"  width="300px" placeholder="请输入高级技师手工费"/>
				</el-form-item>
				 <el-form-item label="服务耗时(分钟):" prop="cost">
				  <el-input v-model="add.cost"  width="300px" placeholder="请输入服务耗时(分钟)"/>
				</el-form-item>
		  </el-form>
		  </el-scrollbar>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible1 = false">取消</el-button>
		    <el-button type="primary" @click="createData()">确认</el-button>
		  </div>
		</el-dialog>
		<!-- 编辑 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" customClass="customWH">
      <el-scrollbar style="height:100%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
				<el-form-item label="服务分类" prop="category">
				  <el-select  v-model="temp.category_id" placeholder="服务类型" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
				    <el-option v-for="item in trusteeTypeOptions" :key="item.id" :label="item.name" :value="item.id"/>
				  </el-select>
				</el-form-item>
        <el-form-item label="服务名称" prop="symbol">
          <el-input v-model="temp.name"  width="300px" placeholder="请输入服务名称"/>
        </el-form-item>
        <el-form-item label="封面图片:" label-width="90px" prop="cover" style="margin-bottom: 30px;">
          <el-upload
        	  class="avatar-uploader"
            action="https://zct.51kdd.com/admin/upload"
            :show-file-list="false"
            :on-success="edithandleAvatarSuccess"
            :before-upload="editbeforeAvatarUpload">
          <img v-if="temp.cover" :src="indexImg(temp.cover)" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
        <el-form-item label="轮播图片:" label-width="90px" prop="carousel" style="margin-bottom: 30px;">
          <!-- <el-upload
            action="https://zct.51kdd.com/admin/upload"
            list-type="picture-card"
        		:limit="5"
            :on-preview="edithandlePictureCardPreview"
        		:on-success="edithandleSuccess"
            >
            <i class="el-icon-plus"></i>
          </el-upload> -->
		  <el-upload
		  class="upload-demo"
		  action="https://zct.51kdd.com/admin/upload"
		  :on-preview="edithandlePictureCardPreview"
		  :on-success="edithandleSuccess"
		  :on-remove="handleRemove"
		  :file-list="fileList"
		  :limit="5"
		  list-type="picture">
		  <el-button size="small" type="primary">点击上传</el-button>
		  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
		</el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible">
            <img v-for="(car,index) in temp.carousel" :key="index" style="width: 100px;height: 100px;" :src="car" alt="">
          </el-dialog> -->
        </el-form-item>
		<el-form-item label="视频上传" prop="Video">  
		  <el-upload class="avatar-uploader el-upload--text" 
			  action="https://zct.51kdd.com/admin/upload" 
			  :show-file-list="true"
				:file-list="videoList"
			  :on-success="handleVideoSuccessEdit" 
				:on-remove="onRemoveVideo"
			  :before-upload="beforeUploadVideoEdit" 
			  > 
			  <video v-if="temp.vedio !='' && videoFlag == false" :src="$static + temp.vedio" class="avatar" controls="controls">您的浏览器不支持视频播放</video> 
			  <i v-else-if="temp.vedio =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i> 
			  <!-- <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress> -->
			  </el-upload> 
			<P class="text">请保证视频格式正确，且不超过100M</P> 
			</el-form-item>
        <el-form-item label="服务简介:" prop="introduction">
          <el-input v-model="temp.introduction" type="textarea" :rows="6" placeholder="请输入服务介绍"/>
        </el-form-item>
				<el-form-item label="分享标题:" prop="introduction">
				  <el-input v-model="temp.share_title" type="textarea" :rows="6" placeholder="请输入分享标题"/>
				</el-form-item>
				 <el-form-item label="上门费:" prop="drop_in_fee">
				  <el-input v-model="temp.drop_in_fee"  width="300px" placeholder="请输入上门费"/>
				</el-form-item>
				 <el-form-item label="初级手工费:" prop="introduction">
				  <el-input v-model="temp.handwork_fee"  width="300px" placeholder="请输初级技师入手工费"/>
				</el-form-item>
				<el-form-item label="中级手工费:" prop="introduction">
				  <el-input v-model="temp.handwork_fee_middle"  width="300px" placeholder="请输入中级技师手工费"/>
				</el-form-item>
				<el-form-item label="高级手工费:" prop="introduction">
				  <el-input v-model="temp.handwork_fee_high"  width="300px" placeholder="请输入高级技师手工费"/>
				</el-form-item>
				 <el-form-item label="服务耗时(分钟):" prop="cost">
				  <el-input v-model="temp.cost"  width="300px" placeholder="请输入服务耗时(分钟)"/>
				</el-form-item>
				<el-form-item label="选择人数:" prop="introduction">
				  <el-input v-model="temp.view"  width="300px" placeholder="请输入高级技师手工费"/>
				</el-form-item>
      </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
      </div>
    </el-dialog>
		<!-- 添加内容 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2" customClass="customWH">
      <el-scrollbar ref="test2" style="height:100%">
				<el-form ref="postForm"  :rules="rules" class="form-container">
					<el-form-item prop="content" style="margin-bottom: 30px;">
					  <Tinymce ref="editor" :height="400" v-model="content" :relaunch="relaunch"/>
					</el-form-item>
				</el-form>	
		  </el-scrollbar>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible2 = false">取消</el-button>
		    <el-button type="primary" @click="sureContent()">确认</el-button>
		  </div>
		</el-dialog>

		










		  <el-dialog title="套餐详情" :visible.sync="taoCan" >
      <el-scrollbar>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
        <el-form-item label="套餐名称">
          <!-- <span>{{ taoCanInfo.name }}</span> -->
		  <el-input v-model="taoCanInfo.name"  width="300px" placeholder="请输入服务名称" :disabled="isTanCanDisabled"/>
        </el-form-item>
        <el-form-item label="套餐价格">
          <span>{{taoCanInfo.price}}</span>
        </el-form-item>
        <el-form-item label="服务次数">
          <span>{{ taoCanInfo.times }}元</span>
        </el-form-item>
        <el-form-item label="备注">
          <span>{{ taoCanInfo.remake }}</span>
        </el-form-item>
        <el-form-item label="推荐奖励现金券(用户)">
          <span style="padding-left:20px">{{ taoCanInfo.coupon_for_user_recommend }}</span>
        </el-form-item>
        <el-form-item label="推广奖励现金券(合伙人)">
          <span style="padding-left:20px">{{ taoCanInfo.coupon_for_copemate_recommend}}</span>
        </el-form-item>
        <el-form-item label="赠送上门服务减免次数">
          <span style="padding-left:20px">{{ taoCanInfo.fee_reduce_count }}</span>
        </el-form-item>
				<!-- <el-form-item label="评价标签">
				  <span v-for="(aa,index) in temp.tags" :key="index">{{aa}}</span>
				</el-form-item>
				<el-form-item label="评价内容">
				  <span>{{ temp.comment }}</span>
				</el-form-item>
				<el-form-item label="评价时间">
				  <span>{{ temp.create_time }}</span>
				</el-form-item>
				<el-form-item label="是否隐藏">
				  <span v-if="temp.isdel == 0">否</span>
				  <span v-if="temp.isdel == 1">是</span>
				</el-form-item> -->
      </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="temp.isdel == 0" @click="display(temp.id)">隐藏此评价</el-button>
				<el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>




  </div>
</template>
<style>
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
	.user-head{
		width:180px;
		height: 90px;
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
import Tinymce from '@/components/TinymceAll'
import Upload from '@/components/Upload/singleImage2'
import { getFeedbacks,getFeedbacksType,addService,serviceDetail,editService,deleteService,getServiceContent, } from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/util'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import { skusDeatil } from '@/api/index'

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
  name: 'NewsList',
  components: { Pagination,Upload,Tinymce},
  directives: { waves },
  filters: {
    statusFilter(status, type) {
      if (type == 0) {
        const statusMap = {
            0: 'success',
            1: 'danger'
          }
        return statusMap[status]
      } else {
        const statusMap = {
            0: '已发布',
            1: '已删除'
          }
        return statusMap[status]
      }
    },
    statusOpFilter(status) {
       const statusMap = {
            0: '删除',
            1: '发布'
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
			relaunch: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
		category_id:'',
      },
	fileList: [],
	videoList:[],
	trusteeTypeOptions:'',
	videoFlag:false,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
			dialogVisible: false,
			add:{
				category_id: undefined,
				name: '',
				cover: '',
				carousel:[],
				vedio:'',
				introduction: '',
				drop_in_fee: '',
				handwork_fee:'',
				cost:'',
			},
			cover:'',
      temp: {
		id: undefined,
        category_id: undefined,
        name: '',
        cover: '',
				carousel:[],
        vedio:'',
        introduction: '',
        drop_in_fee: '',
		handwork_fee:'',
        cost:'',
      },
      dialogFormVisible: false,
			dialogFormVisible1: false,
			dialogFormVisible2: false,
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
			content:'',
			contentId:'',
			taoCan:false,
			taoCanInfo:{},
			isTanCanDisabled:true
    }
  },
  created() {
		this.getFeedbacksType()
    this.getFeedbacks()
  },
  methods: {
		selectedChange(){
		  this.getFeedbacks()
		},
    getFeedbacks(){
      this.listLoading = true
      getFeedbacks(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        if (this.list.length == this.listQuery.limit)
          this.listQuery.limit++
        this.listLoading = false
      })
    },
		getFeedbacksType(){
			getFeedbacksType().then(response => {
			  this.trusteeTypeOptions = response.data
				console.log(response.data)
			})
		},
    handleFilter() {
      this.listQuery.page = 1
      this.getFeedbacks()
    },
		// 添加
		 handleAvatarSuccess(res, file) {
			 console.log(res)
			 console.log(URL.createObjectURL(file.raw))
        	this.add.cover = res.data;
				this.cover = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
		console.log(file)
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
	  handleSuccess(res, file) {
		this.add.carousel.push(res.data)
      },
      handlePictureCardPreview(file) {
				console.log(file.url)
        this.add.carousel = file.url;
        this.dialogVisible = true;
      },
	  beforeUploadVideo(file) {
         const isLt10M = file.size / 1024 / 1024  < 100;
         if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
             this.$message.error('请上传正确的视频格式');
             return false;
         }
         if (!isLt10M) {
             this.$message.error('上传视频大小不能超过100MB哦!');
             return false;
         }
      },
		handleVideoSuccess(res, file) { 
			//获取上传图片地址 
			console.log(res.data)
			this.videoFlag = false; 
			this.videoUploadPercent = 0; 
			if(res.code == 200){ 
				// this.add.videoUploadId = res.data.uploadId; 
				this.add.vedio = res.data; 
				this.videoList.splice(0,1,{name: res.data})
			}else{ 
				this.$message.error('视频上传失败，请重新上传！'); 
			} 
		},
		onRemoveVideoAdd(file, fileList){
			this.videoList.pop()
			this.add.vedio = ''
		},
		onRemoveVideo(file, fileList){
			this.videoList.pop()
			this.temp.vedio = ''
		},

			createData(){
				this.listLoading = true
				let carousel = this.add.carousel
				this.add.carousel = this.add.carousel.join(',')
				addService(this.add).then(response => {
				  if(response.code == 200){
						this.$message({
						  message: '添加服务成功',
						  type: 'success'
						})
						this.getFeedbacks()
						this.dialogFormVisible1 = false
					}else{
						this.$message({
						  message: response.error,
						  type: 'warning'
						})
					}
				  this.listLoading = false
					this.add.carousel = carousel
				})
			},
			// 修改
			edithandleAvatarSuccess(res, file) {
						 console.log(res)
						 console.log(URL.createObjectURL(file.raw))
			   this.temp.cover = res.data;
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
			 edithandlePictureCardPreview(file) {
			   // this.temp.carousel = file.url;
			   this.dialogVisible = true;
			 },
			  handleRemove(file, fileList) {
				let uri = file.url.split(this.$static)[1]
				let index = this.temp.carousel.indexOf(uri)
				if (index > -1){
					this.temp.carousel.splice(index, 1)
					this.fileList.splice(index, 1)
				}
			  },
			  handleRemoveAdd(file, fileList) {
						let uri = file.url.split(this.$static)[1]
						let index = this.temp.carousel.indexOf(uri)
						if (index > -1){
							this.temp.carousel.splice(index, 1)
							this.fileList.splice(index, 1)
						}
			  },
			beforeUploadVideoEdit(file) {
			   const isLt10M = file.size / 1024 / 1024  < 100;
			   if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
			       this.$message.error('请上传正确的视频格式');
			       return false;
			   }
			   if (!isLt10M) {
			       this.$message.error('上传视频大小不能超过100MB哦!');
			       return false;
			   }
			},
			handleVideoSuccessEdit(res, file) { 
				//获取上传图片地址 
				console.log(res.data)
				this.videoFlag = false; 
				this.videoUploadPercent = 0; 
				if(res.code == 200){
					// this.add.videoUploadId = res.data.uploadId;
					this.temp.vedio = res.data;
					this.videoList.splice(0,1,{name: res.data})
				}else{ 
					this.$message.error('视频上传失败，请重新上传！'); 
				} 
			},
			 updateData(){
			 	this.listLoading = true
				let carousel = this.temp.carousel
				this.temp.carousel = this.temp.carousel.join(',')
			 	editService(this.temp).then(response => {
			 	  if(response.code == 200){
			 			this.$message({
			 			  message: '修改服务成功',
			 			  type: 'success'
			 			})
						this.getFeedbacks()
			 			this.dialogFormVisible = false
			 		}else{
			 			this.$message({
			 			  message: response.error,
			 			  type: 'warning'
			 			})
			 		}
			 	  
			 	  this.listLoading = false
					this.temp.carousel = carousel
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
		handleUpdate(id,type) {
		  // this.temp = Object.assign({}, row) // copy obj
			let that = this
			if(type == 'tao'){
				skusDeatil(id).then(res => {
					that.taoCanInfo = res.data
					that.taoCan = true
				})
			}else{
				serviceDetail(id).then(response => {
				
			  that.temp = response.data
				if (!(that.temp.carousel instanceof Array) && that.temp.carousel instanceof Object){
					// that.temp.carousel = that.temp.carousel
					
					let array = new Array()
					array.push(that.temp.carousel[1])
					that.temp.carousel = array
				}
			  that.dialogFormVisible = true
			  that.fileList = []
			  if (that.temp.carousel.length > 0) {
				  for(let index in that.temp.carousel){
					  let item = that.$static + that.temp.carousel[index]
					  that.fileList.push({url: item})
				  }
				that.dialogVisible = true
			  }
				that.videoList = []
				if (that.temp.vedio)
					that.videoList.push({name: that.temp.vedio})
			  that.listLoading = false
			})
			}
		},
		// 删除服务
		deleted(id){
			
			this.$confirm('确认要删除该服务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteService(id).then(res => {
            if(res.code == 200){
          		this.$message({
          		  message: '删除服务成功',
          		  type: 'success'
          		})
          		this.getFeedbacks();
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
		// 编辑服务内容
		editContent(id){
			this.relaunch = !this.relaunch
			let that = this
			this.contentId = id
			this.content = ''
			serviceDetail(id).then( res => {
				if (res.code == 200) {
					that.content = res.data.content
					that.dialogFormVisible2 = true
					
				}
			})
		},
		sureContent(){
			 this.listLoading = true
			getServiceContent({id:this.contentId,content:this.content}).then(response => {
			  if(response.code==200){
				  this.$message({
				    message: '编辑服务内容成功',
				    type: 'success'
				  })
					this.dialogFormVisible2 = false;
				}
			  this.listLoading = false
			})
		}
  },
  computed: {
// 		header(){
// 			return{
// 				Accept: 'application/json, text/plain',
// 				authKey:localStorage.getItem('authkey')
// 			}
// 		},
    indexImg() {
      return function(img) {
        return this.$static + img
        //return this.$static + 'uploads/' + '20190121/567429d6137b7e075648b600a87dcfd2.jpg'
      }
      
    },
  }
}
</script>
