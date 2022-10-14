$(function() {
    getUserInfo()
    //实现退出的功能
    $('#btnLogout').click(function() {
        //layui上的弹出框
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            //清空token里保存的值
            localStorage.removeItem('token')
            //跳转到登录页面
            location.href = '/login.html'
            
            layer.close(index);
          });
    })
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')||''
        // },
        success: function(res) {
            //如果获取失败，则提醒用户
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //这边需要导入实参来给下面的形参赋值，写在回调函数中
            renderAvater(res.data)
        },
        // //不论成功还是失败，都要调用complete函数
        // complete: function (res) {
        //     //在cpmplete回调函数中，可以使用res.responseJSON来获取服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //清空token
        //         localStorage.removeItem('token')
        //         //跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
        
    })
  
}

//渲染用户的头像
function renderAvater(user) {
    // 获取用户的名称
    let name = user.nickname || user.username
    //设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    //按需渲染用户的对象
    if (user.user_pic !== null) {
        //渲染用户头像
        $('.layui-nav-img')
        .attr('src', user.user_pic)
        .show()
        $('.text-avatar').hide()
    } else {
        //渲染文本头像
        //得到用户名字的第一个字并且大写
        let first = name[0].toUpperCase()
        $('.text-avatar')
        .show()
        .html(first)
        $('.layui-nav-img').hide()

    }

}