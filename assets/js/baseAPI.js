// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  //在发起真正的Ajax请求之前，统一拼接请求的根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url

  // 统一为有权限的接口设置headers请求头
  //写在ajaxPrefilter 这个函数中 
  // options.headers 等于一个对象
if (options.url.indexOf('/my/') !== -1) {
  options.headers =  {
    Authorization: localStorage.getItem('token')||''
  }
}
//全局统一挂载complete函数
//不论成功还是失败，都要调用complete函数
options.complete = function (res) {
  //在cpmplete回调函数中，可以使用res.responseJSON来获取服务器响应回来的数据
  if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //清空token
      localStorage.removeItem('token')
      //跳转到登录页面
      location.href = '/login.html'
  }
}


})


