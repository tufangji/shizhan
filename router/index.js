const express=require("express"),
    {user}=require("../model/sch"),
    crypto=require("crypto"),
    router=express.Router();
/*
0 成功
1 失败
2 网络错误

*/

//注册
router.get("/reg",(req,res)=>{  
    res.render("reg");
}).post("/reg",(req,res)=>{
    //res.send(req.body);
    let {username,password}=req.body;
    user.findOne({username:username}).then(data=>{
        if(data){   //有相同用户名
            return res.send({code:1,msg:"有相同用户名"})
        }
        const pwd = crypto.createHmac('sha256',"abcdefg")  //密码加密
                .update(password)
                .digest('hex');
        user.create({               //创建一条新的数据
            username:username,
            password:pwd
        }).then(data=>{
            req.session.login=true;   //创建session
            req.session.user=data;
            res.send({code:0,msg:"注册成功"})
        })
    })
})

//登陆
router.get("/login",(req,res)=>{
    res.render("login",{
        login:req.session.login    //登陆时把session传过去
    });
}).post("/login",(req,res)=>{
    let {username,password}=req.body;
    user.findOne({username:username}).then(data=>{
        if(data){  //有该用户名的数据
            const pwd = crypto.createHmac('sha256',"abcdefg")  //密码加密
                .update(password)
                .digest('hex');
            if(data.password===pwd) {  
                req.session.login=true;   //创建session
                req.session.user=data;
                return res.send({code:0,msg:"登陆成功！"});
            }
            return res.send({code:1,msg:"密码不正确！"});
        }
        res.send({code:1,msg:"用户名不正确！"});
    })
})

//主页
router.get("/",(req,res)=>{
    res.render("index",{
        login:req.session.login,
        user:req.session.user
    })
})

//退出
router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/");
})
module.exports=router;