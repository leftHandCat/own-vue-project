import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import url from '../../url/urls.js'
var qs = require('qs');
Vue.use(Vuex)
const nodeUrl=url.nodeMange
const state={
	//表格数据
	tableData:[],
	//每页显示的行数
	pageLine:10,
	//当前页码数
    pageNum:1,
    //总条数
    totalNum:0,
    //搜索数据量
    searchData:[],
    //搜索成功标识
    searchFlag:0,
	//任务管理*******************************************************
	strageDatas:null,
	stragePagitation:{
		pageSizeArr: [20,25,30],
		currPage:1,
		totalItem: 0,
		pageSize: 20
	},
	strAddNew:{
		layShow:false,
	},
	strRevise:{
		layShow:false,
	},
	//关联任务
	dutyChain:{
		layShow: false,
		pagitation:{
			pageSizeArr: [20,25,30],
			currPage:1,
			totalItem: 0,
			pageSize: 20
		}
	},
	//查看关联
	queryChain:{
		layShow: true,
		pagitation:{
			pageSizeArr: [20,25,30],
			currPage:1,
			totalItem: 0,
			pageSize: 20
		}
	},
	//任务管理
	mangerDatas:null,
	mangerPagitation:{
		pageSizeArr: [20,25,30],
		currPage:1,
		totalItem: 0,
		pageSize: 20
	},
	mangerChartShow:false,      //图标的遮罩层

};
//发生变化时
const getters={    
     tableData:state=>state.tableData,
     pageLine:state=>state.pageLine,
     pageNum:state=>state.pageNum,
     totalNum:state=>state.totalNum,
     searchData:state=>state.searchData,
     searchFlag:state=>state.searchFlag

};
const mutations={
	SHOW_TABLE(state,data){
		state.tableData=data
	},
	TOTAL_NUM(state,data){
		state.totalNum=data;
	},
	SEARCH_FLAG(state,data){
		state.searchFlag=data
	},
	//任务管理*******************************************************
	//任务配置策略
	strategy_pageSize(state,pageSize){
		state.stragePagitation.pageSize = pageSize;
	},
	strategy_crrPage(state,currPage){
		state.stragePagitation.currPage = currPage;
	},
	strategy_data(state,data){
		state.strageDatas = data.datas;
		state.stragePagitation.totalItem = data.totalItem;
	},
	strategy_new(state,data){
		let type = data.type;

		if(type === 'open'){   //打开
			state.strAddNew.layShow = true;
		}else{  //关闭遮罩层
			state.strAddNew.layShow = false;
		}
	},
	strategy_revise(state,data){

		let type = data.type;

		if(type === 'open'){   //打开
			state.strRevise.layShow = true;
		}else{  //关闭遮罩层
			state.strRevise.layShow = false;
		}
	},
	//任务关联： 查看关联
	dutyChain_showLayer(state,data){
		let type = data.type;
		state.dutyChain.layShow = type === 'open' ? true : false;
	},
	dutyChain_currPage(state,data){
		state.dutyChain.pagitation.currPage = data;
	},
	dutyChain_pageSize(state,data){
		state.dutyChain.pagitation.pageSize = data;
	},
	dutyChain_totalItem(state,data){
		state.dutyChain.pagitation.totalItem = data;
	},
	//任务管理部分
	manager_tableData(state, data){
		state.mangerDatas = data;
	},
	manager_totalItem(state, totalItem){
		state.mangerPagitation.totalItem = totalItem;
	},
	manager_crrPage(state, currPage){
		state.mangerPagitation.currPage = currPage;
	},
	manager_pageSize(state, pageSize){
		state.mangerPagitation.pageSize = pageSize;
	},
	manager_chartShow(state,chartShow){
		state.mangerChartShow = chartShow;
	}
};

var type = 'POST';

const actions={
	//表格数据
	getshowTable({commit}, params){
		console.log("获取表格数据的参数",params); 
		 axios({
		      method: type,
		      url: nodeUrl.nodeUrl,
		      // data:params,
		      data:qs.stringify(params),
		      headers:{'Content-Type': 'application/x-www-form-urlencoded'}
		    }).then(function(res){
		    	var arrData=res.data.datas;
		     	if(res.data.code===200){
					arrData.map(function(v,i){
						if(v["status"]===0){
							v["status"]="在线"
						   }else if(v["status"]===1){
						   	v["status"]="离线"
						   }else if(v["status"]===2){
						   	v["status"]="----"
						   }
						   return v;	
					})
					 commit('SHOW_TABLE',arrData);
					 commit('TOTAL_NUM',res.data.totalNum);
				}
		    }).catch(function(err){
		      console.log("请求失败",err);
		    })

   },
   //搜索数据
    getSearchTable({commit},params){
    		 axios({
		      method: 'POST',
		      url: nodeUrl.nodeSearchUrl,
		      data:params,
		    }).then(function(res){
		    	var arrData=res.data.datas;
		     	if(res.data.code===200){
		     			arrData.map(function(v,i){
						if(v["status"]===0){
							v["status"]="在线"
						   }else if(v["status"]===1){
						   	v["status"]="离线"
						   }else if(v["status"]===2){
						   	v["status"]="----"
						   }
						   return v;	
					})
					 commit('SHOW_TABLE',arrData);
					 commit('SEARCH_FLAG',res.data.code);

				}
		    }).catch(function(err){
		      console.log("请求失败",err);
		    })
    },
	//任务管理*******************************************************
	resetStrCurrPage(context,newVal){
		context.commit('strategy_crrPage',newVal);
	},
	resetStrPageSize(context,newVal){
		context.commit('strategy_pageSize',newVal);
	},
	//策略配置
	resetStrData(context,newVal){
		context.commit('strategy_data',newVal);
	},
	resetStrDataAndTotalItem(context,newVal){
		context.commit('strategy_data',newVal);
	},
	addStreviseMessage(context,newVal){
		context.commit('strategy_new',newVal);
	},
	resetStreviseMessage(context,newVal){
		context.commit('strategy_revise',newVal);
	},
	//关联任务； 查看关联
	resetDutyChainCurrPage(context,newVal){
		context.commit('dutyChain_currPage',newVal);
	},
	resetDutyChainPageSize(context,newVal){
		context.commit('dutyChain_pageSize',newVal);
	},
	resetDutyChainTotalItem(context,newVal){
		context.commit('dutyChain_totalItem',newVal);
	},
	dutyChainShow(context,newVal){
		context.commit('dutyChain_showLayer',newVal);
	},
	//任务管理
	resetManagerTableData(context,newVal){
		context.commit('manager_tableData',newVal);
	},
	resetManagerTotalItem(context,newVal){
		context.commit('manager_totalItem',newVal);
	},
	resetManagerCurrPage(context,newVal){
		context.commit('manager_crrPage',newVal);
	},
	resetManagerPageSize(context,newVal){
		context.commit('manager_pageSize',newVal);
	},
	mangerChartShow(context,newVal){
		context.commit('manager_chartShow',newVal);
	}
   
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
