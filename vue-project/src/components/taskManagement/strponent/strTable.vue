<template>
	<div>
		<el-table :data="$store.state.strageDatas" stripe border tooltip-effect="dark" style="width:100%">
	        <!-- <el-table-column type="selection"></el-table-column> -->
			<!-- <el-table-column prop="name" label="策略名称" class="strClick"></el-table-column> -->
			<el-table-column label="策略名称">
				<template scope="scope">

				 <el-popover trigger="click" placement="top">

				 	<div class="strmsg" v-if="popShow">
				 		<p>策略名称: {{ scope.row.name }}</p>
		          		<p>执行方式: {{ execMode }}</p>
		          		<p>远程主机: {{ execNode}}</p>
		          		<p>将导出的文件发送到服务器: {{isPassExport }}</p>
		          		<p>级别: {{logLevel }}</p>
				 	</div>
		          

		          <div slot="reference" class="name-wrapper">
		            <span @click="strNamePopover(scope.row)">{{ scope.row.name }}</span>
		          </div>

		        </el-popover>
					
				</template>
				
			</el-table-column>

			<el-table-column prop="time" label="创建时间" show-overflow-tooltip></el-table-column>
			<el-table-column label="关联任务" show-overflow-tooltip>
				<template scope="scope">
					<!-- <span class="icon-lock"></span> -->
					<span class="fa fa-link" @click.stop="dutychain(scope.row)"></span>
				</template>
			</el-table-column>
			<el-table-column label="查看关联" show-overflow-tooltip>
				<template scope="scope">
					<span class="el-icon-view" @click.stop="querychain(scope.row)"></span>
				</template>
			</el-table-column>
			<el-table-column label="操作" flixed="right">
				<template scope="scope">
					<el-button size="small" type="text" @click.stop="reviseSingle(scope.row)">修改</el-button>
					<el-button size="small" type="text" @click.stop="deleteSingle(scope.row)">删除</el-button>
				</template>
			</el-table-column>
			
		</el-table> 

		<!-- 修改的遮罩层 -->
		<revise-str v-if="$store.state.strRevise.layShow" :str-id="clickStrId" :str-name="clickStrName"></revise-str>

		
		<!-- 关联任务, 查看关联 -->
		<duty-chain v-if="$store.state.dutyChain.layShow" :str-id="clickStrId" :str-name="clickStrName" :duty-type="dutyType"></duty-chain>

	</div>
</template>

<script>
 	import commonFun from '../common.js';
 	import url from '../../../url/urls.js';

 	import reviseStr from './reviseStr';

 	import dutyChainCom from './dutyChain';
	// import queryChainCom from './queryChain';

 	const PostAjax = commonFun.PostAjax;
 	const RequestError = commonFun.RequestError;

 	const urls = url.taskMange;

	export default {
		data(){
			return {
				popShow: false,
				clickStrId:'',
				clickStrName:'',
				multipleSelection: '',
				dutyType:'',
				execMode:'',
				execNode:'',
				isPassExport: '',
				logLevel:''
			}
		},
		created(){
			// this.tableData = this.$store.state.strageDatas;
			// console.log(this.$store.state)
		},
		mounted(){

		},
		methods:{
			openPopComm(text,row){

				this.clickStrId = row.id;
		     	this.clickStrName = row.name;
			 	let obj = {type: 'open'};
			 	this.$store.dispatch(text,obj);
			 	
			},
			/*任务关联*/
			dutychain(row){

				this.dutyType = '关联任务';
				this.openPopComm('dutyChainShow',row);

			},
			 /*查看关联*/
			querychain(row){

				this.dutyType = '查看关联';
				this.openPopComm('dutyChainShow',row);
			},
		     /*修改*/
		    reviseSingle(row){

				this.openPopComm('resetStreviseMessage',row);

		     },
		     /*删除*/
		    deleteSingle(row){
		     	let message = "确认是否删除";

		     	 this.$confirm(message,'提示',{
		            confirmButonText:'确认',
		            cancelButtonText:'取消',
		            showCancelButton:true,
		            confirmButtonPosition:'left',
		            type:'warning',
		            beforeClose: (action, instance, done) => {
		            	if(action === 'confirm'){
		            		instance.confirmButtonLoading = true;
		            		instance.confirmButtonText = '修改中...';

		            		this.sendDelMessage(row,instance,done);

		            	}else{
		            		 done();
		            	}
		            },
		          }).then(()=>{
		             
		          }).catch(()=>{
		          	
		          })

		    },
		    sendDelMessage(row,instance,done){
		     	let param = {strategy: row.id};

		     	let promise = PostAjax(urls.sendDeleteStr,param);

		     	promise.done((res)=>{
		     		let code = res.code;
		     		let message = res.message;

		     		if(code === 0){
		     			let message = res.message;
		     			instance.message = "删除成功";
		     			instance.confirmButtonText = "确认";
		     			instance.showConfirmButton = false;
		     			instance.cancelButtonText = '关闭';
		     			instance.confirmButtonLoading = false;
		            	instance.type = "success";
		     		}else{
		     			RequestError(this,message);
		     		}
		     	})

		     	promise.fail((res)=>{
		     		console.log("delete request error");
		     	})
		    },
		    //查看str相关信息
		    strNamePopover(row){
		    	this.popShow = true;

		    	let param = {strategy:row.id};
		    	let promise = PostAjax(urls.openStrage,param)
		    	
		    	promise.done((res) => {

		    		let code = res.code;
		    		let message = res.message;

		    		if(code === 0){
		    			let result = res.result.execStrategy;
		    			this.execMode = result.execMode;
		    			this.execNode = result.execNode;
		    			this.isPassExport = result.isPassExport;
		    			this.logLevel = result.logLevel;
		    		}else{
		    			RequestError(this,message);
		    		}
		    	})

		    	promise.fail((res) => {
		    		console.warn("request error")
		    	})

		    }
		},
		components:{
			'revise-str':reviseStr,
			'duty-chain':dutyChainCom
		}
	}
</script>