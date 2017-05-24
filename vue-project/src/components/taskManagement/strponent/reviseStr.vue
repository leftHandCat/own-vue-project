
<template>
  <div class="reviseStrDiv">
      <el-dialog title="修改策略" :visible.sync="$store.state.strRevise.layShow" size="tiny">
       <el-form :model="formMessage" ref="formMessage" class="dialogMinWidth">
              <el-form-item label="策略名称">
                <el-input v-model="formMessage.name" size="small" placeholder="请输入" :disabled="true"></el-input>
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
    props:['strId','strName'],
    data(){
      return {
        dialogTableVisible:true,
        currentPage:'',
        innerBoxShow:false,
        confirmMg:'保存',
        uploading:false,     //提交的图标
        stepLevel: stepLevelObj,
        actionStyle: actionStyleObj,
        langComp: langCompObj,
        ifDistable:true,    //是否禁止
        orginExecNodeId:'',
        formMessage:{
          name:'',        //策略名称
          execMode:'',    //执行模式 0：本地执行 1：远程执行
          isPassExport: false,  //远程下载
          logLevel:'',      //日志级别
          execNodeId:''    //执行节点id
        }
      }
    },
    created(){
      this.formMessage.name = this.strName;
    },
    mounted(){
      this.$nextTick(() => {

        //请求发送得到当前的信息
        this.getStrData();

      })
    },
    watch:{
      /*监听是否选择远程连接*/
      'formMessage.execMode': function(newVal,oldVal){

        let _this = this;

        actionStyleObj.forEach((val,index) => {
          if(val.label === newVal){
            newVal = val.value;
          }
        })

        if(newVal === "1"){   //远程
          _this.ifDistable = false;   //取消禁止选择
          this.formMessage.execNodeId = this.orginExecNodeId;
        }else{
          _this.ifDistable = true;   //取消禁止选择
          this.formMessage.execNodeId = '';
        }
      }
    },
    methods:{
       getStrData(){

          let param = {strategy: this.strId};

          let promise = PostAjax(urls.modifyStr,param);

          promise.done((res) => {
            let code = res.code;
            let message = res.message;

            if(code === 0){
              let result = res.result;
              let clickData = result.execStrategy;

              this.formMessage.name = clickData.name;
              this.formMessage.execMode = clickData.execMode;
              this.formMessage.execNodeId = clickData.execNode;
              this.formMessage.isPassExport = clickData.isPassExport == 'N' ? false : true;
              this.formMessage.logLevel = clickData.logLevel;
              //保存一份原始的节点名称
              this.orginExecNodeId = clickData.execNode;
            }else{
              //其他情况
              RequestError(this,message);
            }

          });
          promise.fail((err) => {
            console.warn("click str AjaxError")
          })

       },
       //表单提交
       submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            /*全部有效，确认按钮*/
            let execStrategy = ObjCopy(this.formMessage);

            execStrategy.execNodeId = execStrategy.execNodeId === "" ? "null" : execStrategy.execNodeId;
            execStrategy.isPassExport =  execStrategy.isPassExport === false ? "N" : "Y";

            this.uploading = true;
            this.confirmMg = "提交中";

            //向后台发参数， 提交数据
            let promise = PostAjax(urls.reviseNoti,execStrategy);

            promise.done((res) => {
              let code = res.code;
              let message = res.message;
              code === 0 ? this.addSucc() : this.addError();
            });
            promise.fail((err) => {
              console.warn("revise str error")
            })
           
          }else {
            console.warn('error!!');
            return false;
          }
        });
      },
      addSucc(){

          //this.closeLayer();

          this.uploading = false;    //关闭loading
          let successMg = '成功';

          this.$confirm(successMg,'提示',{
            confirmButonText:'确认',
            showCancelButton:false,
            type:'success'
          }).then(()=>{
            /*点击确认*/
            //发请求,重新请求最新的策略信息
            this.closeLayer();   //关闭遮罩层

           let currPage = this.$store.state.stragePagitation.currPage;
           let currperItem = this.$store.state.stragePagitation.pageSize;

            let param = {pageIndex: currPage, perItem: this.currperItem};
            //刷新str数据
            refreshStrdata(this,urls.strageList,param);

          }).catch(()=>{
             /*点击关闭*/
             this.closeLayer();   //关闭遮罩层
          })
          
      },
      addError(){
           //失败提示原因
          let errorMessage = '提交失败';
          this.$confirm(errorMessage,'提示',{
            confirmButonText:'确认',
            showCancelButton:false,
            type:'success'
          }).then(()=>{
            /*点击确认*/
            this.closeLayer(); //关闭遮罩层
           
          }).catch(()=>{
            this.closeLayer();   //关闭遮罩层
          })
      },
      closeLayer(){
        let obj = {type: 'close'};
        this.$store.dispatch("resetStreviseMessage",obj);
      }
    }
  }
</script>