const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;
const TaskSchema = new Schema({
    title: String,
    content: String,
    author: {type: ObjectId, ref: "users"},//发布人
    receiver: {type: [{
        user: {type: ObjectId, ref: "users"},
        finMsg: {type: String},
        isFin: {type: Boolean, default: false}
        },
    ]},//接取人
    num: Number, //接取人数限制,
    date: Date, //截止日期
    reward: String,//奖励
    diff: String,//难度
    can: {type: Boolean, required:true, default: true}//任务是否可接取
},{
    versionKey: false,
    timestamps: {
        createdAt: "created"//发布时间
    }
});

module.exports = TaskSchema;
















