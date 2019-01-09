const express = require('express');
const User = require('../control/user');
const router = express.Router();
//注册登录界面
router.get('/reg',(req,res)=>{
    res.render('reg')
})

//保存登录信息
router.post('/reg',User.reg);

module.exports = router;














