<template>
	<div>
		<!-- <p class='title'>策略配置</p> -->
		<div class="strDiv">
			<p>
				<el-button type="primary"  @click.stop="addNewStr()" size="small">添加策略</el-button>
				<span class="searchStrageName">策略名称: </span>
				<el-input placeholder="请输入" v-model="inputVal" size="small"></el-input>	
				<el-button type="primary" icon="search" @click.stop="searchClick()" size="small">搜索</el-button>
			</p>

			<div class="tableGation">
				<!-- 表格 -->
				<div class="showTable">
					<div>
						策略配置任务列表
					</div>
					<!-- table组件 -->
					<strage-table></strage-table>

						<!-- 分页 -->
					<div class="pagation">
			           <el-pagination layout="total, prev, pager, next, sizes, jumper, pager" :total="$store.state.stragePagitation.totalItem" :current-page="$store.state.stragePagitation.currPage" :page-sizes="$store.state.stragePagitation.pageSizeArr" :page-size="$store.state.stragePagitation.pageSize" @current-change="handleCurrentChange" @size-change="handleSizeChange">
			           </el-pagination>
			        </div>
				</div>

			</div>

		</div>

		<!-- 添加新策略 -->
		<strage-new v-if="$store.state.strAddNew.layShow"></strage-new>

		<!-- 关联任务 -->
		<strage-new v-if="$store.state.strAddNew.layShow"></strage-new>

		<!-- 查看已关联任务 -->
		<strage-new v-if="$store.state.strAddNew.layShow"></strage-new>

	</div>
</template>
 
<script>

	import strTable from './strTable.vue';
	import url from '../../../url/urls.js';
	import {mapGetters, mapActions} from 'vuex';
	import commonFun from '../common.js';

	import addNewStrCom from './addNewStr';

	//刷新str策略信息
	import refreshStrFun from './strAjax.js';
    const refreshStrdata = refreshStrFun.refreshStrdata;  //url, param

	const PostAjax = commonFun.PostAjax;
	const urls = url.taskMange;

	//import url from '../../url/onlineUrl.js';

	export default {
		data(){
			return {
				inputVal:'',
				searchText: '',
			}
		},
		mounted(){
			this.$nextTick(()=>{

				//策略信息,分页请求
				this.getInitStrageData();

			})
		},
	    methods: {
	    	 /*得到 strage 的数据*/
	    	getInitStrageData(){

	    		let currPage = this.$store.state.stragePagitation.currPage;
              	let currperItem = this.$store.state.stragePagitation.pageSize;

	    		let param = {pageIndex: currPage, perItem: currperItem, searchText: this.searchText};

	    		refreshStrdata(this,urls.strageList,param);
	    	},
		     /*点击页数*/
		    handleCurrentChange(val){

		    	this.$store.dispatch("resetStrCurrPage",val);

				// 获取策略数据
	     		this.getInitStrageData();
		    },
		     //每页显示条数
		    handleSizeChange(val){

		    	this.$store.dispatch("resetStrPageSize",val);

		     	if(this.$store.state.stragePagitation.currPage !== 1){
		     		this.$store.dispatch("resetStrCurrPage",1);   //手动刷新到第一页
		     	}else{
		     		//调用函数刷新
		     		this.getInitStrageData();
		     	}

		    },
	    	/*添加新策略*/
	    	addNewStr(){
	    		//打开遮罩
	    		let type = {type:'open'};  //$store.state.strAddNew.layShow
	    		this.$store.dispatch('addStreviseMessage',type)
	    	},

	    	/*查询*/
	    	searchClick(){
	    		//全局搜索
	    		if(this.inputVal === ''){

	    			this.$store.dispatch("resetStrCurrPage",1);   //手动刷新到第一页， 触发事件得到数据

	    		}else{

	    			//调用函数刷新 向后台发送数据
	    			this.searchText = this.inputVal;
		     		this.getInitStrageData();
	    		}
	    	
	    	}
	    },
	    components:{
	    	'strage-table': strTable,
	    	'strage-new':addNewStrCom
	    }
	}
</script>
