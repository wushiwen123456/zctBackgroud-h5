<template>
	<div class="add">
		<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="220px" style="height=100%;width: 600px; margin-left:50px;">
		  <el-form-item label="合伙人拼团提成率(%):" prop="commission_withdraw_min">
		    <el-input v-model="temp.assemble_commission_rate"  width="200px" placeholder="请输入合伙人拼团提成率(%)" />
		  </el-form-item>
		  <el-form-item label="合伙人提成提现最低限额:" prop="commission_withdraw_min">
			 <el-input v-model="temp.commission_withdraw_min"  width="200px" placeholder="请输入合伙人提成提现最低限额"/>
		  </el-form-item>
		  <el-form-item label="每月免费提现次数:" prop="free_withdraw_per_month">
			<el-input v-model="temp.free_withdraw_per_month"  width="200px" placeholder="请输入每月免费提现次数"/>
		  </el-form-item>
		  <el-form-item label="提现手续费:" prop="withdraw_fee">
			 <el-input v-model="temp.withdraw_fee"  width="200px" placeholder="请输入提现手续费"/>
		  </el-form-item>
		</el-form>
		<div  class="dialog-footer">
		  <el-button type="primary" @click="updateData()">确认修改</el-button>
		</div>
	</div>
</template>
<style>
.el-form-item__label{
  width: 180px!important;
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
 .chooseB span{
			display: inline-block;
			width: 26%;
			border-radius: 6px;
			margin-bottom: 20px;
			text-align: center;
		}
	 .chooseB span:nth-child(3n-1){
			margin: 0 5%;
			margin-bottom: 20px;
		}
.disab{
			border: 1px solid #f2f2f2;
			background-color: #f2f2f2;
			color: #999999;
		}
		.optional{
			background-color: #fff;
			border: 1px solid #dd3e34;
			color: #dd3e34;
		}
		.choosedB{
			background-color:  #dd3e34;
			color: #fff;
		}
</style>


<script>
import { getAward,setAward} from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { validateURL } from '@/util/validate'
export default {
  name: 'CreateForm',
	directives: { waves },
  data(){
		return{
			temp:{
				assemble_commission_rate:'',
				commission_withdraw_min:'',
				free_withdraw_per_month:'',
				withdraw_fee:''
			},
			rules: {
			  assemble_commission_rate: [{ required: true, message: '合伙人拼团提成率(%)必填', trigger: 'blur' }],
			  commission_withdraw_min: [{ required: true, message: '合伙人提成提现最低限额必填', trigger: 'blur' }],
			  free_withdraw_per_month: [{ required: true, message: '每月免费提现次数必填', trigger: 'blur' }],
			  withdraw_fee: [{ required: true, message: '提现手续费必填', trigger: 'blur' }],
			},
		}
	},
	created() {
		this.getAward()
	},
	methods:{
		getAward(){
			getAward().then( res=> {
				if (res.code == 200) {
					this.temp = res.data
				}
			})
		},
		updateData(){
			this.$refs.dataForm.validate(valid => {
			  if (valid) {
			    this.loading = true
			      setAward(this.temp).then( res => {
			        if (res.code == 200) {
			          this.$message({
			            message: '修改规则配置成功',
			            type: 'success'
			          })
						this.getAward()		
			        }else{
						this.$message({
							message: res.error,
							type: 'warning'
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

