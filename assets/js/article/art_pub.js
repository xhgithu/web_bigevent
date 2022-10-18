$(function() {
    let layer = layui.layer
    let form = layui.form
    //调用实现文章类别的方法
    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 获取文章类别
    function initCate() {
        //发起获取文章类别的ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
  
    // 2. 裁剪选项
    var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
    }
  
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮添加点击事件
    $('#btnChooseImage').on('click', function() {
        //点击选择封面按钮会为隐藏文件选择框添加点击事件
        $('#coverFile').click()
    })

    //为隐藏的文件选择框添加change事件，监听文件的选择
    $('#coverFile').on('change', function(e) {
        // 获取结果
        let files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
         // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    })


    //定义文章的发布状态，默认为已发布
    let art_state = '已发布'
    // 给存为草稿按钮添加点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })


    //为form表单添加提交事件，用来获取表单中的内容
    $('#form-pub').on('submit', function(e) {
        //阻止默认的提交行为
        e.preventDefault()

        //基于form表单来快速获得一个formDate对象
        //$(this)[0]是指将表单转化为一个原生的Dom对象
        let fd = new FormData($(this)[0])

        //将state值填入到fd对象中
        fd.append('state', art_state)

        // //forEach方法循环fd来查看数据
        // //v 代表值
        // //k 代表键
        // fd.forEach(function (v, k) {
        //     console.log(k, v)
        // })



        //将裁剪过后的图片输出为一个文件对象
        $image
        .cropper('getCroppedCanvas', { 
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
        })
        .toBlob(function(blob) {       
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //将获得的文件对象，添加给fd表单
        fd.append('cover_img', blob)
        //发起ajax数据请求，用来发布文章
        //调用发布文章的方法
        publishArticle(fd)
        })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是formDate类型的数据
            //则必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功！')
                //跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})