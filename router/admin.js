const express = require("express"),
    {
        user,
        task
    } = require('../model/sch'),
    router = express.Router(),
    crypto = require("crypto");

router.use((req, res, next) => {
    if (req.session.login) { //判断是否登陆
        if (req.session.user.level >= 10) { //判断是否有权限
            return next();
        }
        return res.send("您没有权限！");
    }
    res.send("没有登陆！");
})

router.get("/user", (req, res) => {
    res.render("admin/user", {
        title: '用户管理',
        user: req.session.user
    })
}).post('/user', (req, res) => {
    Promise.all([
        //第一页是 （1-1）*10  9 第二页 （2-1）*10  19
        //(当前页数-1)*每页显示条数
        user.find().skip((req.body.page - 1) * req.body.limit).limit(Number(req.body.limit)),
        user.countDocuments() //总条数
    ]).then(data => {
        // console.log(data);
        res.send({
            code: 0,
            data: data[0],
            count: data[1]
        })
    })
})

router.post('/user/reused', (req, res) => {
    // console.log(req.body);
    // console.log(typeof Boolean(req.body.used));
    user.updateOne({
            _id: req.body._id
        }, {
            $set: {
                used: req.body.used
            }
        })
        .then(data => {
            res.send({
                code: 0,
                data: "修改成功"
            });
        }).catch(err => {
            res.send({
                code: 1,
                data: "修改失败"
            });
        })
})

router.post('/user/del', (req, res) => { //删除用户
    //todo 关联的文章和任务删除
    Promise.all([
        user.deleteOne({
            _id: req.body._id
        }),
        task.deleteMany({
            author: req.body._id
        }),
        task.updateMany({
            receiver: req.body._id
        }, {
            $pull: {
                receiver: req.body._id
            }
        })
    ]).then(data => {
        res.send({
            code: 0,
            msg: "删除成功"
        })
    }).catch(err => {
        res.send({
            code: 1,
            msg: "删除失败"
        });
    })
})

router.post('/user/relevel', (req, res) => { //更改级别
    user.updateOne({
        _id: req.body._id
    }, {
        $set: {
            level: req.body.level
        }
    }).then(data => {
        res.send({
            code: 0,
            msg: "修改成功"
        })
    }).catch(err => {
        res.send({
            code: 1,
            msg: "修改失败"
        })
    })
})

router.get('/task/add', (req, res) => {
    res.render('admin/addtask', {
        title: "发布",
        user: req.session.user
    })
}).post('/task/add', (req, res) => {
    let data = req.body;
    data.author = req.session.user._id;
    task.create(data, (err, data) => {
        if (err) {
            return res.send({
                code: 1,
                msg: "保存失败"
            })
        }
        user.updateOne({
            _id: req.session.user._id
        }, {
            $push: {
                'task.publish': data._id
            }
        }).catch(err => {
            console.log(err);
        })
        res.send({
            code: 0,
            msg: "保存成功"
        })
    })
})

router.get('/task/mytask', (req, res) => {
    res.render("admin/mytask", {
        user: req.session.user,
        title: "任务管理"
    })
}).post('/task/mytask', (req, res) => {
    Promise.all([
        task.find({
            author: req.session.user._id
        }).populate('author').skip((req.body.page - 1) * req.body.limit).limit(Number(req.body.limit)),
        task.countDocuments({
            author: req.session.user._id
        })
    ]).then(data => {
        //console.log(data)
        res.send({
            code: 0,
            data: data[0],
            count: data[1]
        })
    })
})

router.post('/task/del', (req, res) => {
    task.deleteOne({
        _id: req.body._id
    }).then(data => {
        res.send({
            code: 0,
            msg: '删除成功'
        })
    }).catch(err => {
        res.send({
            code: 1,
            msg: "删除失败"
        })
    })
})

// router.post("/task/edit",(req,res)=>{
//     console.log(req.body._id);
//     task.findOne({_id:req.body._id}).then(data=>{
//         console.log(data);
//         res.send(JSON.stringify(data));
//     }).catch(err=>{
//         console.log(err);
//     })

// })


module.exports = router;