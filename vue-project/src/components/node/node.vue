
<template>
  <div class="bigCon">
     <!-- 节点管理头部 -->
     <div class="conHeader">
     	<div class="nodeSearch">
     		 <el-row type="flex" class="elrowcon">
                    <el-col>
			         <span>节点名称：</span> 
			          <el-input class='searchName' v-model="searchInputname" placeholder="请输入名称"  size="small"></el-input>
			        </el-col>
				      <el-col>
				          <span>IP：</span>
				             <el-input v-model="searchInputip1" class="searchInputip1" size="small"></el-input>
				        </el-col>
				          
				        <el-col>
				         <span>端口号：</span> 
				          <el-input v-model="searchInputport"  class='searchport' size="small"></el-input>
				        </el-col>
				        
				        <el-col>
				         <span>状态选择：</span> 
				          <el-select v-model="currentType" placeholder="请选择状态" class="eloption" size="small">
				            <el-option 
				              v-for="type in types"
				              :value="type"
				              :key="type">
					            </el-option>
					          </el-select>
				        </el-col>
				         <el-button type="primary" icon="search"  size="small" class="searchbtn" @click="search" v-loading.fullscreen.lock="fullscreenLoadingsearch" element-loading-text="正在搜索中" >搜索</el-button>
					 </el-row>
     	</div>
     </div>
     <!-- 节点管理添加刷新部分 -->
     <div class="NodeAdd">
     	<!-- 添加按钮 -->
     	   <el-card class="box-card">
			 <el-button type="primary" @click="handAdd" class="Addbtn" size="small">增加节点</el-button>
			  <el-button type="primary" @click="RefreshStatus"  v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="状态刷新中" class="Addbtn" size="small">状态刷新</el-button>
			</el-card>
     </div>
     <!-- 表格部分 -->
	 <div class="innerLayTable">
			<div class='NodeItem'>
				<div class="tabletop">节点列表展示</div>
				<!-- 表格table -->
				<div class="Divtable">
				    <el-table :data="showTable" stripe class="eltable">
				        <el-table-column prop="name" label="节点名称"></el-table-column>
				        <el-table-column prop="ip" label="IP" ></el-table-column>
				        <el-table-column prop="port" label="端口号"></el-table-column>
				        <el-table-column prop="status" label="状态"   
				        :filters="[{ text: '在线', value: '在线' },
				                   { text: '离线', value: '离线' }]"
				        :filter-method="filterTag"
                        >
                         <template scope="scope">
					        <el-tag
					          :type="scope.row.status === '在线' ? 'primary' : 'success'"
					          close-transition>{{scope.row.status}}</el-tag>
					      </template>
                        </el-table-column>
				        <el-table-column label="操作" align="center" prop="id" >
					      <template scope='scope'>
					          <el-button type="text" size="mini" @click.native="editNode
					          (scope.$index,scope.row)">编辑</el-button>

					          <el-button type="text" size="mini" @click.native="deletNode(scope.$index,scope.row)">删除</el-button>
					      </template>
				        </el-table-column>
				    </el-table>
				    <el-row type="flex" justify="end" style="padding:20px 0; ">
			        <el-pagination
			           @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
				       :page-sizes="[10, 20, 30, 40]"
				       :page-size="pagesize"
				       layout="total, sizes, prev, pager, next, jumper"
				       :total="$store.getters.totalNum">
			        </el-pagination>
                   </el-row>
				</div>
			</div>
			 <!-- 增加弹框 -->
		      <el-dialog title="增加节点"  v-model="dialogFormVisible" class="dialog">
		        <el-form >
		          <el-form-item>
		           <div class="nodemes">
		            <span>节点名称:</span>

		             <el-input  v-model="addInputname"  placeholder="请输入名称"  style="display:inline-block;width:20%" @change="handName(addInputname)"  ></el-input>
		               <p v-show="Nflag" style="color:red;margin-left:17%">{{pname}}</p>
		            </div>
		            <div class="nodemes">
			             <span>IP:</span>
			             <el-input v-model="addInputip1" placeholder="请输入正确的ip格式" @change="handips(addInputip1)" style="display:inline-block;width:20%"></el-input>
			             <p v-show="!flag" style="color:red;margin-left:17%">请输入ip正确的格式</p>
			          </div>
			          <div class="nodemes">
			          	 <span>端口号:</span>
		                 <el-input v-model="addInputport" style="display:inline-block;width:20%" placeholder="1024到65535"  @change="handPort(addInputport)"></el-input>
		                 <p v-show="!Pflag" style="color:red;margin-left:17%">请输入端口号的正确格式 1024-65535</p>
			          </div>
		            
		            </el-form-item>
		           </el-form>
		                <span slot="footer" class="dialog-footer">
		                    <el-button  @click="handAddSure">确定</el-button>
		                    <el-button type="primary" @click="handAddquit">取消</el-button>
		                </span>
		      </el-dialog>
	 </div>
	</div>
