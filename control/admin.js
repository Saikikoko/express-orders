const UserSchema = require('../Schema/UserSchema');
const TaskSchema = require('../Schema/TaskSchema');
const {db} = require('../Schema/config');
const User = db.model('users',UserSchema);
const Task = db.model('tasks',TaskSchema);

exports.getUser = (req,res)=>{
    const page = req.body.page;//第几页
    const limit = req.body.limit;//每页显示几条

    Promise.all([
        User.find()
            .skip((page-1)*limit)
            .limit(limit*1)
        ,User.countDocuments()
    ]).then(data=>{
        res.send({
            code: 0,
            data: data[0],
            count: data[1]
        })
    })
}

exports.canuse = (req,res) =>{
    const _id = req.body.user_id;
    const used = req.body.used;
    const session_level = req.session.user.level;

    if( _id === req.session.user._id){
        return res.send({
            code: 1,
            msg: "不能修改自己"
        })
    }
    User.find({_id},(err,data)=>{
        if(data===undefined){
            return res.send({
                code: 1,
                msg: "修改失败"
            })
        }

        console.log(data[0].level);

        if(data[0].level >= 10 && data[0].level < 999 && session_level < 999){
            return res.send({
                code: 1,
                msg: "没有权限"
            })
        }

        if(data[0].level >= 999){
            return res.send({
                code: 1,
                msg: "没有权限"
            })
        }

        User.updateOne({_id},{$set:{used}})
            .exec((err,data)=>{
                if( data ){
                    return res.send({
                        code:0,
                        msg:"修改成功"
                    })
                }else{
                    res.send({
                        code:1,
                        msg:"修改失败"
                    })
                }
            })
    })
}

//删除用户
exports.delete = (req,res)=>{
    const _id = req.body.user_id;
    const session_level = req.session.user.level;
    if(!_id){
        return res.send({
            code: 1,
            msg: "参数错误"
        })
    }
    if( _id === req.session.user._id){
        return res.send({
            code: 1,
            msg: "不能删除自己"
        })
    }
    User.find({_id},(err,data)=>{
        if(data===undefined){
            return res.send({
                code: 1,
                msg: "参数错误"
            })
        }

        if(data[0].level >= 10 && data[0].level < 999 && session_level < 999){
            return res.send({
                code: 1,
                msg: "普通管理员之间不能互相删除"
            })
        }
        if(data[0].level >= 999){
            return res.send({
                code: 1,
                msg: "不能删除超级管理员"
            })
        }

        Promise.all([
                User.deleteOne({_id}),
                Task.deleteMany({author:_id}),//删除用户发布的任务
                Task.updateMany(
                    {'receiver.user':_id},
                    {$pull:{receiver:{user:_id}}
                })//删除任务接取人
            ]
        ).then( data=>{
            if( data ){
                return res.send({
                    code:0,
                    msg:"删除成功"
                })
            }else{
                res.send({
                    code:1,
                    msg:"删除失败"
                })
            }
        })
    })

}

exports.relevel = (req,res)=>{
    const _id = req.body.user_id;
    const level = req.body.level;
    const session_level = req.session.user.level;
    if(!_id){
        return res.send({
            code: 1,
            msg: "参数错误"
        })
    }
    if( _id === req.session.user._id){
        return res.send({
            code: 1,
            msg: "不能修改自己"
        })
    }

    User.find({_id},(err,data)=>{
        if(data===undefined){
            return res.send({
                code: 1,
                msg: "修改失败"
            })
        }

        if(data[0].level >= 10 && data[0].level < 999 && session_level < 999 ){
            return res.send({
                code: 1,
                msg: "权限不足"
            })
        }

        if(data[0].level >= 999){
            return res.send({
                code: 1,
                msg: "不能修改超级管理员"
            })
        }
        User.updateOne({_id},{$set:{level}})
            .exec((err,data)=>{
                if(data===undefined){
                    return res.send({
                        code: 1,
                        msg: "修改失败"
                    })
                }

                res.send({
                    code: 0,
                    msg: "修改成功"
                })
            })
    })
}
















