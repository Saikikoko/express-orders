const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;
const UserSchema = new Schema({
    username: String,
    password: String,
    role: {type: Boolean, default: false},//账号权限，是否可用
    task: {
        //发布的任务
        publish: {type: [{type: ObjectId, ref: 'tasks'}]},
        //已经接取的任务
        receiver: {type: [{type: ObjectId, ref: 'tasks'}]},
        //已经完成的任务
        accomplish: {type: [{type: ObjectId, ref: 'tasks'}]}
    }

},{
    versionKey: false
});


module.exports = UserSchema;













