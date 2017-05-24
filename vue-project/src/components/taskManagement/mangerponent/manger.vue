<template>
	<div>
		<!-- <p class='title'>任务管理</p> -->
		<div class="mangerDiv">
			<p>
				<!-- 提示 -->
				<el-popover ref="startpop" trigger="click" placement="top" content="至少选择一项" v-if="noStartItem"></el-popover>
				<el-popover ref="stoppop" trigger="click" placement="top" content="至少选择一项" v-if="noStopItem"></el-popover>

				<el-button @click="batchAction()" size="small" v-popover:startpop type="primary">批量执行</el-button>
				<el-button @click="batchStop()" size="small" v-popover:stoppop type="primary">批量停止</el-button>

				<span class="searchDutyName">任务名称：</span>
				<el-input placeholder="请输入" v-model="inputVal" size="small"></el-input>	
				<el-button type="primary" icon="search" @click="searchClick" size="small">搜索</el-button>
			</p>

			<div class="tableGation">
				<div class="showTable">
					<div>
						任务管理
					</div>
					<el-table :data="$store.state.mangerDatas" stripe border tooltip-effect="dark" style="width:100%" @select="selectOneFun" ref="multipleTable" @select-all="selectAllFun">
						<el-table-column type="selection"></el-table-column>
						<el-table-column prop="name" label="任务名称">
						</el-table-column>
						<el-table-column prop="createtime" label="创建时间" show-overflow-tooltip width="180"></el-table-column>
						<el-table-column prop="scheduletype" label="调度类型" show-overflow-tooltip></el-table-column>
						<el-table-column prop="scheduletime" label="调度时间" show-overflow-tooltip width="180"></el-table-column>
						<el-table-column prop="strategyName" label="策略名称" show-overflow-tooltip></el-table-column>
						<el-table-column label="执行" show-overflow-tooltip>
							<template scope="scope">
								<span class="fa fa-play" @click="singleStart(scope.row)"></span>
							</template>
						</el-table-column>
						<el-table-column label="停止" show-overflow-tooltip>
							<template scope="scope">
								<span class="fa fa-stop" @click="singleStop(scope.row)"></span>
							</template>
						</el-table-column>
						<el-table-column label="详情" show-overflow-tooltip>
							<template scope="scope">
								<span class="fa fa-bars" @click="detailsFun(scope.row)"></span>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="状态" show-overflow-tooltip></el-table-column>
					</el-table>	

					<div class="pagation">
						<el-pagination layout="total, prev, pager, next, sizes, jumper, pager" :total="$store.state.mangerPagitation.totalItem" :current-page="$store.state.mangerPagitation.currPage" :page-sizes="$store.state.mangerPagitation.pageSizeArr" :page-size="$store.state.mangerPagitation.pageSize" @current-change="handleCurrentChange" @size-change="handleSizeChange">
				           </el-pagination>
					</div>

				</div>
			</div>

		</div>
		<!-- 弹出框 -->
		<el-dialog :title="actionType" :visible.sync="dialogDiv" size="tiny">
			<ul>
				<li>总共 {{totalnum}} 个</li>
				<li>成功 {{succnum}} 个：{{succDetails}}</li>
				<li>失败 {{failnum}} 个：{{failDetails}}</li>
			</ul>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogDiv = false" size="small">取消</el-button>
				<el-button type="primary" size="small" @click="dialogDiv = false">确认</el-button>
			</span>
		</el-dialog>

		<!-- detail-chart -->
		<detail-chart v-if="this.$store.state.mangerChartShow" :job-id="jobId" :job-name="jobName"></detail-chart>

	</div>
</template>

