const express = require('express');
const Router = require('./router/router');
const app = express();


//处理post请求
app
    .use(express.json())
    .use(express.urlencoded({extended:true}))


//设置静态资源
app.use(express.static(__dirname + '/public'));

//设置模板引擎
app.set('view engine','ejs');


//配置路由模块
app.use('/',Router);

//监听端口号
app.listen(3000,()=>{
    console.log("3000端口启动成功")
});















