
// 定义验证规则
$(function () {
    // 导出layui的form属性
let form = layui.form

let layer = layui.layer

    form.verify(function(value) {
        if (value.length > 6) {
            return '昵称长度不能大于6个字符串'
        }
    })
    //调用初始化用户信息的函数
initUserInfo()

//定义初始化用户的基本信息的函数
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            } 
                console.log(res)
                //使用form.val为表单赋值
                form.val('formUserInfo', res.data)
            

        }
    })
}



    //实现表单的重置行为
    $('#btnReset').click(function(e) {
        //阻止重置按钮的默认清空行为
        e.preventDefault()
        //调用初始化用户信息的函数
        initUserInfo()

    })


    //监听表单的提交行为
    $('.layui-form').submit(function(e) {
        //阻止默认的提交行为
        e.preventDefault()
        //发起ajax请求来更新用户的信息
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            //直接获取数据
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                   return layer.msg('更新用户信息失败！')
                }
                    layer.msg('更新用户信息成功！')
                    //调用父页面中的方法getUserInfo()，重新渲染用户的数据
                window.parent(getUserInfo())
            }
        })
    })
})

