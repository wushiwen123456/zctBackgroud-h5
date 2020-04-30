<template>
	<div class="add">
		<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="height=100%;width: 600px; margin-left:50px;">
		  <el-form-item label="订单编号:" prop="number">
		    <el-input v-model="number"  width="300px" placeholder="请输入订单编号" @keyup.enter.native="handleFilter"/>
		    <span v-if="none">没有此订单</span>
			</el-form-item>
			<el-form-item label="预约方式:" prop="realname" v-if="reducedtype">
			  <el-select  v-model="temp.mode" @change="selectedChangeType" placeholder="预约方式" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
			    <el-option v-for="item in moded" :key="item.id" :label="item.name" :value="item.id"/>
			  </el-select>
			</el-form-item>
			<el-form-item label="上门费减免:" prop="realname" v-if="reduced">
			  <el-select v-model="temp.use_reduce" placeholder="上门费减免" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
			    <el-option v-for="item in reduce" :key="item.id" :label="item.name" :value="item.id"/>
			  </el-select>
			</el-form-item>
			<div v-if="contented">
				<el-form-item label="预约日期:" prop="password">
				  <el-select  @change="selectedChange" v-model="temp.date" placeholder="日期" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
				    <el-option v-for="item in date" :key="item.date" :label="item.date" :value="item.date"/>
				  </el-select>
				</el-form-item>
				<el-form-item  label="预约时间:" prop="password">
					<div class="chooseB">
						<span class="disab"  v-for="(ti,index) in times" :key="index" v-if="ti.available == 0" @click="chooseGetTimes(ti,index)">{{ti.value}}</span>
						<span class="optional"  v-for="(ti,index) in times" :key="index" :class="isaa == index ? 'choosedB':''" v-if="ti.available == 1" @click="chooseGetTimes(ti,index)">{{ti.value}}</span>
					</div>
				</el-form-item>
				<el-form-item label="可预约技师:" prop="password">
				  <el-select  v-model="temp.massagist_id" placeholder="技师" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
				    <el-option v-for="item in massigst" :key="item.id" :label="item.realname" :value="item.id"/>
				  </el-select>
				</el-form-item>
				 <el-form-item label="联系人:" prop="contact">
				   <el-input v-model="temp.contact"  width="300px" placeholder="请输入联系人"/>
				 </el-form-item>
				 <el-form-item label="联系电话:" prop="phone">
				  <el-input v-model="temp.phone"  width="300px" placeholder="请输入联系电话"/>
				</el-form-item>
				<el-form-item label="服务地点:" prop="address">
				  <el-input v-model="temp.address"  width="300px" placeholder="请输入服务地点"/>
				</el-form-item>
			</div>
		</el-form>
		<div  class="dialog-footer" v-if="contented">
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
import { addAppointment,massagst,searchOrder,reduceGet,date,times} from '@/api/index'
import waves from '@/directive/waves' // Waves directive
import { validateURL } from '@/util/validate'
export default {
  name: 'CreateForm',
	directives: { waves },
  data(){
		return{
			temp:{
				order_id:'',
				mode:'',
				use_reduce:0,
				date:'',
				begin:'',
				end:'',
				contact:'',
				phone:'',
				address:''
			},
			number:'',
			contented:false,
			reducedtype:false,
			none:false,
			user_id:'',
			massigst:'',
			reduced:false,
			date:'',
			times:'',
			isaa:'',
			moded:[
				{id:'1',name:"到店服务"},
				{id:'2',name:"上门服务"}
			],
			reduce:[
				{id:0,name:'否'},
				{id:1,name:'是'},
			],
			rules: {
// 			  username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
// 			  password: [{ required: true, message: '密码必填', trigger: 'blur' }],
// 			  realname: [{ required: true, message: '真实姓名必填', trigger: 'blur' }],
// 			  phone: [{ required: true, message: '手机号必填', trigger: 'blur' }],
// 			  title: [{ required: true, message: '职位必填', trigger: 'blur' }],
// 			  experience: [{ required: true, message: '经验年限必填', trigger: 'blur' }],
			},
		}
	},
	created() {
		this.getDate()
		this.getTimes()
	},
	methods:{
		selectedChangeType(){
			if(this.temp.mode == 1){
				this.reduced = false
			}else if(this.temp.mode == 2){
				this.getreduce();
				this.reduced = true
			}
		},
		selectedChange(){
			 this.temp.date = this.temp.date.replace("-","")
		},
		handleFilter(){
			searchOrder({number:this.number}).then( res=> {
				if (res.code == 200) {
					if(res.data != ''){
						this.contented = true
						this.temp.order_id = res.data[0].id
						this.user_id = res.data[0].user_id
						this.reducedtype = true
					}else{
						this.none = true
						this.contented = false
						this.reducedtype = false
					}
				}
			})
		},
		getDate(){
			date().then( res=> {
				if (res.code == 200) {
					this.date = res.data
				}
			})
		},
		getTimes(){
			times().then( res=> {
				if (res.code == 200) {
					this.times = res.data
				}
			})
		},
		chooseGetTimes(e,index){
				this.isaa = index;
				console.log(e)
				if(e.available == 0){
					this.$message({
					  message: '该时间段不可选择',
					  type: 'warning'
					})
				}else{
					this.temp.begin = e.begin
					this.temp.end = e.end
					this.massigsted()
				}
		},
		massigsted(){
			massagst({date:this.temp.date,begin:this.temp.begin,end:this.temp.end}).then( res=> {
				if (res.code == 200) {
					this.massigst = res.data
				}
			})
		},
		getreduce(){
			reduceGet({user_id:this.user_id}).then( res=> {
				if (res.code == 200) {
					if(res.data > 0){
						this.reduced = true
					}
				}
			})
		},
		updateData(){
			this.$refs.dataForm.validate(valid => {
			  if (valid) {
			    this.loading = true
			      addAppointment(this.temp).then( res => {
			        if (res.code == 200) {
			          this.$message({
			            message: '添加预约服务成功',
			            type: 'success'
			          })
								this.temp.order_id = ''
								this.temp.contact = ''
								this.temp.phone = ''
								this.temp.address = ''
								this.temp.use_reduce = ''
								this.temp.massagist_id = ''
								this.temp.date = ''
								this.temp.begin = ''
								this.temp.end = ''
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

