<template>
	<div class="add">
		<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
		  <el-form-item label="团购名称:" prop="name">
		    <el-input v-model="temp.name"  width="300px" placeholder="请输入团购名称"/>
		  </el-form-item>
		  <el-form-item label="参团人数:" prop="number">
		    <el-input v-model="temp.number" width="300px" placeholder="请输入参团人数"/>
		  </el-form-item>
			 <el-form-item label="折扣:" prop="discount">
			  <el-input v-model="temp.discount"  width="300px" placeholder="请输入折扣"/>
			</el-form-item>
		</el-form>
		<div  class="dialog-footer">
		  <el-button type="primary" @click="updateData()">确认添加</el-button>
		</div>
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
</style>


<script>
import { addAssemble} from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { validateURL } from '@/util/validate'
export default {
  name: 'CreateForm',
	directives: { waves },
  data(){
		return{
			temp:{
				name:'',
				number:'',
				discount:'',
			},
			rules: {
			  name: [{ required: true, message: '团购名称必填', trigger: 'blur' }],
			  number: [{ required: true, message: '参团人数必填', trigger: 'blur' }],
			  discount: [{ required: true, message: '折扣必填', trigger: 'blur' }],
			},
		}
	},
	methods:{
		updateData(){
			this.$refs.dataForm.validate(valid => {
			  if (valid) {
			    this.loading = true
			      addAssemble(this.temp).then( res => {
			        if (res.code == 200) {
			          this.$message({
			            message: '添加团购成功',
			            type: 'success'
			          })
								this.temp.name = ''
								this.temp.number = ''
								this.temp.discount = ''
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

