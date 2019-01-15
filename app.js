const express=require("express"),     //http请求
     mongoose=require("mongoose"),   //mongo数据库
     app=express(),        //http请求
     session=require("express-session"),  //session
     MongoSession=require("connect-mongo")(session);  //session



app.listen(8000)
//链接数据库
mongoose.connect("mongodb://localhost/shizhan",{useNewUrlParser:true});

// 使用方式  req.session.xxx = xxx
app.use(session({
    secret: 'adada', // 密钥
    rolling: true, // 每次操作(刷新页面  点击a标签  ajax) 重新设定时间
    resave: false, // 是否每次请求都重新保存数据
    saveUninitialized: false, // 初始值
    cookie: {maxAge: 1000 * 60 * 60},
    store: new MongoSession({
      url: 'mongodb://localhost/shizhan'
    })
  }));

//获取post数据
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//静态资源
app.use(express.static(__dirname+"/public"));
//设置模版引擎
app.set("view engine","ejs");


//路由
app.use("/",require("./router/index.js"));

app.use("/admin",require("./router/admin.js"));
