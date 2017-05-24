
/*折线图*/
function lineChartOption(title, legend, xAxis, unit, series){
	let colors = ['#0295da','#f4a91a'];

	let option = {
        color:colors,
        grid:{
        	show:false,
        	right:'1%',
        	left:'10%',
        	bottom: '22.5%'
        },
	    title: {
	        text: title
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:legend,
	        top:'5%'
	    },
	    xAxis:  {
	        type: 'category',
	        boundaryGap: false,
	        data: xAxis,
	        axisLabel:{
	        	show:true,
	        	rotate:'50',
	        	interval:0
	        }
	    },
	    yAxis: {
	        type: 'value',
	        name: unit,
	        axisLabel: {
	            formatter: '{value}',
	        },
	        axisLine : {    // 轴线
				show: false,
				color:'#ccc'
				
			},
			axisTick : {    // 轴标记
					show:false,
				},
	    },
	    series: series
	};

	return option;

}


export default {
	lineChartOption
}

// let colors = ['green','blue'];
// 	let option = {
//         color:colors,
// 	    title: {
// 	        text: '未来一周气温变化',
// 	    },
// 	    tooltip: {
// 	        trigger: 'axis'
// 	    },
// 	    legend: {
// 	        data:['最高气温','最低气温']
// 	    },
// 	    xAxis:  {
// 	        type: 'category',
// 	        boundaryGap: false,
// 	        data: ['周一','周二','周三','周四','周五','周六','周日']
// 	    },
// 	    yAxis: {
// 	        type: 'value',
// 	        name:'kbsp/s',
// 	        axisLabel: {
// 	            formatter: '{value} '
// 	        }
// 	    },
// 	    series: [
// 	        {
// 	            name:'最高气温',
// 	            type:'line',
// 	            symbolSize:15,
// 	            smooth:true,
// 	            data:[11, 11, 15, 13, 12, 13, 10],
// 	            lineStyle:{
// 	            	normal:{
// 	            		color: colors[0]
// 	            	}
// 	            },
// 	            areaStyle:{
// 	            	normal:{
// 	            		color: {
// 						    type: 'linear',
// 						    x: 0.5,
// 						    y: 0,
// 						    x2: 0.5,
// 						    y2: 1,
// 						    colorStops: [{
// 						        offset: 0, color: colors[0] // 0% 处的颜色
// 						    }, {
// 						        offset: 1, color: '#fff' // 100% 处的颜色
// 						    }],
// 						    globalCoord: false // 缺省为 false
// 						},
// 						opacity:0.5
// 			         }
// 	            }
// 	        },
// 	        {
// 	            name:'最低气温',
// 	            type:'line',
// 	            symbolSize:15,
// 	            smooth:true,
// 	            data:[1, -2, 2, 5, 3, 2, 0],
// 	            lineStyle:{
// 	            	normal:{
// 	            		color: colors[1]
// 	            	}
// 	            },
// 	            areaStyle:{
// 	            	normal:{
// 	            		color: {
// 						    type: 'linear',
// 						    x: 0.5,
// 						    y: 0,
// 						    x2: 0.5,
// 						    y2: 1,
// 						    colorStops: [{
// 						        offset: 0, color: colors[1] // 0% 处的颜色
// 						    }, {
// 						        offset: 1, color: '#fff' // 100% 处的颜色
// 						    }],
// 						    globalCoord: false // 缺省为 false
// 						},
// 						opacity:0.5
// 			         }
// 	            }
// 	        }
// 	    ]
// 	};