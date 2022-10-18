$(function() {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        //初始化时间对象
        let dt = new Date(date)
        
//年月日
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
//时分秒
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义一个补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n

    }


    //定义一个查询的参数对象，将来请求数据的时候需要将请求的参数对象提交到服务器
    let q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据,默认显示两条
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态
    }
    initTable()  
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
          method: 'GET',
          url: '/my/article/list',
          data: q,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            //在渲染完表格的数据之后，调用渲染分页的方法,并且传入数据的总条数作为实参
            renderPage(res.total)
          }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // console.log(res)
                // 调用模板引擎
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通知layui，重新渲染表单区域的ui结构
                form.render()
            }
        })
    }


    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        //阻止submit默认的提交行为
        e.preventDefault()
        // 获取到筛选框中的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 将获取到的值赋给数据对象q
        q.cate_id = cate_id
        q.state = state
        // 重新将数据渲染到表格上
        initTable()

    })


    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //存放分页的容器，类名不用加#
            count: total, //数据总数
            limit: q.pagesize, //每页显示的条数，前面设置过
            curr: q.pagenum, //起始页码
            layout:['count','limit' , 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //jump回调，用来获取最新的页码值
            //触发jump回调的方式有两种
            //点击切换页码时
            //只要调用了laypage.render就会触发jump回调
            //由于重新渲染表格的函数中有renderPage方法，而该方法中有重新渲染表格的函数，所以说jump函数就会一直被调用
            jump: function(obj, first) {
                // obj.curr就是最新选中的页码值
                // 将obj.curr赋值给q.pagenum即可
                q.pagenum = obj.curr
                //把最新的条目数，赋值到1这个查询参数对象pagesize属性中
                q.pagesize = obj.limit
                //重新渲染数据并将其填入表格
                // initTable()
                console.log(first)
                //如果是第1种方法，则可以直接调用initTable函数
                if (!first) {
                    initTable()
                }

            }
        })
    }
    //通过代理的形式为文章添加删除功能
    $('tbody').on('click', '.btn-delete', function(){
        //获取页面上剩余的数据个数,通过删除按钮的个数来实现
        let len = $('.btn-delete').length
        //获取要删除书籍的id值
        let id = $(this).attr('data-id')
        //设置弹出层
        layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //本页数据删除完毕之后，还会停留在本页
                    //就会导致可能出现数据空白的情况
                    //所以当数据删除完毕之后
                    //需要进行判断，当前页码数据是否为空
                    //如果当前页码没有数据了，就可以使页码数-1
                    //然后再进行数据的渲染


                    //判断当前页码还剩多少数据
                    if (len === 1 ) {
                        //如果len的值为1，则代表在删除之前还有一个数据，删除之后没有数据，需要使页码减1
                        //注意：页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1


                    }

                    initTable()
                }
            })
            
            layer.close(index);
          })
       
    })



})