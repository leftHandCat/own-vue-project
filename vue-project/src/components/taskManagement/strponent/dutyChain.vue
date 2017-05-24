<template>
  <div class="dutyChainDiv">
    <el-dialog :title="dutyType" :visible.sync="$store.state.dutyChain.layShow" size="tiny">
       <!-- 内容 -->

      <!-- 搜索 -->
      <el-button type="primary" @click="confirmDutyChain" size="small" class="dubleChain">{{confirmsg}}</el-button>

      <el-input placeholder="请输入" v-model="inputVal" size="small"></el-input> 
      <el-button type="primary" icon="search" @click.stop="searchClick()" size="small">搜索</el-button>

      <!-- 表格 -->
      <div class="tableGation">
        <el-table :data="dutyData" stripe border tooltip-effect="dark" style="width:100%" @select="selectOneFun" @select-all="selectAllFun" ref="multipleTable" :empty-text="tableEmptyText">
          <el-table-column type="selection" width="0.1"></el-table-column>
          <el-table-column prop="name" label="任务名称"></el-table-column>
          <el-table-column :label="columnName">
            <template scope="scope">
              <span :class="iconClass" @click="singleDutyChain(scope.row)"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagation">
         <el-pagination layout="total, prev, pager, next, sizes, jumper, pager" :total="$store.state.dutyChain.pagitation.totalItem" :current-page="$store.state.dutyChain.pagitation.currPage" :page-sizes="$store.state.dutyChain.pagitation.pageSizeArr" :page-size="$store.state.dutyChain.pagitation.pageSize" @current-change="handleCurrentChange" @size-change="handleSizeChange">
         </el-pagination>
      </div>
      <!-- 尾部 -->
      <!-- <div class="el-message-box__btns">
      
        <span class="chainRed" v-if="noItem">至少选择一项</span>
      
        <el-button type="primary" size="small" @click="confirmDutyChain">
          <i class="el-icon-loading"></i>
          {{confirmsg}}
        </el-button> 
        <el-button size="small" @click="closeLayer">
          取消
        </el-button>
          </div> -->
    </el-dialog>
  </div>
</template>

