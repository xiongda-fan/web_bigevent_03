//入口函数
$(function() {
    //1. 点击去注册账号 隐藏登陆区域 显示注册区域
    $("#link_reg").on('click', function() {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    //2. 点击去登录 显示登陆区域  隐藏注册区域 
    $("#link_login").on('click', function() {
        $(".login-box").show();
        $(".reg-box").hide();
    })


    //自定义验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        //密码规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //确认密码规则
        repwd: function(value) {
            var pwd = $(".reg-box input[name=password]").val();
            //比较
            if (value !== pwd) {
                return "两次密码输入不一致!";
            }
        }
    });


    //注册功能
    $("#form_reg").on('sbumit', function(e) {
        //阻止表单默认提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val(),
            },
            success: function(res) {
                //判断返回状态
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //提交成功后处理代码
                layer.msg(res.message)
                    //手动切换到登陆表单
                $("#link_login").click();
                //重置form表单
                $("#form_reg")[0].reset();
            }
        })
    });


    //登录功能
    $("#form_login").submit(function(e) {
        //阻止表单默认提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                //判断返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //提示信息  保存token 跳转页面
                layer.msg("恭喜您，登录成功！");
                //保存token 未来的接口要使用token
                localStorage.setItem('token', res.token);
                //跳转
                location.href = "/index.html";
            }
        })
    })
})