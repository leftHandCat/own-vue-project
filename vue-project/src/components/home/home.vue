<template>
 <div class="bigCon">
    <div class="conHeader"></div>
	<div class="innerLay">
	 <!-- 环形图 -->
	  <div class="commonDiv">
	  	<p>统计数据</p>
	  	 <div class="NumTotal">
	  	 	<dl>
	  	 		<dt style="color:rgba(36,187,255,.8)">{{runningNum}}</dt>
	  	 		<span>正在运行数</span>
	  	 	</dl>
	  	 	<dl>
	  	 		<dt style="color:rgba(140,195,75,.8)">{{totalSuccessNum}}</dt>
	  	 		<span>执行成功数</span>
	  	 	</dl>
	  	 	<dl>
	  	 		<dt style="color:rgba(244,168,22,.8)">{{totalFailedNum}}</dt>
	  	 		<span>执行失败数</span>
	  	 	</dl>
	  	 	<dl>
	  	 		<dt style="color:rgba(141,130,186,.8)">{{totalFinishedNum}}</dt>
	  	 		<span>执行总数</span>
	  	 	</dl>
	  	 </div>
	  	 <div id='pieEchart'></div>
	  </div>
	  <!-- 月折线图 -->
	  <div class="commonDiv">
	  	<p>近一个月执行成功数失败数趋势</p>
	  	  <div id="rightBot"></div>
	  </div>
	  <!-- 周折线图 -->
	  <div class="commonDiv">
	    <p>近一周执行成功数失败数趋势</p>
	    <div id="WeekEcharts"></div>
	  </div>
	  <!-- 天折线图 -->
	  <div class="commonDiv">
	  	<p>近一天执行成功数失败数趋势</p>
	  	<div id="DayEcharts"></div>
	  </div>
	</div>
 </div>
</template>

<script>
import Vue from 'vue'
import url from '../../url/urls.js'
import echarts from 'echarts'

import global from '../global/global'

console.log(global)

Vue.use(echarts)
//const echarts = window.echarts;

const homeUrl=url.homeIndex
	export default {
		 data(){
              return {
              	"runningNum":'',
		        "totalFinishedNum":'',
		        "totalSuccessNum":'',
		        "totalFailedNum":'',
		        "leftTopurl":""
              }
	        },
	    mounted:function(){
			this.$nextTick(function(){
				this.LeftView();
				this.RightView();
			});
		},
	    methods:{
	     LeftView:function(){
				this.$http.get(homeUrl.overviewdataUrl).then(res=>{
					    // 左边上边计数部分
					let newData= res.body;
					if(newData.code===200){
						this.runningNum=newData.data.runningNum;
					    this.totalFinishedNum=newData.data.totalFinishedNum;
					    this.totalSuccessNum=newData.data.totalSuccessNum;
					    this.totalFailedNum=newData.data.totalFailedNum;
					    //下边饼图渲染
						let pieEchart = echarts.init(document.getElementById("pieEchart"));
						let Pielengend=["执行成功","执行失败"];
						let PieseriesData=[{value:newData.data.totalSuccessNum,
							                 name:"执行成功"},
							               {value:newData.data.totalFailedNum,
							                name:"执行失败"}];
						let Pieopts=global.CharPieOption(Pielengend,PieseriesData);
	                    pieEchart.setOption(Pieopts, true);
					}
				})
	     },
	     RightView:function(){
	     	   this.$http.get(homeUrl.blockdataUrl).then(res=>{
	     	   	    let newData= res.body;
	     	   	    console.log(newData);
	     	   	    let DayEchart = echarts.init(document.getElementById("DayEcharts"));
	     	   	    let WeekEcharts = echarts.init(document.getElementById("WeekEcharts"));
	     	   	    let MonthEcharts=echarts.init(document.getElementById("rightBot"));
	     	   	      // 天折线图
	     	   	    let DayData = res.body.data.hour;
		            let Dayopts=global.ChartOption(DayData.title,DayData.legend,DayData.xAxis,global.createSeries(DayData.series));
		                 DayEchart.setOption(Dayopts, true);
	                // 周折线图
	                let WeekData = res.body.data.week;
	                let Weekopts=global.ChartOption(WeekData.title,WeekData.legend,WeekData.xAxis,global.createSeries(DayData.series));
	                 WeekEcharts.setOption(Weekopts, true);

	                // 月折线图
	                let MonthData = res.body.data.month;
	                let Monthopts=global.ChartOption(MonthData.title,MonthData.legend,MonthData.xAxis,global.createSeries(MonthData.series));
	                 MonthEcharts.setOption(Monthopts, true);      
				})
	     }
	  }
}
</script>