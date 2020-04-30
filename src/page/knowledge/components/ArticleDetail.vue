
<template>
	<div class="add">
		<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
		    <el-form-item label="标题:" prop="name">
		      <el-input v-model="temp.title"  width="300px" placeholder="请输入标题"/>
		    </el-form-item>
		    <el-form-item label="封面图片:" prop="image" label-width="110px" style="margin-bottom: 30px;">
		      <!-- <el-input v-model="temp.image" width="300px" placeholder="请选择图片"/> -->
            
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



		  	 <el-form-item label="简介:" prop="introdouction">
		  	  <el-input v-model="temp.introdouction"  width="300px" placeholder="请输入简介"/>
		  	</el-form-item>
            <el-form-item label="内容:" prop="content">
		  	  <!-- <el-input v-model="temp.content"  width="300px" placeholder="请输入内容"/> -->
                 <el-button type="primary" @click="editDetail()">编辑内容</el-button>
		  	</el-form-item>
              <el-form-item label="视频上传:" prop="video_src">
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
		  	</el-form-item>
		</el-form>
		<div  class="dialog-footer">
		  <el-button type="primary" @click="editData()">确认修改</el-button>
		</div>

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
	</div>
</template>
<style>
.el-form-item__label{
  width: 90px!important;
  text-align: left;
}
.extend{
  overflow: auto;
}
.add{
	margin-top: 40px;
}
.dialog-footer{
	margin-left: 50px;
	margin-top: 40px;
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
import { editAssemble,assembleDeatil,fetchArticle } from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { validateURL } from '@/util/validate'
import Tinymce from '@/components/TinymceAll'
export default {
  name: 'CreateForm',
    directives: { waves },
    components:{
        Tinymce
    },
  data(){
		return{
			temp:{},
                  textMap: {
                    update: 'Edit',
                    create: 'Create'
                },
			rules: {
             name: [{ required: true, message: '标题', trigger: 'blur' }],
             image: [{ required: true, message: '封面图片', trigger: 'blur' }],
             introdouction: [{ required: true, message: '简介', trigger: 'blur' }],
             content: [{ required: true, message: '内容', trigger: 'blur' }],
             video_src: [{ required: true, message: '视频地址', trigger: 'blur' }]        
            },
            id:this.edit_id,
            dialogStatus: '',
            cover:'',
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
            videoList:[],
            videoFlag:false,
            dialogFormVisible2:false,
            content:'',
            relaunch: false,
		}
    },
    props:{
        edit_id:{
            default:"",
            type:String
        }
    },
	created() {
        const id = this.id
        console.log(id)
		this.updateData(id);
    },
	methods:{
        // 详情确认
        		sureContent(){
			// getServiceContent({id:this.contentId,content:this.content}).then(response => {
			//   if(response.code==200){
			// 	  this.$message({
			// 	    message: '编辑服务内容成功',
			// 	    type: 'success'
			// 	  })
			// 		this.dialogFormVisible2 = false;
			// 	}
			// })
			  this.dialogFormVisible2 = false
		},
        // 编辑详情
        editDetail(){
            this.dialogFormVisible2 = true
        },
        // 编辑服务内容
		editContent(id){
			this.relaunch = !this.relaunch
			let that = this
			this.contentId = id
			this.content = ''
			// serviceDetail(id).then( res => {
			// 	if (res.code == 200) {
			// 		that.content = res.data.content
			// 		that.dialogFormVisible2 = true
					
			// 	}
            // })
            that.dialogFormVisible2 = true
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
        onRemoveVideoAdd(file, fileList){
			this.videoList.pop()
			this.add.vedio = ''
		},
		onRemoveVideo(file, fileList){
			this.videoList.pop()
			this.temp.vedio = ''
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
        beforeAvatarUpload(file) {
            console.log(file)
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        		// 添加
		 handleAvatarSuccess(res, file) {
			 console.log(res)
			 console.log(URL.createObjectURL(file.raw))
        	this.add.cover = res.data;
				this.cover = URL.createObjectURL(file.raw)
      },
		updateData(id){
			    this.loading = true
			      fetchArticle(id).then( res => {
			        if (res.code == 200) {
								this.temp = res.data
                                
			        }
			      })
			    this.loading = false
		},
		editData(){
			this.$refs.dataForm.validate(valid => {
			  if (valid) {
			    this.loading = true
			      editAssemble(this.temp).then( res => {
			        if (res.code == 200) {
			          this.$message({
			            message: '修改团购成功',
			            type: 'success'
			          })
              
			        }
			      })
			    this.loading = false
			  } else {
					this.$message({
					  message: '请检查是否填写完整',
					  type: 'warning'
					})
			    console.log('validate failed!!')
			    return false
			  }
			})
		}
	}
}
</script>