<script>

  import url from '../../../url/urls.js';
  import commonFun from '../common.js';

  const urls = url.taskMange;
  const PostAjax = commonFun.PostAjax;
  const ObjCopy = commonFun.ObjCopy;
  const RequestError = commonFun.RequestError;

  export default{
    props:['dutyType','strId','strName'],
    data(){
      return {
        inputVal:'',
        dutyData:[],                //只是不做显示
        pageChangeSelectionArr:[],   //翻页时已经被点击的
        newestSelection:[],      //当前页最新被点击的
        oldPage:'',
        newPage: '',
        noItem:false,
        requestUrl:'',   //进入页面请求，地址
        sendUrl: '',    //确认后的发送任务信息，地址
        confirmsg:'',   //确认按钮： 关联，解除关联
        notiedmsg:'',   //关联成功、失败
        searchText:'',
        tableEmptyText:'暂无数据',
        iconClass:'',    //关联的图标和解除关联的图标s
        columnName:''
      }
    },
    created(){

      //实例化创建的时候页数到 0
      this.$store.dispatch('resetDutyChainPageSize',20);
      this.$store.dispatch('resetDutyChainCurrPage',1);

      if(this.dutyType === '查看关联'){

          this.requestUrl = urls.unrelationJobRequest;
          this.sendUrl = urls.sendJobsId;

          this.iconClass = "fa fa-chain-broken";
          this.columnName = '解除关联';
          this.confirmsg = '批量解除关联';
          this.notiedSuccmsg = "解除关联成功";
          this.notiedEorrmsg = "解除关联失败";
      }else{   //关联任务
          this.requestUrl = urls.queryRelationReq;
          this.sendUrl = urls.removeJobReq;

          this.columnName = '关联';
          this.iconClass = "fa fa-link";
          this.confirmsg = '批量关联';
          this.notiedSuccmsg = "关联成功";
          this.notiedEorrmsg = "关联失败";
      }

    },
    watch:{
      "$store.state.dutyChain.pagitation.currPage":function(newVal,oldVal){
        this.oldPage = oldVal;
        this.newVal = newVal;
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.getRalationDutyData();
      })
    },
    updated(){
      //实例更新, 打钩
      if(this.oldPage !== this.newPage){
          this.hasSelectedFun();
      }
    },
    methods:{
      //获取数据
      getRalationDutyData(){

        let currPage = this.$store.state.dutyChain.pagitation.currPage;
        let currperItem = this.$store.state.dutyChain.pagitation.pageSize;

        let param = {pageIndex: currPage, perItem: currperItem, searchText:this.searchText};

        let promise = PostAjax(this.requestUrl,param);

        promise.done((res) => {
          let code = res.code;
          let message = res.message;

          if(code === 0){

            let jobs = res.result
            this.dutyData = jobs;
            //任务条数
            this.$store.dispatch('resetDutyChainTotalItem',res.total);

          }else{
            RequestError(this,message);
          }
        });

        promise.fail((res) => {
            console.warn("Request Error")
        })

      },
      searchDutyDataError(){
          //没有搜索到相关信息
          
      },
      searchClick(){
        if(this.inputVal === ''){   //全量刷新
          
          this.tableEmptyText = '未找到任何匹配信息';

          this.getRalationDutyData();
        }else{
          this.searchText = this.inputVal;
          this.getRalationDutyData();
        }

      },
      //单选的数据
      selectOneFun(selection,row){
        let exist = selection.every((v,i) => {
            return row.id !== v.id
        });

        let hasSelected = this.pageChangeSelectionArr;

        this.noItem = false

        //true 重复，需要取消
        //false 没有重复，需要删除.
        if(exist){
            console.log("取消打钩");
            //取消打钩
            for(let i = 0; i < hasSelected.length; i++){
              if(hasSelected[i].id === row.id){
                hasSelected.splice(i,1);
                return;
              }
            }

            this.pageChangeSelectionArr = hasSelected;

          }else{
            console.log("打钩");
            //当前页打钩
            this.newestSelection = selection;
          }

      },
      //全选
      selectAllFun(selection){
        //将已经存在的移除，直接把现在全选的存入
          //若 selection 为空则就是取消全新
          if(selection.length === 0){
            //取消全选  mangerData 全部取消
            let hasSelected = this.selectAllCommon();
            let noRepeactSelected = this.selectAllCommon();

            //防止 undefined 的出现
            noRepeactSelected = noRepeactSelected === undefined ? [] : noRepeactSelected;

            this.pageChangeSelectionArr = noRepeactSelected;

          }else{
            //全选, 删除存在列表的拼接不存在的
            let dutyData = this.dutyData;
            let noRepeactSelected = this.selectAllCommon();

            //防止 undefined 的出现
            noRepeactSelected = noRepeactSelected === undefined ? [] : noRepeactSelected;
            this.pageChangeSelectionArr = dutyData.concat(noRepeactSelected);
          }
      },
      //全选和取消全新公共方法封装
      selectAllCommon(){

        let hasSelected = ObjCopy(this.pageChangeSelectionArr);
        let dutyData = this.dutyData;

        for(var i = 0; i < hasSelected.length; i++){
          for(var j = 0; j < dutyData.length; j++){
              if(hasSelected[i].id == dutyData[j].id){
                hasSelected.splice(i,1);
                break;
              }
          }
        }
        //防止 undefined 的出现
        hasSelected = hasSelected === undefined ? [] : hasSelected;

        return hasSelected;
      },
      //更新页数
      handleCurrentChange(val){

        this.$store.dispatch('resetDutyChainCurrPage',val);
        this.pageChangeSelectionArr = this.pageChangeSelectionArr.concat(this.newestSelection);

        this.newestSelection = [];

        //拼接
        if(val === 1){
          this.getRalationDutyData();
        }else{
           this.getRalationDutyData();
        }

      },
      //当前页之前勾选的打钩
      hasSelectedFun(){
        let dutyData = this.dutyData;
        let clickCurrPageSelect = this.pageChangeSelectionArr;

        if(clickCurrPageSelect !== undefined){

          if(clickCurrPageSelect.length !== 0){

            clickCurrPageSelect.filter((val,index) => {
              for(let i = 0; i < dutyData.length; i++){
                if(val.id === dutyData[i].id){
                  this.$refs.multipleTable.toggleRowSelection(this.dutyData[i]);
                  return;
                }
              }
            })
          }
        }

      },
       /*每页的数量分布*/
      handleSizeChange(val){

        this.$store.dispatch('resetDutyChainPageSize',val);
          
          if(this.$store.state.queryChain.pagitation.currPage !== 1){

              this.$store.dispatch('resetDutyChainCurrPage',1);//手动刷新到第一页
              this.getRalationDutyData();

          }else{
            this.getRalationDutyData();
          }

      },
      //批量关联，或解除关联
      confirmDutyChain(){
        //发送数据到后台
        this.oldPage = this.newPage;
        this.pageChangeSelectionArr = this.pageChangeSelectionArr.concat(this.newestSelection);

        let param = {strategy:this.strId, jobs: this.pageChangeSelectionArr};


        if(this.pageChangeSelectionArr.length === 0){
          this.noItem = true;
        }else{

          this.sendoutChainData(param);

        }
      },
      //单个关联或解除
      singleDutyChain(row){

        let param = {strategy:this.strId, jobs: row};

        this.sendoutChainData(param);

      },
      //发送出去
      sendoutChainData(param){

        let promise = PostAjax(this.sendUrl, param);

          promise.done((res)=>{
            let code = res.code;
            let successType = 'success';
            let errorType = 'error';

            if(code === 0){
              this.confirmPopBox(successType,this.notiedSuccmsg)
            }else{
              this.confirmPopBox(errorType,this.notiedEorrmsg);
            }

          });
          promise.fail((res)=>{
            this.closeLayer();    //关闭遮罩层
            console.warn('request error');
          })
      },
      //点击确认后弹出框的信息
      confirmPopBox(type, msg){
        this.$confirm(msg,'提示',{
            confirmButonText: '确认',
            showCancelButton:false,
            type: type,
        }).then(() => {
            this.closeLayer();
        }).catch(() => {
           this.closeLayer();
        })
      },
      closeLayer(){
        //关闭遮罩层
        let type = {type: 'close'};
        this.$store.dispatch('dutyChainShow',type);

      }
    }
  }
</script>

<style scoped>
  .dutyChain{
    width: 6rem;   /* 关联任务的弹框大小 */
}

/* 关联任务的表格高度 */
.dutyChain .el-table__body-wrapper{
    height: 2rem;
}

/* 分页与确认的距离 */
.dutyChain .pagation{
    margin-bottom: 0.1rem;
}

.dubleChain{
    margin-right: 0.5rem;
    margin-bottom: 10px;
}
</style>