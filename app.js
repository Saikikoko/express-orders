const express = require('express');
const Router = require('./router/user');
const Admin = require('./router/admin');
const Api = require('./router/api');
const session = require('express-session');
const Mongosession = require('connect-mongo')(session);
const app = express();


//处理post请求
app
    .use(express.json())
    .use(express.urlencoded({extended:true}))


//设置静态资源
app.use(express.static(__dirname + '/public'));

//设置模板引擎
app.set('view engine','ejs');

app.use(session({
    secret: "puciciliu",
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 36e5
    },
    store: new Mongosession({
        url: 'mongodb://localhost:27017/projecct'
    })
}))

//配置路由模块
app.use('/',Router);
app.use('/admin',Admin);
app.use('/api',Api);

//监听端口号
app.listen(3000,()=>{
    console.log("3000端口启动成功")
});















