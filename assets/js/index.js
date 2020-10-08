//入口函数
$(function() {
    //1. 获取用户信息
    getUserInfo();


    //2. 退出
    var layer = layui.layer;
    $("#btn-logout").on('click', function() {
        //框架提供的询问框
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //1. 清空本地存储的token
            localStorage.removeItem('token');
            //2.页面跳转
            location.href = '/login.html'

            layer.close(index);
        });
    })
});

//获取用户信息（封装到入口函数的外面）
//后面其他的页面要调用
function getUserInfo() {
    //发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     //重新登陆 因为token过期事件12小时
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function(res) {
            console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            //请求成功 渲染用户头像信息
            renderAvatar(res.data);
        }
    })
}

//封装用户头像渲染函数
function renderAvatar(user) {
    //1. 用户名（昵称优先，没有就用username）
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    //2. 用户头像
    if (user.user_pic !== null) {
        //有头像
        $(".layui-nav-img").show().attr('src', user.user_pic);
        $(".user-avatar").hide();
    } else {
        //没有头像
        $(".layui-nav-img").hide();
        var text = name[0].toUpperCase();
        $(".user-avatar").show().html(text);
    }
}