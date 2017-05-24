import commonFun from '../common.js';

const PostAjax = commonFun.PostAjax;
const GetAjax = commonFun.GetAjax;
const RequestError = commonFun.RequestError;

const refreshStrdata = function(_this,url,param){
	/*得到新数据*/
  let promise = PostAjax(url,param);

  promise.done((res) => {
    console.log(res,param)
    let code = res.code;
    let message = res.message;
    let total = res.total;

    if(code === 0){

      let data = res.result;
      let obj = {datas: data, totalItem: res.total};
      //更新页面数据，和总数
      _this.$store.dispatch('resetStrDataAndTotalItem',obj);
    }else{
      //提示请求异常
        let message = res.message;

        RequestError(_this,message);
    }

  });
  promise.fail((err) => {
    console.warn("strageAjaxError");
  })
}

export default {refreshStrdata};

