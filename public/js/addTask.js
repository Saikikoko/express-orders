layui.use(['element', 'layer', 'rate', 'layedit', 'laydate'], function(){
    const element = layui.element;
    const form = layui.form;
    const layer = layui.layer;
    const rate = layui.rate;
    const layedit = layui.layedit;
    const laydate = layui.laydate;
    const $ = layui.$;

    //日期
    laydate.render({
        elem: '#date'
    });
    let diff;
    //评分
    rate.render({
        elem: '#diff'
        ,choose: function(value){
            diff = value;
        }
    })

    //创建一个编辑器
    const edit = layedit.build('demo',{
        uploadImage: {url:'/api/upload',type:'post'}
    }); //建立编辑器
   // const editIndex = layedit.build('LAY_demo_editor');


    //监听
    form.on('submit(formDemo)', function(obj){

        let data = obj.field;
        data.diff = diff;
        data.content = layedit.getContent(edit);
        console.log(data);
        $.ajax({
            url: '/admin/task/add',
            method: 'POST',
            data,
            success(data){
                data.code === 0 && layer.msg(data.msg, {
                    icon: 6,
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                }, function(){
                    window.location.reload();
                });
                data.code === 1 && layer.msg(data.msg, {icon: 5});

            }
        });
        return false;
    });


});
















