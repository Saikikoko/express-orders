layui.use(['element','table','layer'], function(){
    const element = layui.element;
    const table = layui.table;
    const layer = layui.layer;
    const form = layui.form;
    const $ = layui.$;

    table.render({
        elem: '#test'
        ,url: '/admin/task'
        ,method: 'post'
        ,cols: [[
            {field:'title', title: '标题'},
            {field:'content', title: '内容'},
            {field:'author', title: '发布者',
                templet: function (d) {
                    console.log(d);
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
        const layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

        if(layEvent === 'del'){ //删除
            layer.confirm('确定删除该文章',{icon: 3, title:'提示'}, function(index){

                layer.close(index);
                //向服务端发送删除指令
                $.ajax({
                    url: '/admin/task/del',
                    method: 'POST',
                    data: {
                        task_id: data._id
                    },
                    success(data){
                        if(data.code === 0){
                            obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        }

                    }
                });
            });
        } else if(layEvent === 'edit'){ //编辑
            //do something
            layer.prompt({
                formType: 0,
                title: '请输入值'
            }, function(value, index, elem){
                //同步更新缓存对应的值
                location.href = '/admin/task/modify'
                layer.close(index);
            });
        }
    });
});
















