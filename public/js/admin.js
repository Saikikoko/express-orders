layui.use(['element','table','layer'], function(){
    const element = layui.element;
    const table = layui.table;
    const layer = layui.layer;
    const form = layui.form;
    const $ = layui.$;

    table.render({
        elem: '#test'
        ,url: '/admin/user'
        ,method: 'post'
        ,cols: [[
            {field:'username', width:80, title: '用户名'},
            {field:'used', title:'账号是否可用', width:120,
                templet: function (d) {
                    return `<input type="checkbox" name="used" value="${d._id}" lay-skin="switch" lay-text="可用|不可用" lay-filter="usedDemo" ${d.used ? 'checked' : ''}>`
                }, unresize: false
            },
            {field:'level', width:90, title: '用户级别'},
            {fixed: 'right', title:'操作', align:'center', width:200, toolbar: '#barDemo'}
        ]]
        ,page: true
    });

    //监听
    form.on('switch(usedDemo)', function(obj){
        $.ajax({
            url: '/admin/user/canuse',
            method: 'POST',
            data: {
                user_id: this.value,
                used: obj.elem.checked
            },
            success(data){
                data.code === 0 && layer.tips(data.msg,obj.othis);
                data.code === 1 && layer.msg(data.msg,{
                    time: 1000 //
                },()=>{
                    table.reload('test',{
                        url: '/admin/user'
                    })
                })

            }
        });
    });

    table.on('tool(table)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"

        const data = obj.data; //获得当前行数据
        const layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

        if(layEvent === 'del'){ //删除
            layer.confirm('确定删除该用户',{icon: 3, title:'提示'}, function(index){

                layer.close(index);
                //向服务端发送删除指令
                $.ajax({
                    url: '/admin/user/del',
                    method: 'POST',
                    data: {
                        user_id: data._id
                    },
                    success(data){
                        data.code === 1 && layer.msg(data.msg)
                        data.code === 0 && obj.del();
                    }
                });
            });
        } else if(layEvent === 'edit'){ //编辑
            //do something
            layer.prompt({
                formType: 0,
                title: '请输入数值'
            }, function(value, index, elem){
                if(isNaN(value)){
                    layer.msg("请输入数字",{icon: 5});
                    return false;
                }
                //同步更新缓存对应的值
                $.ajax({
                    url: '/admin/user/relevel',
                    method: 'POST',
                    data: {
                        user_id: data._id,
                        level: value
                    },
                    success(data){
                        console.log(data);
                        data.code === 0 && layer.alert(data.msg,(index)=>{
                            table.reload('test',{
                                url: '/admin/user'
                            })
                            layer.close(index);
                        });
                        data.code === 1 && layer.msg(data.msg)
                    }
                });
                layer.close(index);
            });
        }
    });
});
















