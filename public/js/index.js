//注意：导航 依赖 element 模块，否则无法进行功能性操作
layui.use(['element','table','layer'], function(){
    const element = layui.element;
    const table = layui.table;
    const $ = layui.$;

    const task = {
        all(){
            table.reload('test',{
                url: '/task'
            })
        },
        can(){
            table.reload('test',{
                url: '/task/can'
                ,where: {
                    can: true
                }
            })
        },
        nocan(){
            table.reload('test',{
                url: '/task/nocan'
                ,where: {
                    can: false
                }
            })
        },
        my(){
            table.reload('test',{
                url: '/task/my'
                ,where: {
                    path: 'publish'
                }
            })
        },
        ing(){
            table.reload('test',{
                url: '/task/ing'
                ,where: {
                    path: 'receive'
                }
            })
        },
        finish(){
            table.reload('test',{
                url: '/task/finish'
                ,where: {
                    path: 'accomplish'
                }
            })
        }
    }
    $('.btn-container .layui-btn').on('click',function () {
        task[this.dataset.task]()
    })
    table.render({
        elem: '#test'
        //,skin: 'nob' //行边框风格
        ,url: '/task'
        ,method: 'post'
        ,cols: [[
            {field:'title', title: '标题'},
            {field:'content', title: '内容'},
            {field:'author', title: '发布者',
                templet: function (d) {
                    return d.author.username
                }, unresize: false
            },
            {field:'created', title: '发布时间',
                templet: function (d) {
                    return new Date(d.created).toLocaleString()
                }, unresize: false
            },
            {fixed: 'right', title:'操作', align:'center', width:200, toolbar: '#barDemo'}
        ]]
        ,page: true
    });

    table.on('tool(table)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"

        const data = obj.data; //获得当前行数据
        location.href = '/task/' + data._id;
        // const layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

        // if(layEvent === 'edit'){ //删除
        //     console.log(data)
        //     location.href = '/task/' + data._id
        //     // $.ajax({
        //     //     url: '/task/' + data._id,
        //     //     method: 'get',
        //     //     success(data){
        //     //         data.code === 1 && layer.msg(data.msg)
        //     //         data.code === 0 && obj.del();
        //     //     }
        //     // });
        // }
    });
});
















