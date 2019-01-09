const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;
const TaskSchema = new Schema({
    title: String,
    content: String,
    author: {type: ObjectId, ref: "users"},
    receiver: {type: [{type: ObjectId, ref: "users"}]},
    num: Number //接取人数限制,

},{
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
});

module.exports = TaskSchema;
















