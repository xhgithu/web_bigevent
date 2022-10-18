$(function() {
    let layer = layui.layer
    let form = layui.form
    //调用获取文章分类列表的函数
    initArtCateList()

    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {

                let htmlStr = template('tpl-table', res)
                //给tbody中加入要渲染的内容
                $('tbody').html(htmlStr)
                
            }
        })
    }


    //定义一个indexAdd 用来关闭弹出层
    let indexAdd = null

    //给添加类别按钮添加点击事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
          }) 
    })


    

    //通过委托的形式来给form表单添加提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        // console.log('ok')
        // 通过ajax函数提交数据
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加信息失败！')
                }
                initArtCateList()
                layer.msg('添加信息成功！')
                //关闭弹出层
                layer.close(indexAdd)
            }
        })
    })


    let indexEdit = null
    //通过委托的形式来为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn_edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
          }) 

          //为编辑的弹出层填入数据
          let id = $(this).attr('data-id')
          $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
          })
    })
    //通过代理的形式来为修改分类的form表单添加提交事件，完成数据的更新
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新书籍信息失败！')
                }
                layer.msg('更新书籍信息成功！')
                layer.close(indexEdit)
                initArtCateList()

            }
        })
    })
    
    //通过代理的形式来为删除按钮添加点击事件，以此来达到按钮的删除效果
    $('body').on('click', '.btn-delete', function() {
        //获取被点击按钮的id
        let id = $(this).attr('data-id')
        
        

        //弹出提示框
        layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    } 
                    layer.msg('删除分类成功！')
                    //关闭弹出层
                    layer.close(index)
                    //重新获取文章分类列表
                    initArtCateList()
                }
            })
            
            
          });
    })
   
})