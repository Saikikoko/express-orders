
layui.use('form', function(){
    const form = layui.form;
    const $ = layui.$;

    let $password = $("input[name=password]");
    let $password2 = $("input[name=confirmPwd]");

    $password2.on("blur", function(){
        const pwd = $password.val();
        const val = $(this).val();

        if( val && val !== pwd){
            layer.msg("两次密码不一致");
            // $(this).val("");
        }

    })
    // layui.form.verify({
    //     pass: [
    //         /^[\S]{6,12}$/
    //         ,'密码必须6到12位，且不能出现空格'
    //     ]
    // })
    //监听提交
    form.on('submit(formSubmmit)', function(data){
        const pwd = $password.val();
        const val = $password2.val();

        if( val && val !== pwd){
            layer.msg("两次密码不一致");
            console.log(1);
            return false;
        }

        $.ajax({
            url: '/reg',
            method: 'POST',
            data: {
                username: data.field.username,
                password: data.field.password
            },
            success(data){

                layer.alert(data.msg,()=>{
                    console.log(data);
                    if(data.code === 0){
                        location.href = '/login'
                    }else{
                        location.href = '/reg'
                    }
                })

            }
        });
        return false;
    });
    return false;
});
















