const express = require("express"),
    router = express.Router(),
    path = require('path'),
    multer = require("multer");

const storage = multer.diskStorage({
    // 1. __dirname 当前文件所在的目录
    // 2. process.cwd() node工作目录
    destination: path.join(process.cwd(), "public/upload"),
    filename: (req, file, callback) => {
        const hz = file.originalname.split("."); //上传的名字
        const filename = `${Date.now()}.${hz[hz.length-1]}`; //时间+后缀名
        callback(null, filename);
    }
})

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg') {
        callback(null, true)
     }//else {
    //     callback(null, false)
    // }
}
const upload = multer({
    storage,
    fileFilter
});

router.post("/upload", (req, res) => {

    upload.single('file')(req, res, err => {
        if (err) {
            return res.send({
                code: 1
            });
        }
        res.send({
            code: 0,
            data: {
                src: `/upload/${req.file.filename}`
            }
        })
    })
})

module.exports = router;