</template>
<script>
import Vue from 'vue'
import url from '../../url/urls.js'
const nodeUrl=url.nodeMange

export default{
	data(){
        return {
        	  input: '',
        	 
        	  currentType:'',

           
        	  //默认每页数据量
        	  pagesize: 10,
        	  
        	  //当前显示页数
        	  currentPage: 1,
        
              types:['请选择','在线','离线','----'],
              dialogFormVisible:false,

              //判断name是否正确
              Nflag:false,
              //判断ip是否正确
              flag:true,
              
              //判断端口是否正确
              Pflag:true,
              pname:'',
              
              // 搜索框
              searchInputname:'',
              searchInputip1:'',
              searchInputport:'',

               
              //增加inputname框
              addInputname:'',
              addInputip1:'',
              addInputport:'',
              // 加载框
              fullscreenLoading: false,
              fullscreenLoadingsearch:false

        }
	},

	mounted:function(){
           	this.$store.dispatch('getshowTable',{"pageLine":this.pagesize,"pageNum":this.currentPage});
		 },

	computed:{
		   showTable(){
				return this.$store.getters.tableData;
		  }
	},
	methods:{
		//判定name输入是否合法
		handName:function(name){
          var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]") ;
          if(name){
          	if(pattern.test(name)){
              this.Nflag=true;
              this.pname="名称不能含有特殊字符'~!@#$^&*'等";
          	}else if(name.length>65){
              this.Nflag=true;
              this.pname="名称不能超过65个字节";
           }else{
              this.Nflag=false;
          	}
          }else{
          	   this.Nflag=false;
          }
		},
		// 判定ip格式否正确
		handips:function(ipaddress){
          var reg=/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/			
			if(ipaddress){
				var isIP=reg.test(ipaddress);
				if(isIP){
					 this.flag=true;
				     return true;
				}else{
					 this.flag=false;
		              return false;
				}
			}else{

                this.flag=true;
				return true;
			}
		},
		//验证端口号是否输入正确
		handPort:function(port){
			if(port[0]==="0"){
				this.Pflag=false;
			}else{
				if(+port>=1024 && +port<=65535){
					this.Pflag=true;
				}else{
				 this.Pflag=false;
				}
			}
		},
       // 增加节点
		handAdd:function(){
			this.dialogFormVisible = true;
			this.addInputname='';
			this.addInputip1='';
			this.addInputport='';
		},
		//增加确定
		handAddSure:function(){

			if(this.addInputname===""){
				this.$alert("节点名称不能为空", '提示', {
				         confirmButtonText: '确定'
				        });
			}else if(this.addInputip1==="" ){
				this.$alert("ip设置不能为空", '提示', {
				         confirmButtonText: '确定'
				        });
			}else if(this.addInputport===""){
                this.$alert("端口号不能为空", '提示', {
				         confirmButtonText: '确定'
				        });
			}else if(this.flag===false || this.Pflag===false || this.Nflag===true){
               this.$alert("名称、ip或者端口号输入不合法", '提示', {
				         confirmButtonText: '确定',
				         type:'error'
				        });
	              	this.addInputip1='';
					this.addInputport='';
			}else{
			   this.$http.post(nodeUrl.nodeAddUrl,{"name": this.addInputname, "ip": this.addInputip1, "port": this.addInputport},{emulateJSON: false}).then(res=>{
					if(res.body.code===201){
						this.$alert(res.body.status, '提示', {
						         confirmButtonText: '确定',
						         type:'error'
						        });
					}else{
						this.$alert(res.body.status, '提示', {
						         confirmButtonText: '确定',
						         type:'success',
						         beforeClose: (action, instance, done) =>{
	                               	this.$store.dispatch('getshowTable',{"pageLine":this.pagesize,"pageNum":this.currentPage});
	                               	 setTimeout(() => {
				                  	  	done();
				                  	  },100)
						          }
						       });
					   }

					   this.dialogFormVisible = false;

			  });	  
		   }
		},
		//取消
		handAddquit:function(){
			this.dialogFormVisible=false
		},
		

        //编辑节点
		editNode:function(index,row){
               this.$prompt('请输入节点名称', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          inputPattern:new RegExp("^[^`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]{1,65}$"),
                          inputErrorMessage: '节点名称不合法,不能含有特殊字符~!@#$^&*等'
                     }).then( ({value})=>{

                          this.$http.post(nodeUrl.nodeEditUrl,{"id": row.id,"name": value},{emulateJSON: true}).then(res=>{
                     	 	 	if(res.body.code===201){
                     	 	 		this.$alert(res.body.status, '提示', {
					                  confirmButtonText: '确定',
					                   type:'error'
					              });

                     	 	 	}else {
                                  this.$alert(res.body.status, '提示', {
					                  confirmButtonText: '确定',
					                   type:'success',
					                   beforeClose: (action, instance, done) =>{
                                       this.$store.dispatch('getshowTable',{"pageLine":this.pagesize,"pageNum":this.currentPage});
                                       setTimeout(() => {
					                  	  	done();
					                  	  },100)
					                  }

					              });
                     	 	 	}
                     	 	 })	                    	 
                     }).catch(() =>{})
		 },
		 //删除节点
	    deletNode:function(index,row){
	      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', 
        }).then(() => {
        	 	 this.$http.post(nodeUrl.nodeDeletUrl,{ "id": row.id},{emulateJSON: true}).then(res=>{
        	 	 	if(res.body.code===201){
                       this.$alert(res.body.status, '提示', {
					                  confirmButtonText: '确定',
					                   type:'error'
					              });
                  	 }else{
                  	 		this.$alert(res.body.status, '提示', {
					                  confirmButtonText: '确定',
					                   type:'success',
					                  beforeClose:(action, instance, done) =>{
					                  	 this.$store.dispatch('getshowTable',{"pageLine":this.pagesize,"pageNum":this.currentPage});   	
					                  	  setTimeout(() => {
					                  	  	done();
					                  	  },100)

					                  }
					              });
                  	 }
        	 	 })
       	
        }).catch(() => {});
     
	   },
	   //搜索
	    search:function(){	
	     this.fullscreenLoadingsearch=true;   	
	   	 var status=this.currentType;
	   	 if(this.currentType==="在线"){
	   	 	status=0
	   	 }else if(this.currentType==="离线"){
	   	 	status=1
	   	 }else if(this.currentType==="----"){
	   	 	status=2
	   	 }else if(this.currentType==="" || this.currentType==="请选择"){
	   	 	status=-1
	   	 }
	   	  var ip=this.searchInputip1;
	   	  var port=this.searchInputport;
	   	  if(this.$store.getters.searchFlag ===200 || this.$store.getters.searchFlag===0){
              	   	  setTimeout(() => {
		                  	  	this.fullscreenLoadingsearch=false;
		                  },300);
                }else{
                	  setTimeout(() => {
		                  	  	this.fullscreenLoadingsearch=false;
		                  },300);
                	   this.$alert("搜索失败", '提示', {
				           	confirmButtonText: '确定',
				           	type:'error'})

                }
	   	  if(this.searchInputname==="" && this.searchInputip1===""  && this.searchInputport==="" && status==="" ){
	   	  	   this.$store.dispatch('getshowTable',{"pageLine":this.pagesize,"pageNum":this.currentPage});
	   	  	   return ;
	   	     }else{
	   	     	if(port===""){
	   	  	 	   port=-1
	   	  	     }else{
	   	  	 	  port=Number(port);
	   	  	    }
              	var p={"name": this.searchInputname, "ip": ip, port: port,"status":status};
              	    this.$store.dispatch('getSearchTable',p);
	   	  	       
	   	      }


	   },
	   //每页显示数据量变更
	    handleSizeChange: function(val){
            this.pagesize = val;
        	this.$store.dispatch('getshowTable',{"pageLine":val,"pageNum":1});
    	    this.currentPage = 1;
        },
        //页码变更
        handleCurrentChange: function(val){
            this.currentPage = val;
            this.$store.dispatch('getshowTable',{"pageLine":this.pagesize,"pageNum":val});
        }, 
        //状态刷新
        RefreshStatus:function(){
        	this.fullscreenLoading = true;
            this.$http.get(nodeUrl.nodeFreshUrl).then(res=>{
           	if(res.body.code===201){
           	   this.$alert(res.body.status, '提示', {
	           	confirmButtonText: '确定',
	           	 type:'error'
	            });
           	   this.fullscreenLoading = true;
	            setTimeout(() => {
	           this.fullscreenLoading = false;
	         }, 3000);
           	}else {
           		 this.fullscreenLoading = true;
			        	if(res.body.code===200){
						   this.fullscreenLoading = false;
                          this.$alert(res.body.status, '提示', {
				           	confirmButtonText: '确定',
				           	type:'success',
				            beforeClose:(action, instance, done) =>{
				                this.$store.dispatch('getshowTable',{"pageLine":this.pagesize,"pageNum":this.currentPage});   	
		                  	  setTimeout(() => {
		                  	  	done();
		                  	  },100);
		                  }
		            });
			      }
           	}
         })
        },
        //离线在线样式设置
        filterTag:function(value, row) {
        return row.status === value;
      }
   }

}
</script>