<template>
	<div class="add">
		<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
		   <el-form-item label="套餐名称:" prop="name">
		      <el-input v-model="temp.name"  width="300px" placeholder="请输入套餐名称"/>
		    </el-form-item>
		    <el-form-item label="套餐价格:" prop="price">
		      <el-input v-model="temp.price" width="300px" placeholder="请输入套餐价格"/>
		    </el-form-item>
		  	 <el-form-item label="含服务次数:" prop="times">
		  	  <el-input v-model="temp.times"  width="300px" placeholder="请输入含服务次数"/>
		  	</el-form-item>
		  	 <el-form-item label="备注:" prop="remark">
		  	  <el-input v-model="temp.remark"  width="300px" placeholder="请输入备注"/>
		  	</el-form-item>
		  	<el-form-item label="推荐奖励现金券(用户):" prop="coupon_for_user_recommend">
		  	  <el-input v-model="temp.coupon_for_user_recommend"  width="300px" placeholder="请输入推荐奖励现金券(用户)"/>
		  	</el-form-item>
		  	<el-form-item label="推荐奖励现金券(合伙人):" prop="coupon_for_copemate_recommend">
		  	  <el-input v-model="temp.coupon_for_copemate_recommend"  width="300px" placeholder="请输入推荐奖励现金券(合伙人)"/>
		  	</el-form-item>
		  	<el-form-item label="赠送上门服务减免次数:" prop="fee_reduce_count">
		  	  <el-input v-model="temp.fee_reduce_count"  width="300px" placeholder="请输入赠送上门服务减免次数"/>
		  	</el-form-item>
		  </el-form>
		<div  class="dialog-footer">
		  <el-button type="primary" @click="editData()">确认修改</el-button>
		</div>
	</div>
</template>
<style>
.el-form-item__label{
  width: 180px!important;
  text-align: left;
}
.el-form-item__content{
	margin-left: 200px !important;
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
import { skusDeatil,editSkus } from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { validateURL } from '@/util/validate'
export default {
  name: 'CreateForm',
	directives: { waves },
  data(){
		return{
			temp:{
				product_id:'',
				name:'',
				price:'',
				times:'',
				remark:'',
				coupon_for_user_recommend:'',
				coupon_for_copemate_recommend:'',
				fee_reduce_count:''
			},
			
			rules: {
			  name: [{ required: true, message: '套餐名称必填', trigger: 'blur' }],
			    price: [{ required: true, message: '套餐价格必填', trigger: 'blur' }],
			    times: [{ required: true, message: '含服务次数必填', trigger: 'blur' }],
			    // remark: [{ required: true, message: '备注必填', trigger: 'blur' }],
			    coupon_for_user_recommend: [{ required: true, message: '推荐奖励现金券(用户)必填', trigger: 'blur' }],
			    coupon_for_copemate_recommend: [{ required: true, message: '推荐奖励现金券(合伙人)必填', trigger: 'blur' }],
			  	fee_reduce_count: [{ required: true, message: '赠送上门服务减免次数必填', trigger: 'blur' }],
			  },
		}
	},
	created() {
		const id = this.$route.params && this.$route.params.id
		console.log(id)
		this.temp.id = id
		this.updateData(id);
	},
	methods:{
		updateData(id){
			    this.loading = true
			      skusDeatil(id).then( res => {
			        if (res.code == 200) {
								this.temp.product_id = res.data.product_id
								this.temp.name = res.data.name
								this.temp.price = res.data.price
								this.temp.times = res.data.times
								this.temp.remark = res.data.remark
								this.temp.coupon_for_user_recommend = res.data.coupon_for_user_recommend
								this.temp.coupon_for_copemate_recommend = res.data.coupon_for_copemate_recommend
								this.temp.fee_reduce_count = res.data.fee_reduce_count
			        }
			      })
			    this.loading = false
		},
		editData(){
			this.$refs.dataForm.validate(valid => {
			  if (valid) {
			    this.loading = true
			      editSkus(this.temp).then( res => {
			        if (res.code == 200) {
			          this.$message({
			            message: '修改套餐成功',
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

