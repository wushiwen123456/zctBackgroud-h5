<template>
	<div class="add">
		<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
		  <el-form-item label="用户名:" prop="username">
		    <el-input v-model="temp.username"  width="300px" placeholder="请输入用户名"/>
		  </el-form-item>
		  <el-form-item label="密码:" prop="password">
		    <el-input v-model="temp.password" width="300px" placeholder="请输入密码"/>
		  </el-form-item>
			<el-form-item label="头像:" label-width="90px" prop="cover">
			  <el-upload
				 class="avatar-uploader"
			    action="https://zct.51kdd.com/admin/upload"
			    :show-file-list="false"
			    :on-success="handleAvatarSuccess"
			    :before-upload="beforeAvatarUpload" style="margin-left: 20px;">
			  <img v-if="cover" :src="cover" class="avatar">
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			</el-form-item>
			 <el-form-item label="真实姓名:" prop="realname">
			  <el-input v-model="temp.realname"  width="300px" placeholder="请输入真实姓名"/>
			</el-form-item>
			 <el-form-item label="手机号:" prop="phone">
			  <el-input v-model="temp.phone"  width="300px" placeholder="请输入手机号"/>
			</el-form-item>
			<el-form-item label="职位:" prop="title">
			  <el-input v-model="temp.title"  width="300px" placeholder="请输入职位"/>
			</el-form-item>
			<el-form-item label="级别:" prop="level">
				<el-select @change="selectedChange" v-model="temp.level" placeholder="技师级别" style="width: 130px;">
				  <el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
			<el-form-item label="经验(年):" prop="experience">
			  <el-input v-model="temp.experience"  width="300px" placeholder="请输入经验(年)"/>
			</el-form-item>
		</el-form>
		<div  class="dialog-footer">
		  <el-button type="primary" @click="updateData()">确认添加</el-button>
		</div>
	</div>
</template>
<style>
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
</style>


<script>
import { addMassagist,getFeedbacksType } from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { validateURL } from '@/util/validate'
export default {
  name: 'CreateForm',
	directives: { waves },
  data(){
		return{
			levelOptions: [
				{id: 0, name: '初级'},
				{id: 1, name: '中级'},
				{id: 2, name: '高级'}
			],
			cover: '',
			temp:{
				username:'',
				password:'',
				realname:'',
				phone:'',
				title:'',
				experience:''
			},
			rules: {
			  username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
			  password: [{ required: true, message: '密码必填', trigger: 'blur' }],
			  realname: [{ required: true, message: '真实姓名必填', trigger: 'blur' }],
			  phone: [{ required: true, message: '手机号必填', trigger: 'blur' }],
			  title: [{ required: true, message: '职位必填', trigger: 'blur' }],
			  experience: [{ required: true, message: '经验年限必填', trigger: 'blur' }],
			},
		}
	},
	methods:{
		handleAvatarSuccess(res, file) {
			 console.log(URL.createObjectURL(file.raw))
				this.temp.avatarurl = res.data
				this.cover = URL.createObjectURL(file.raw)
			},
			beforeAvatarUpload(file) {
		
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isLt2M;
			},
		selectedChange(level){
			this.temp.level = level
		},
		updateData(){
			this.$refs.dataForm.validate(valid => {
			  if (valid) {
			    this.loading = true
			      addMassagist(this.temp).then( res => {
			        if (res.code == 200) {
			          this.$message({
			            message: '添加技师成功',
			            type: 'success'
			          })
								this.temp.username = ''
								this.temp.password = ''
								this.temp.realname = ''
								this.temp.phone = ''
								this.temp.title = ''
								this.temp.experience = ''
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

