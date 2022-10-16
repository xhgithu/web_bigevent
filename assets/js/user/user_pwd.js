//定义密码的验证规则
$(function () {
    //导入layui的form对象
    let form = layui.form
    //定义验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
          //定义新旧密码不能重复的验证规则
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        //定义重复输入新密码的规则
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入的密码不一致！'
            }
        }
    })
    //实现重置密码功能
    //给表单绑定提交事件
    $('.layui-form').submit(function(e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        //调用ajax请求来实现重置密码功能
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                //重置密码界面表单
                $('.layui-form')[0].reset()
            }
        })
    })
})