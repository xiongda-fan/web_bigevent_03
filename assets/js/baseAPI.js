var baseURL = "http://ajax.frontend.itheima.net";


$.ajaxPrefilter(function(params) {
    //拼接对应环境的服务器地址
    params.url = baseURL + params.url;



    //对需要权限的接口配置头信息
    //必须以my开头的才行
    if (params.url.indexOf("/my/") !== -1) {
        params.headers = {
            //重新登陆 因为token过期事件12小时
            Authorization: localStorage.getItem('token') || ""
        }
    }


    //3.拦截所有响应 判断身份认证信息
    params.complete = function(res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message == "身份验证失败！") {
            //1. 清空本地token
            localStorage.removeItem('token');
            //2.页面跳转
            location.href = '/login.html';
        }
    }
});