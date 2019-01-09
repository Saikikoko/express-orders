const UserSchema = require('../Schema/UserSchema');
const {db} = require('../Schema/config');
//引入加密模块
const encrypt = require('../until/encrypt');

const User = db.model('users',UserSchema);


//用户注册
exports.reg = async (req,res)=>{
    //查找数据库有没有该用户
    const username = req.body.username;
    const password = req.body.password;
    //和数据库的数据作比对

    await new Promise((res,rej) => {
        User.find({username},(err,data) => {
            if(err)return rej(err);
            if(data.length !==0){
                //有数据，返回空字符串
                return res("");
            }
            //用户名不存在，需要保存到数据库
            const _user = new User({
                username,
                password: encrypt(password),
            })

            _user.save((err,data) => {
                if(err){
                    rej(err)
                }else{
                    res(data)
                }
            })
        })
    })
    .then(data => {
        if(data){
            res.send({
                code: 1,
                msg: "注册成功"
            })
        }else{
            res.send({
                code: 2,
                msg: "用户已存在"
            })
        }
    })
    .catch(err => {
        res.send({
            code: 3,
            msg: "服务器错误" + err
        })
    })
}
















