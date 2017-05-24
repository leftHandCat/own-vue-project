var basePath = "static/mockJson/";
var homeBase=basePath+'homeIndex/';
var nodeBase=basePath+'nodeMange/';


var strBase = basePath + 'taskMange/strfile/';
var jobMangerBase = basePath + 'taskMange/mangerfile/';

var url = {
	homeIndex:{
		// 折线图
		blockdataUrl:homeBase+"blockdata.json",
		// 饼图
		overviewdataUrl:homeBase+"overviewdata.json"
	},
	nodeMange:{
		//表格
        nodeUrl:nodeBase+"node.json",
        //增加
        nodeAddUrl:nodeBase+"add.json",
        //编辑
        nodeEditUrl:nodeBase+"edit.json",
        //删除
        nodeDeletUrl:nodeBase+"delete.json",
        //查询
        nodeSearchUrl:nodeBase+"search.json",
        //刷新
        nodeFreshUrl:nodeBase+"fresh.json"
	},
	//任务管理
	taskMange: {
		strageList:strBase + "strageList.json",   //获取策略列表

	  	openStrage: strBase + "openStrage.json",    //打开策略

		addNewStr: strBase + 'addNewStr.json',	       //新增策略

	  	sendDeleteStr: strBase + 'sendDeleteStr.json',  //删除策略

	  	unrelationJobRequest: strBase + 'unrelationJobRequest.json',   //获取未关联的策略 

		sendJobsId: strBase + 'sendJobsId.json',    //发送选择的关联的任务到后台

		queryRelationReq: strBase + 'queryRelationReq.json',   //查看已关联任务

		removeJobReq: strBase + 'removeJobReq.json',   //解除关联的请求

		//修改策略
		modifyStr: strBase + 'modifyStr.json',   //修改策略

		//任务管理
		manger: jobMangerBase + 'manger.json',  //获取任务列表

		mangerSingleStart: jobMangerBase + 'mangerSingleStart.json',    //启动任务

		mangerSingleStop: jobMangerBase + 'mangerSingleStop.json',    //启动任务

		mangerChart: jobMangerBase + 'mangerChart.json',      //任务详情，图标

		mangerTransfer: jobMangerBase + 'mangerTransfer.json',

		//获取历史
		historyTime: jobMangerBase + 'historyTime.json',   //获取历史默认时间
	  	
	  	historyData: jobMangerBase + 'historyData.json',   //获取历史任务

	}
	
}



// var strBase = 'ExecutionStrategy/';
// var jobMangerBase = 'JobManager/'

// var url={
	
// 	 //首页接口
// 	 homeIndex:{
// 	 // 折线图
// 	 blockdataUrl:"homepage/blockdata",
// 	 // 饼图
// 	 overviewdataUrl:"homepage/overviewdata"
// 	 },
// 	//节点管理接口
// 	nodeMange:{
// 		//表格
//         nodeUrl:"nodemanager/init",
//         //增加
//         nodeAddUrl:"nodemanager/add",
//         //编辑
//         nodeEditUrl:"nodemanager/edit",
//         //删除
//         nodeDeletUrl:"nodemanager/del",
//         //查询
//         nodeSearchUrl:"nodemanager/search",
//         //刷新
//         nodeFreshUrl:"nodemanager/updateStatus"
// 	},
// 	taskMange: {
// 	  strageList:strBase + "list.do",   //获取策略列表

// 	  openStrage: strBase + "open.do",    //打开策略

// 	  addNewStr: strBase + 'open.do',	       //新增策略

// 	  deleteStr: strBase + 'del.do',  //删除策略

// 	  unrelationJobRequest: strBase + 'unrelationJobs.do',   //获取未关联的策略 

// 	  sendJobsId: strBase + 'relation.do',    //发送选择的关联的任务到后台

// 	  queryRelationReq: strBase + 'queryRelation.do',   //查看已关联任务

// 	  removeJobReq: strBase + 'relieve.do',   //解除关联的请求
 	  
// 	  modifyStr: strBase + 'modify.do',   //修改策略

// 	  //任务管理
// 	  manger: jobMangerBase + ' list.do',  //获取任务列表

// 	  mangerSingleStart: jobMangerBase + 'run.do',    //启动任务

// 	  mangerSingleStop: jobMangerBase + 'stop.do',    //启动任务

// 	  mangerChart: jobMangerBase + 'details.do',      //任务详情，图标

// 	   mangerTransfer: jobMangerBase + 'entrylist.do',

// 	  //获取历史
// 	  historyTime: jobMangerBase + ' historyTime.do',   //获取历史默认时间

// 	  historyData: jobMangerBase + ' history.do',   //获取历史任务
	 
// 	}
// }	

export default url;