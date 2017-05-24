<template>
	<div class="mangerDialog">
		<el-dialog :title="title" :visible.sync="$store.state.mangerChartShow" size="small">
  			<!-- 左侧 -->
			<div class="leftItem">
				<ul>
					<li v-for="(item,index) in transferAll" @click="transferChart(item.name, index)" :class="{'chartLabel': index == clickIndex}" v-model="clickClass">
						{{item.name}}
					</li>
				</ul>
			</div>
			<!-- 右侧 -->
			<div class="rightContent" id="lineChart">
			</div>
			<!-- 底部 -->
  			<span slot="footer" class="dialog-footer">
	    		<!-- <el-button @click="handleClose">取 消</el-button> -->
	   			<!--  <el-button type="primary" @click="handleClose">确 定</el-button> -->
		 	</span>
		</el-dialog>
	</div>
</template>

<script>

import Vue from 'vue';
import echarts from 'echarts';
import moment from 'moment';

Vue.use(echarts);
// Vue.use(moment);

import url from '../../../url/urls.js';
import commonFun from '../common.js';
import chartFun from './chartOption.js';

const ObjCopy = commonFun.ObjCopy;
const PostAjax = commonFun.PostAjax;
const RequestError = commonFun.RequestError;

const addChartOption = chartFun.lineChartOption;

const urls = url.taskMange;

export default {
	props:['jobId','jobName'],
	data() {
		return {
			clickIndex:0,
			title:'',
			transferAll:'',
			clickClass:'',
			isActive:false,
			classArray:[]
			// dialogVisible: true
		};
	},
	watch:{
		"clickClass":function(newVal,oldPage){

		}
	},
	mounted(){
		//初始化
		this.getTransferData();
	},
	methods: {
		getTransferData(){

			let param = {id: this.jobId, name: this.jobName};
			let promise = PostAjax(urls.mangerTransfer,param);

			promise.done((res) => {
				let code = res.code;
				let message = res.message;

				if(code === 0){
					let result = res.result;

					this.title = "任务名称: "+this.jobName;

					let defaultOne = result.entrylist.default.name;

					this.clickClass = defaultOne.replace(' ',"");

					this.transferAll = result.entrylist.details;

					this.transferAll.forEach((v,i) => {
						this.classArray.push(v.name.replace(' ',""));
					})

					//总数量, 总数据
					//发送默认请求第一个transtab
					this.getChartData(defaultOne);
				}else{
					RequestError(this,message);
				}
			});
			promise.fail((res) => {
				console.warn("request error");
			})
		},
		getChartData(transName){
			let param = {job: this.jobId, entryname: transName};
		
			let promise = PostAjax(urls.mangerChart,param);

			promise.done((res) => {
				let code = res.code;
				let message = res.message;

				if(code === 0){
					let result = res.result;
					this.addChart(transName,result);
				}else{
					RequestError(this,message)
				}
			});
			promise.fail((res) => {
				console.warn("manger error");
			})
		},
		addChart(transName,data){

			let myChart = echarts.init(document.getElementById("lineChart"));
			let legend = data.legend;
			let xaxis = data.xaxis;
			let seriesOrigin = data.series
			let seriesArr = [];
			let unit = "kbsp/s";

			let xAxis = xaxis.map((v,i) => {
				return moment(v*1000).format("MM-DD HH:mm:ss")
			})

			let colors = ['#0295da','#f4a91a'];

			for(var i = 0; i < seriesOrigin.length; i++){

				let seriesItem = {
		            name: seriesOrigin[i].name,
		            type: 'line',
		            symbol: 'circle',
		            symbolSize:8,
		            smooth:true,
		            showAllSymbol:true,
		            data: seriesOrigin[i].data,
		            lineStyle:{
		            	normal:{
		            		color: colors[i]
		            	}
		            },
		            areaStyle:{
		            	normal:{
		            		color: {
							    type: 'linear',
							    x: 0.5, 
							    y: 0,
							    x2: 0.5,
							    y2: 1,
							    colorStops: [{
							        offset: 0, color: colors[i] // 0% 处的颜色
							    }, {
							        offset: 1, color: '#fff' // 100% 处的颜色
							    }],
							    globalCoord: false // 缺省为 false
							},
							opacity:0.5
				         }
		            }
		        };
		        seriesArr.push(seriesItem);
			}

			//title, legend, xAxis, unit, series
			myChart.setOption(addChartOption(transName,legend,xAxis,unit,seriesArr));
			//屏幕自适应大小
			window.onresize = myChart.resize;

		},
		transferChart(val,index){

			this.clickClass = val.replace(' ','');
			this.clickIndex = index;

			console.log(index,"indexindexindexindexindex")

			/*bfd2e0*/

			//切换后重新画图
			this.getChartData(val);

		},
		handleClose(){
			this.$store.dispatch('mangerChartShow',false);
		}
	}
 }
  </script>