<template>
	<div>
		<div class="historyDiv">
			<p>
				<span>开始时间：</span>
				<el-date-picker placeholder="YYYY-MM-DD hh:mm:ss" type="datetime" v-model="start" size="small" format="yyyy-MM-dd hh:mm:ss" :editable="true"></el-date-picker>
				<span class='dash'></span>
				<span>结束时间：</span>
				<el-date-picker placeholder="YYYY-MM-DD hh:mm:ss" type="datetime" v-model="end" size="small" format="yyyy-MM-dd hh:mm:ss" :editable="true" ></el-date-picker>
				<el-button type="primary" icon="search" @click.stop="searchClick()" size="small">查询</el-button>
			</p>

			<div class="tableGation">
				<div class="showTable">

					<div>历史任务</div>
	
					<el-table :data="historyData" stripe border tooltip-effect="dark" style="width:100%">
						<el-table-column v-for="item in columArr" :prop="item.id" :label="item.label" :width="200" :key="item.id"></el-table-column>
					</el-table>
					<div class="pagation">
						<el-pagination layout="total, prev, pager, next, sizes, jumper" :total="totalItem" :current-page="currentPage" :page-size="perItem" :page-sizes="[20,30,40]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
					</div>
				</div>
				
			</div>

			
		</div>
	</div>
</template>

<script>

	import url from '../../../url/urls.js';
	import commonFun from '../common.js';

	const ObjCopy = commonFun.ObjCopy;
  	const PostAjax = commonFun.PostAjax;
  	const GetAjax = commonFun.GetAjax;
  	const RequestError = commonFun.RequestError;

	const urls = url.taskMange;

	const columArr = [
    {id:"name", label:"任务名称"},
		{id:"starttime", label:"开始时间"},
		{id:"stoptime", label:"结束时间"},
		{id:"input", label:"输入"},
		{id:"output", label:"输出"},
		{id:"error", label:"错误"},
		{id:"execMode", label:"执行模式"},
		{id:"execNode", label:"执行描述"},
		{id:"status", label:"状态"},
		{id:"message", label:"消息"},
		{id:"speed", label:"执行方式"}
	]

	export default{
		data(){
			return {
				start:'',
				end: '',
				totalItem:100,
				currentPage: 1,
				perItem:20,
				columArr:columArr,
				historyData:[],
				start:[new Date(+new Date()-7*24*60*60*1000)],   //自动提前7天
				end:[new Date()]
			}
		},
		create(){
			this.currentPage = 1;
			this.perItem = 20;
		},
		mounted(){
			this.$nextTick(() => {
				this.getInitTime();
			})
		},
		methods:{
			getInitTime(){

				let promise = GetAjax(urls.historyTime);

				console.log(urls.historyTime)

				promise.done((res) => {
					let code = res.code;

					if(code === 0){
						let result = res.result;
						this.start = [result.startime];
						this.end = [result.stoptime];
						//获取历史数据
						this.getHistoryData();
					}else{
						console.warn("initTime error")
					}
				})

				promise.fail((res) => {
					console.warn("initTime error")
				})
			},
			getHistoryData(){
				let param = {
					startime: this.start,
					endtime: this.end,
					pageIndex:this.currPage,
					perItem: this.perItem
				};

				let promise = PostAjax(urls.historyData, param);

				promise.done((res) => {
					let code = res.code;
					let message = res.message;

					if(code === 0){
						let result = res.result;
						this.historyData = result;

					}else{
						RequestError(this,message);
					}
				});

				promise.fail((res) => {
					console.warn("request error")
				})

			},
			//页码更改
			handleCurrentChange(val){
				this.currentPage = val;
				this.getHistoryData();
			},
			//改变每页条数
			handleSizeChange(val){
				this.pageSize = val;
				this.currentPage = 1;   //固定调到第一页
				this.getHistoryData();
			},
			//时间搜索
			searchClick(){
				//刷新
				this.getHistoryData();
			}
		}
	}
</script>