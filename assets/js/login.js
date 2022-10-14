//实现登录和注册页面的隐藏和切换
$(function() {
//点击‘去注册账号’链接
$('#link_reg').on('click', function() {
  $('.login-box').hide()
  $('.reg-box').show()
  
})

//点击‘去登录’链接
$('#link_login').on('click', function() {
  $('.reg-box').hide()
  $('.login-box').show()
})
//从layui中获取form对象    只要导入了layui.js,我们就拥有了layui的form对象
let form = layui.form
//从layui中获取layer对象 layer对象可以用来弹出提示消息
let layer = layui.layer
//通过form.verify() 函数来自定义一个校验规则
form.verify({
  //自定义pwd校验规则,然后将pwd赋给lay-verify属性即可
  pwd: [
    /^[\S]{6,12}$/
    ,'密码必须6到12位,且不能出现空格'
  ] ,
  //校验两次密码是否一致的规则
  repwd: function(value) {
    //可以通过value获取确认密码的值
    //获取第一次输入密码的值
    //可以通过父元素以及input的name属性来获取第一次密码的值
    let pwd = $('.reg-box [name=password]').val()
    if (pwd !== value){
      return '两次密码不一致'
    }
  }
})

//监听注册表单的提交事件
$('#form_reg').on('submit', function(e) {
  let data = {
    username: $('#form_reg [name=username]').val(),
    password: $('#form_reg [name=password]').val()
  }
  //阻止默认提交行为
  e.preventDefault()
  $.post('/api/reguser', data, function(res){
    if(res.status !== 0) {
      return layer.msg(res.message)
    }
    layer.msg('注册成功，请登录')
    $('#link_login').click()
  }) 
})
//监听登录表单的提交事件
$('#form_login').submit(function(e) {
//阻止默认行为
  e.preventDefault()
  //利用ajax来提交表单数据
  $.ajax({
    url: '/api/login',
    method: 'POST',
    data: $(this).serialize(),
    success: function(res) {
      if(res.status !== 0) {
        return layer.msg('登录失败！')
      }
      layer.msg('登录成功！')
      //将登录成功得到的token字符串，保存到localStorage中
      //token字符串可以用来获取那些有权限的接口
      localStorage.setItem('token', res.token)
      //跳到后台主页
      location.href = '/index.html'
    }
  })
})



})


