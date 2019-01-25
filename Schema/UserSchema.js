const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;
const UserSchema = new Schema({
    username: String,
    password: String,
    used: {type: Boolean, required: true, default: true},//账号权限，是否可用
    level: {type: Number, required: true, default: 1},//用户级别
    task: {
        //发布的任务e
        publish: {type: [{type: ObjectId, ref: 'tasks'}]},
        //已经接取的任务
        receive: {type: [{type: ObjectId, ref: 'tasks'}]},
        //已经完成的任务
        accomplish: {type: [{type: ObjectId, ref: 'tasks'}]}
    }

},{
    versionKey: false
});


module.exports = UserSchema;













