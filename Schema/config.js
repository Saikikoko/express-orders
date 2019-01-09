const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const db = mongoose.createConnection('mongodb://localhost:27017/projecct',
    {useNewUrlParser: true});

//使用原生ES6的promise代替mongoose的promise
mongoose.Promise = global.Promise;


db.on('error',console.error.bind(console,"connection error:"));

db.once('open',()=>{
    console.log("数据库连接成功")
});

module.exports = {
    Schema,
    db
}















