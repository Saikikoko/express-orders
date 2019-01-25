const TaskSchema = require('../Schema/TaskSchema');
const UserSchema = require('../Schema/UserSchema');
const {db} = require('../Schema/config');
const Task = db.model('tasks',TaskSchema);
const User = db.model('users',UserSchema);

exports.get = (req,res)=>{
    const page = req.body.page;//第几页
    const limit = req.body.limit;//每页显示几条

    Promise.all([
        Task.find()
            .populate('author')
            .skip((page-1)*limit)
            .limit(limit*1)
            .sort({_id: -1})
        ,Task.countDocuments()
    ]).then(data=>{
        res.send({
            code: 0,
            data: data[0],
            count: data[1]
        })
    })
}

exports.getCan = (req,res)=>{
    const page = req.body.page;//第几页
    const limit = req.body.limit;//每页显示几条
    const can= req.body.can;//每页显示几条
    console.log(req.body);
    Promise.all([
        Task.find({can})
            .populate('author')
            .skip((page-1)*limit)
            .limit(limit*1)
            .sort({_id: -1})
        ,Task.countDocuments({can})
    ]).then(data=>{
        res.send({
            code: 0,
            data: data[0],
            count: data[1]
        })
    })
}

exports.myself = (req,res)=>{
    const _id = req.session.user._id;
    const page = req.body.page;//第几页
    const limit = req.body.limit;//每页显示几条
    const path= req.body.path;//关联信息填充位置
    User.findOne({_id})
    .populate({
        path: 'task.'+ path,
        options:{
            skip:(page-1)*limit,
            limit:limit*1,
            sort:{_id: -1}
        },
        populate: { path: 'author' }
    }).then(data=>{
        res.send({
            code: 0,
            data: data.task[path],
            count: data.task[path].length
        })
    })
}

exports.add = (req,res) => {
    const data = req.body;
    data.author = req.session.user._id;

    new Promise((res,rej)=>{
        Task.create(data,(err,data)=>{
            if( err ){
                rej(err)
            }else{
                res(data)
            }
        })
    }).then(data=>{
        User.updateOne(
            {_id:data.author},
            {$push:{'task.publish':data._id}}
        ).then(()=>{
            res.send({
                code:0,
                msg:"发布成功"
            })
        }).catch(()=>{
            res.send({
                code:1,
                msg:"发布失败"
            })
        })
    }).catch(()=>{
        res.send({
            code:1,
            msg:"发布失败"
        })
    })
}

exports.delete = (req,res)=>{
    const _id = req.body.task_id;
    Promise.all([
        Task.deleteOne({_id}),
        User.updateMany(
            {$or:[{'task.publish': _id},{'task.reveive': _id},{'task.accomplish': _id}]},
            {$pull: {'task.publish': _id,'task.receive': _id,'task.accomplish': _id}}
            )
    ]).then(data=>{
        res.send({
            code: 0,
            msg: "删除成功"
        })
    }).catch(err=>{
        res.send({
            code: 1,
            msg: "删除失败"
        })
    })
}

exports.article = (req,res)=>{
    const _id = req.params.id;
    let flag = -1;
    Task.find({_id})
    .populate('author receiver.user')
    .then(data=>{
        if(req.session.user){
            flag = data[0].receiver.findIndex((val)=>{
                return String(val.user._id) === req.session.user._id
            })
        }

        res.render('article',{
            title: '详情-' + data[0].title,
            login: req.session.login,
            user: req.session.user,
            data: data[0],
            flag
        })
    })
    .catch(()=>{
        res.send({code: 1, data: '服务器错误'})
    })
}

exports.receive = (req,res)=>{
    const _id = req.params.id
    //未登录不能接取
    if( !req.session.user ){
        return res.send({
            code: 1,
            msg: "请先登录"
        })
    }

    new Promise((response,reject)=>{
        User
        .find({_id:req.session.user._id})
        .then((data)=>{
            //不能接取自己发布的任务
            let pubBool = data[0].task.publish.findIndex(val=>{
                return String(val) === _id
            })
            if( pubBool !== -1 ){

                return reject({
                    code: 1,
                    msg: "不能接取自己发布的任务"
                })
            }
            //不能重复接取
            let recBool = data[0].task.receive.findIndex(val=>{
                return String(val) === _id
            })
            if( recBool !== -1 ){

                return reject({
                    code: 1,
                    msg: "不能重复接取"
                })
            }

            response()
        })
    }).then(data=>{
        return new Promise((response,reject)=>{
            Task
            .find({_id})
            .then(data=>{
                //接取人数已满不能接取
                if( data[0].receiver.length >= data[0].num ){

                    return reject({
                        code: 1,
                        msg: "接取人数已满"
                    })
                }
                //超过截止日期不能接取
                response();
            })
        })
    }).then(()=>{
        Promise.all([
            Task.updateOne({_id},{$push:{receiver:{user:req.session.user._id}}}),
            User.updateOne({_id:req.session.user._id},{$push:{'task.receive':_id}})
        ]).then(()=>{
            res.send({
                code: 0,
                msg: "接取成功"
            })
        }).catch((err)=>{
            res.send({code: 1, data: '服务器错误'});
        })
    }).catch(err=>{
        res.send(err)
    })

}

//完成任务
exports.acc = (req,res)=>{
    const data = req.body;
    const _id = data.path.slice(6);
    Task.updateOne(
        {_id},
        {$set:
            {
                ['receiver.'+req.body.index+'.finMsg']:req.body.finMsg,
                ['receiver.'+req.body.index+'.isFin']:true
            }
        })
        .then((data)=>{
            res.send({
                code: 0,
                msg: "任务完成"
            })
    })
}
















