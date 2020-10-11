//入口函数
$(function() {
    //1. 文章类别列表渲染
    initArtCateList();
    //封装函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                var str = template('tpl-art-cate', res);
                $("tbody").html(str);
            }
        })
    }



    //2. 显示添加文章分类列表
    var layer = layui.layer;
    $("#btnAdd").on('click', function() {
        //利用框架代码   显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: "添加文章分类",
            area: ['500px', '250px'],
            content: $("#dialog-add").html()
        });
    })


    //通过代理的形式 为 form-add 表单绑定 submit 事件(事件委托)
    var indexAdd = null;
    $('body').on('submit', '#form-add', function(e) {
        //阻止表单默认提交
        e.preventDefault();
        // alert($(this).serialize())
        $.ajax({
            method: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //因为我们添加成功了  所以要重新渲染页面中的数据
                initArtCateList();
                layer.msg("恭喜您，文章类别添加成功！");
                layer.close(indexAdd);
            }
        })
    })

    //通过代理的形式 为 btn-edit 表单绑定 click 事件(事件委托)
    //修改文章类型 修改值
    var indexEdit = null;
    $("tbody").on('click', '.btn-edit', function() {
        //利用框架 显示提示修改文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-edit").html()
        });

        //获取 Id 发送sjax获取数据 渲染到页面
        var form = layui.form;
        var Id = $(this).attr("data-id");
        // alert(Id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function(res) {
                form.val("form-edit", res.data);
            }
        })
    })

    //  修改提交
    $("body").on('submit', "#form-edit", function(e) {
        //阻止表单默认提交
        e.preventDefault();
        // alert($(this).serialize())
        $.ajax({
            method: "POST",
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //因为我们添加成功了  所以要重新渲染页面中的数据
                initArtCateList();
                layer.msg("恭喜您，文章类别更新成功！");
                layer.close(indexEdit);
            }
        })
    })




    //删除
    $("tbody").on('click', ".btn-delete", function() {
        //先获取 Id 进入到函数中this代指就改变了
        var Id = $(this).attr("data-id");
        //显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //因为我们添加成功了  所以要重新渲染页面中的数据
                    initArtCateList();
                    layer.msg("恭喜您，文章类别删除成功！");
                    layer.close(index);
                }
            })
        });
    })
})