<script>

	import url from '../../../url/urls.js';
	import commonFun from '../common.js';

	import detailChart from './detailChart';

	const ObjCopy = commonFun.ObjCopy;
 	const PostAjax = commonFun.PostAjax;
 	const RequestError = commonFun.RequestError;

  	const urls = url.taskMange;

	export default{
		name:'manger',
		data(){
			return {
				jobId:'',
				jobName:'',
				detailShow:false,
				noStartItem:true,
				noStopItem:true,
				dialogDiv:false,
				actionType:'',
				totalnum:0,
				succnum:0,			//成功的格式
				succDetails:'',		//成功的任务详情
				failnum:0,			//失败的格式
				failDetails:'',     //失败的任务详情
				inputVal: '',
				mangerData:[],
				pageChangeSelectionArr:[],   //翻页时已经被点击的
				newestSelection:[],      //当前页最新被点击的
				oldPage:'',
				newPage: '',
				searchText:''
			}
		},
		created(){
			//页数归为初始化
			
			this.$store.dispatch('resetManagerCurrPage',1);
		},
		watch:{
			"$store.state.mangerPagitation.currPage": function(newVal, oldVal){
				this.oldPage = oldVal;
				this.newPage = newVal;
			}
		},
		mounted(){

			this.$nextTick(() => {
				this.getMangerData();
			})

		},
		updated(){
			//实例更新, 打钩
			if(this.oldPage !== this.newPage){
				this.hasSelected();
			}
			
		},
		methods:{
			getMangerData(){

				let param = {pageIndex: this.$store.state.mangerPagitation.currPage, perItem: this.$store.state.mangerPagitation.pageSize, searchText: this.searchText};

				let promise = PostAjax(urls.manger,param);

				promise.done((res) => {
					let code = res.code;
					let message = res.message;

					if(code === 0){
						//总数量, 总数据
						this.$store.dispatch('resetManagerTotalItem',res.total);
						this.$store.dispatch('resetManagerTableData',res.result);
					}else{
						RequestError(this,message)
					}
				});
				promise.fail((res) => {
					console.warn("manger error");
				})
			},
			/*页数点击*/
			handleCurrentChange(val){

				this.$store.dispatch('resetManagerCurrPage',val);

				this.pageChangeSelectionArr = this.pageChangeSelectionArr.concat(this.newestSelection);
				this.newestSelection = [];

				//拼接
				val === 1 ? this.getMangerData() : this.getMangerData();

		    },
		    //当前页之前勾选的打钩
		    hasSelected(){
		    	let mangerData = this.$store.state.mangerDatas;
				let clickCurrPageSelect = this.pageChangeSelectionArr;

				if(clickCurrPageSelect.length !== 0){

					clickCurrPageSelect.filter((val,index) => {
						for(let i = 0; i < mangerData.length; i++){
							if(val.id === mangerData[i].id){
								this.$refs.multipleTable.toggleRowSelection(this.$store.state.mangerDatas[i]);
								return;
							}
						}
					})
				}
		    },
		     /*每页的数量分布*/
		    handleSizeChange(val){

		     	this.$store.dispatch('resetManagerPageSize',val);
		     	
		     	if(this.$store.state.mangerPagitation.currPage !== 1){
		     		this.$store.dispatch('resetManagerCurrPage',1);//手动刷新到第一页
		     	}else{
		     		this.getMangerData();
		     	}

		    },
		    /*单个点击, 单行*/
		    selectOneFun(selection, row){

		    	let exist = selection.every((v,i) => {
		    		return row.id !== v.id
		    	});

		    	let hasSelected = this.pageChangeSelectionArr;

		    	//true 重复，需要取消
		    	//false 没有重复，需要删除.
		    	if(exist){
		    		console.log("取消打钩");
		    		//取消打钩
		    		for(let i = 0; i < hasSelected.length; i++){
		    			if(hasSelected[i].id === row.id){
		    				hasSelected.splice(i,1);
		    				return;
		    			}
		    		}

		    		this.pageChangeSelectionArr = hasSelected;

		    	}else{
		    		console.log("打钩");
		    		//当前页打钩
		    		this.newestSelection = selection;
		    	}
		    },
		    //全选
		    selectAllFun(selection){
		    	//将已经存在的移除，直接把现在全选的存入
		    	//若 selection 为空则就是取消全新
		    	if(selection.length === 0){
		    		//取消全选  mangerData 全部取消
		    		let mangerDatas = this.$store.state.mangerDatas;
		    		let noRepeactSelected = this.selectAllCommon();

		    		//防止 undefined 的出现
		    		noRepeactSelected = noRepeactSelected === undefined ? [] : noRepeactSelected;

		    		this.pageChangeSelectionArr = noRepeactSelected;

		    	}else{
		    		//全选, 删除存在列表的拼接不存在的
		    		let mangerDatas = this.$store.state.mangerDatas;
		    		let noRepeactSelected = this.selectAllCommon();

		    		//防止 undefined 的出现
		    		noRepeactSelected = noRepeactSelected === undefined ? [] : noRepeactSelected;
		    		this.pageChangeSelectionArr = mangerDatas.concat(noRepeactSelected);

		    	}
		    },
		    //全选和取消全新公共方法封装
		    selectAllCommon(){

		    	let hasSelected = ObjCopy(this.pageChangeSelectionArr);

		    	let mangerDatas = this.$store.state.mangerDatas;

		    	for(var i = hasSelected.length-1; i >=0; i--){
	    			for(var k = 0; k < mangerDatas.length; k++){
	    				if(hasSelected[i].id == mangerDatas[k].id){
	    					hasSelected.splice(i,1);
	    					break;
	    				}
	    			}
	    		};

	    		//防止 undefined 的出现
	    		hasSelected = hasSelected === undefined ? [] : hasSelected;

	    		return hasSelected;
		    },
		    //单击执行，单击停止的公共函数
		    actionCommon(url,param,actionType){

		    	let promise = PostAjax(url,param);

				promise.done((res) => {

					let message = res.message;
					let code = res.code;

					if(code === 0){
						let result = res.result;

						this.dialogDiv = true;
						this.actionType = actionType;

						this.totalnum = result.totalnum;
						this.succnum = result.succnum;
						this.failnum = result.failnum;
						this.succDetails = result.succ.join(",");
						this.failDetails = result.fail.join(",");
					}else{
						RequestError(this,message)
					}
				})

				promise.fail((res) => {
					console.log("request error")
				})
		    },
		    //单个开始
			singleStart(val){

				let param = {jobs:[{id:val.id}]};
				let actionType= "任务执行";

				this.actionCommon(urls.mangerSingleStart,param,actionType)

			},
			//单个停止
			singleStop(val){

				let param = {jobs:[{id:val.id}]};
				let actionType= "任务停止";

				this.actionCommon(urls.mangerSingleStop,param,actionType)
			},
			batchCommon(actionType){

				this.oldPage = this.newPage;   //只有page 发生改变时才能触发，当前页之前打钩的打钩

				let selectAll = this.newestSelection.concat(this.pageChangeSelectionArr);
				//数据整理发送后台
				let param = [];

				if(selectAll.length !== 0){

					this.noStartItem = false;
					this.noStopItem = false;

					selectAll.forEach((v,i) => {
						let paramItem = {id: v.id};
						param.push(paramItem);
					})
					this.actionCommon(urls.mangerSingleStart,param,actionType);
				}
			},
			/*批量执行*/
			batchAction(){
				this.batchCommon("批量执行");
			},
			/*批量停止*/
			batchStop(){
				this.batchCommon("批量停止");
			},
			searchClick(){

				let searchText = this.inputVal;
				//刷新数据
				this.getMangerData();
			},
			detailsFun(val){
				//打开窗口
				this.$store.dispatch('mangerChartShow',true);
				//传值.
				this.jobId = val.id;
				this.jobName = val.name;
				
			}
		},
		components:{
			'detail-chart':detailChart
		}
	}
</script>