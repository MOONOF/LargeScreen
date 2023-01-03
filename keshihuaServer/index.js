var express = require("express")
var MyDBAction = require("./mysqlMdule")
var fs = require("fs")
var app = express();
app.use(express.static("public"))
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
var art = require("express-art-template")
app.engine("html", art)
app.listen(5000, function () {
  console.log("已启动服务器，请访问5000端口");
})

// 主页接口
app.get("/", function (req, res) {
  console.log("访问主页");
  res.render("index.html", {})
})

// 登录接口
app.get("/login", function (req, res) {
  console.log(req.query);
  if (!req.query.username || !req.query.password) {
    res.json({ msg: "账号或密码不能为空" })
    return;  //响应后不会结束函数，可使用return结束
  }
  MyDBAction(`select * from users where username='${req.query.username}' and password='${req.query.password}'`, function (data) {
    if (data.length == 0) {
      res.json({ msg: "账号或密码错误", code: 0 })
    } else {
      res.json({ msg: "登录成功", code: 1 })
    }
  })
})

//大屏可视化系统接口
//获取确诊治愈率
app.get("/getDefinite", function (req, res) {
  MyDBAction(`select * from sjfx`, function (data) {
    res.json({ code: 1, msg: data })
  })
})

//获取确诊治愈
app.get("/getDiePeople", function (req, res) {
  MyDBAction(`select * from people`, function (data) {
    res.json({ code: 1, msg: data })
  })
})


//get请求的注册
// 注册接口
app.get("/register2", function (req, res) {
  console.log(req.query)
  if (!req.query.username || !req.query.password) {
    res.json({ msg: "账号或密码不能为空" })
    return;  //响应后不会结束函数，可使用return结束
  }
  //1, 判断账号是否存在 
  MyDBAction(`select * from users where username="${req.query.username}"`, function (data) {
    if (data.length == 0) {
      // 2, 把这个账号信息写入数据库
      MyDBAction(`insert into users (username,password,sex,age) values ("${req.query.username}","${req.query.password}","男", ${req.query.age || 0})`)
      res.json({ msg: "注册成功", code: 1 })
    } else {
      res.json({ msg: "用户名已存在,注册失败", code: 0 })
    }
  })
})



