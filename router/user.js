const express = require('express');
const User = require('../control/user');
const Task = require('../control/task');
const user = express.Router();

//首页
user.get('/',(req, res)=>{
    res.render('index',{
        title: "首页",
        login: req.session.login,
        user: req.session.user
    })
})

//注册登录界面
user.get(/^\/(reg|login)$/,(req, res)=>{
    const show = /reg$/.test(req.path);
    res.render('reg',{
        title: show? '登录' : '注册',
        show,
        login: req.session.login
    })
});

//退出登录
user.get('/logout',(req, res)=>{
    req.session.destroy();
    res.redirect('/login');
});

//文章详情
user.get('/task/:id',Task.article)
//保存注册信息
user.post('/reg',User.reg);

//登录
user.post('/login',User.login);

//首页任务数据
user.post('/task',Task.get);//文章获取

//可以接取的任务
//user.post('/task/can',Task.getCan);//文章获取

user.post(/^\/task\/(can|nocan)$/,Task.getCan);//文章获取

user.post(/^\/task\/(my|ing|finish)$/,Task.myself);//文章获取

//任务接取
user.post('/task/:id',Task.receive);

// //完成任务
user.post('/task/xq/acc',Task.acc);

module.exports = user;














