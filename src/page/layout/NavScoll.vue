<template>
	<div class="text-scoll" v-if="datas != ''">
		<img class="newImg" src="../../assets/images/gong.png" alt="">
		<ul id="con1" ref="con1" :class="{anim:animate==true}">
            <li v-for="item in datas" @click="itemClick(item,$event)">
			<span>{{item.content}}</span>
			</li>

         </ul>
	</div>
</template>

<script>
	import {getMessage} from '@/api/index'
	export default {
	    name:'textScroll', 
		data(){ 
			return { 
				animate:false,
				datas:[], 
				marginLeft: 0, 
				prevLeft: 0, 
				an: '', 
				place: '', 
			} 
		}, 
	    created(){ 
			setInterval(this.scroll,2000);
			this.getMessage();
			setInterval(this.getMessage,30000)
		}, 
		methods:{ 
			 getMessage(){
				 getMessage().then(response => {
				   this.datas = response.data
				 })
			 },
			 scroll(){
               this.animate=true;   
               setTimeout(()=>{      
                     this.datas.push(this.datas[0]);  
                     this.datas.shift();              
                     this.animate=false;  
               },500)
            },
				itemClick: function( item, e ) {
					this.$emit('on-item-click',item ); 
					if(item.type == 'certificate'){
						this.$router.push("/user/card")
					}else if(item.type == 'feedback'){
						this.$router.push("/information/consult")
					}
				},
		} ,
						
	}
</script>

<style>	
    .newImg{
		width: 30px;
		height: 30px;
		vertical-align:middle;
	}
	*{
    margin: 0 ;
    padding: 0;
}
.anim{
    transition: all 0.8s;
    margin-top: -60px;
	font-size: 16px;
}
.text-scoll{
	position: absolute;
	top:18px;
	left: 390px; 
	width: 30%; 
	display: flex;
}
#con1 {
	position: relative;
	top:-8px;
	margin-left: 10px;
}
#con1 li{
    list-style: none;
    line-height: 50px;
    height: 50px;
	font-size: 16px;
	color: #fff;
	cursor: pointer;
	width: 100%;	
}
</style>
