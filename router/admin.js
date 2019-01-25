const express = require('express');
const Admin = require('../control/admin');
const Task = require('../control/task');
const admin = express.Router();

admin.use((req,res,next)=>{
    if( req.session.login ){
        if( req.session.level = 1 ){
            return next()
        }
        return res.send("没有权限")
    }
    res.send("没有登录")
});


admin.get('/user',(req,res)=>{
    res.render('admin/user',{
        title: "后台管理中心",
        user: req.session.user
    })
});

admin.get('/task/add',(req,res)=>{
    res.render('admin/addtask',{
        title: "任务发布",
        user: req.session.user
    })
});

admin.get('/task',(req,res)=>{
    res.render('admin/task',{
        title: "任务管理",
        user: req.session.user
    })
});

admin.post('/user',Admin.getUser);//获取用户

admin.post('/user/canuse',Admin.canuse);//用户是否可用

admin.post('/user/del',Admin.delete);//删除用户

admin.post('/user/relevel',Admin.relevel);//更改用户级别

admin.post('/task/add',Task.add);//文章添加

admin.post('/task',Task.get);//文章获取

admin.post('/task/del',Task.delete);//文章删除

module.exports = admin;















