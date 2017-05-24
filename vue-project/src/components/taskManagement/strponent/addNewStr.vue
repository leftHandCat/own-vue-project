<template>
  <div class="newStrDiv">
    <el-dialog title="新增策略" :visible.sync="$store.state.strAddNew.layShow" size="tiny">
       <el-form :model="formMessage" ref="formMessage" :rules="rules" class="dialogMinWidth">
        <el-form-item label="策略名称" prop="name">
          <el-input v-model="formMessage.name" size="small" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="执行方式" prop="execMode">
          <el-select v-model="formMessage.execMode" placeholder="请选择" size="small">
            <el-option v-for="item in actionStyle" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="远程主机" prop="execNodeId">
          <el-select v-model="formMessage.execNodeId" placeholder="请选择" size="small" :disabled="ifDistable">
            <el-option v-for="item in langComp" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="将导出的文件发送到远程服务器" prop="isPassExport">
          <el-switch v-model="formMessage.isPassExport" on-text="" off-text="" :disabled="ifDistable"></el-switch>
        </el-form-item>

        <el-form-item label="级别" prop="logLevel">
          <el-select v-model="formMessage.logLevel" placeholder="请选择" size="small">
            <el-option v-for="item in stepLevel" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="sureorclose">
          <el-button type="primary" size="small" @click="submitForm('formMessage')" >
            <i class="el-icon-loading" v-if="uploading"></i>
            <span>{{confirmMg}}</span>
          </el-button>
          <el-button size="small" @click="closeLayer">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>

  import commonFun from '../common.js';
  import refreshStrFun from './strAjax.js';
  import url from '../../../url/urls.js';

  const urls = url.taskMange;
  const refreshStrdata = refreshStrFun.refreshStrdata;

  const ObjCopy = commonFun.ObjCopy;
  const PostAjax = commonFun.PostAjax;
  const RequestError = commonFun.RequestError;

	const actionStyleObj = [
		{value:'0', label: '本地执行'},
		{value:'1', label: '远程执行'}
	];

  const stepLevelObj  = [
    {value:'0', label: '没有日志'},
    {value:'1', label: '错误日志'},
    {value:'2', label: '最小日志'},
    {value:'3', label: '基本日志'},
    {value:'4', label: '详细日志'},
    {value:'5', label: '调试日志'},
    {value:'6', label: '级别日志'}
  ];

  const langCompObj  = [
    {value:'00', label: '远程1'},
    {value:'11', label: '远程2'},
    {value:'22', label: '远程3'},
    {value:'33', label: '远程4'},
    {value:'44', label: '远程5'},
    {value:'55', label: '远程6'},
    {value:'66', label: '远程7'}
  ];


	export default{
		data(){
			return {
        currentPage:'',
        perItem:'',
        innerBoxShow:false,
        confirmMg:'立即创建',
        uploading:false,     //提交的图标
				stepLevel: stepLevelObj,
				actionStyle: actionStyleObj,
        langComp: langCompObj,
        ifDistable:true,    //是否禁止
				formMessage:{
					name:'',        //策略名称
					execMode:'',    //执行模式 0：本地执行 1：远程执行
          isPassExport: false,  //远程下载
          logLevel:'',      //日志级别
          execNodeId:''    //执行节点id
				},
				rules:{
					name:[
						{required:true, message:'请输入策略名称',trigger:'blur'},
						{min: 1, max:5, message:'长度在1到5个字符',trigger: 'blur'}
					],
					execMode:[
						{required:true, message:'请选择一项',trigger:'change'}
					],
          logLevel:[
            {required:true, message:'请选择一项',trigger:'change'}
          ],
          execNodeId:[
            {required:false, message:'请选择一项',trigger:'change'}
          ]
				}
			}
		},
    created(){
      
    },
    watch:{
      /*监听是否选择远程连接*/
      'formMessage.execMode': function(newVal,oldVal){

        let _this = this;

        if(newVal === "1"){
          _this.ifDistable = false;   //取消禁止选择
          _this.rules.execNodeId[0].required = true;    //远程必选
        }else{
          _this.ifDistable = true;   //取消禁止选择
          _this.rules.execNodeId[0].required = false;  //远程必选
        }
      }
    },
		methods:{
			 submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            /*全部有效，确认按钮*/
            let execStrategy = ObjCopy(this.formMessage);

            execStrategy.execNodeId = execStrategy.execNodeId === "" ? "null" : execStrategy.execNodeId;
            execStrategy.isPassExport =  execStrategy.isPassExport === false ? "N" : "Y";

            // this.uploading = true;
            // this.confirmMg = "提交中";
            //向后台发参数， 提交数据
            let promise = PostAjax(urls.addNewStr,execStrategy);

            promise.done((res) => {
              let code = res.code;
              let message = res.message;

              let successType = 'success';
              let errorType = 'error';

              if(code === 0){
                this.confirmOrCancel(message,successType)
              }else{
                this.confirmOrCancel(message,errorType)
              }

            });
            promise.fail((err) => {
              console.warn("request error");
            })
           
          }else {
            return false;
          }
        });
      },
      //提交后弹出失败或成功
      confirmOrCancel(msg,type){

        let currPage = this.$store.state.stragePagitation.currPage;
        let currperItem = this.$store.state.stragePagitation.pageSize;

        // this.uploading = false;    //关闭loading
        let param = {pageIndex: currPage, perItem: currperItem, searchText: ''};

        this.$confirm(msg,'提示',{
          confirmButonText:'确认',
          showCancelButton:false,
          type: type
        }).then(()=>{
          /*点击确认*/
          //发请求,重新请求最新的策略信息
          this.closeLayer();  //关闭遮罩层
          //刷新数据和页码
          refreshStrdata(this,urls.strageList,param);

        }).catch(()=>{
           /*点击关闭*/
           this.closeLayer();  //关闭遮罩层 
          //刷新数据和页码
          refreshStrdata(this,urls.strageList,param);
         
        })
      },
			closeLayer(){
				  let type = 'open';
          this.$store.dispatch('addStreviseMessage',type)
			}
		}
	}
</script>