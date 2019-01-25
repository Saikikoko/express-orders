const express = require('express');
const router = express.Router();
const multer = require('multer');
const {join} = require('path');

const storage = multer.diskStorage({
    destination: join(__dirname,'../public/upload'),
    filename: function (req, file, cb) {
        const f = file.originalname.split('.');
        const exit = f[f.length - 1];
        const filename = `image${Date.now()}.${exit}`;
        cb(null, filename);
    }
})

const upload = multer({ storage}).single('file');

router.post('/upload',(req,res)=>{
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.send({code:1})
        } else if (err) {
            // 发生错误
            return res.send({code:1})
        }
        console.log(req.file);
        res.send({
            code:0,
            data:{
                src: `/upload/${req.file.filename}`
            }})
        // 一切都好
    })
})


module.exports = router;
















