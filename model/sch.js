const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {   //用户名
        type: String,
        required: true
    },
    password: {  //密码
        type: String,
        required: true
    },  
    used: {     //账号是否可用
        type:Boolean,
        required:true,
        default:false
    },
    level:{      //用户级别
        type:Number,
        required:true,
        default:1
    },
    task:{       //任务
        publish:{type:[{type:mongoose.Schema.Types.ObjectId,ref:"task"}]},  //发布的任务
        receive:{type:[{type:mongoose.Schema.Types.ObjectId,ref:"task"}]},  //接受的任务
        accomplish:{type:[{type:mongoose.Schema.Types.ObjectId,ref:"task"}]} //完成的任务
    }
});



const taskSchema=new mongoose.Schema({
    title:{type:String},//标题
    content:{type:String},//内容
    author:{type:String},//作者
    receiver:{type:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}]},  //接受者
    time:{type:String},         //发布时间
    num:{type:Number}           //接受者上限
});


const user=mongoose.model("user",userSchema);
const task=mongoose.model("task",taskSchema);

module.exports={
    user,
    task
}