<template>
  <div id="app">
  	<header>
     <div class='LeftImg'>
     	<img src="/ETLManager/static/image/logo.png"/>
      <span>ETL数据采集</span>
     </div>
	 <ul>
        <li :class="{'active':active==1}" @click="active=1"><a><router-link to="/home">首页</router-link></a></li>
        <li :class="{'active':active==2}" @click="active=2"><a><router-link to="/designer">设计器</router-link></a></li>
        <li :class="{'active':active==3}" @click="active=3"><a><router-link to="/taskmanger/strategy" >任务管理</router-link></a></li>
        <li :class="{'active':active==4}" @click="active=4"><a ><router-link  to="/node">节点管理</router-link></a></li>
     </ul>
  	</header>
    <div class="content">
       <router-view></router-view>
     </div>
  </div>
</template>
<!-- /ETLManager -->
<script>
 export default {
  data(){
    return {
      active:0
    }
  }
 } 
</script>


