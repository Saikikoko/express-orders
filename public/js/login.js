
layui.use('form', function(){
    const form = layui.form;
    const layer = layui.layer;
    const $ = layui.$;

    //监听提交
    form.on('submit(formSubmmit)', function(data){
        $.ajax({
            url: '/login',
            method: 'POST',
            data: {
                username: data.field.username,
                password: data.field.password
            },
            success(data){
                console.log(data);
                layer.alert(data.msg,(index)=>{
                    if( data.code === 0 ){
                        location.href = '/';
                    }
                    layer.close(index)
                });
            }
        });
        return false;
    });

});















