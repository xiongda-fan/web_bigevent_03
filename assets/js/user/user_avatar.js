//入口函数
$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //为上传按钮绑定点击事件
    $("#btnChooseImage").on('click', function() {
        $("#file").click();
    })


    //3. 修改裁剪图片
    $("#file").on("change", function(e) {
        //拿到用户选择的文件
        var file = e.target.files[0];
        //非空校验
        if (file == undefined) {
            return layui.layer.msg("请选择用户头像！");
        }
        //根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
            // 先销毁旧的裁剪区域  再重新设置图片路劲  之后再创建新的裁剪区域
        $image
            .cropper("destroy") //销毁旧的裁剪区域
            .attr('src', newImgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域
    })


    //4. 上传图片
    $("#btnUpload").on('click', function() {
        //获取 base64 类型的头像（字符串）
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        console.log(dataURL)
        console.log(typeof dataURL)
            //发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg("恭喜您，更换头像成功");
                window.parent.getUserInfo();
            }
        })
    })

    getUserInfo();
    //渲染默认图像
    function getUserInfo() {
        //发送ajax
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                console.log(res);
                //判断状态码
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //请求成功  渲染用户头像
                $image
                    .cropper("destroy") //销毁旧的裁剪区域
                    .attr('src', res.data.user_pic) //重新设置图片路径
                    .cropper(options) //重新初始化裁剪区域
            }
        })
    }

})