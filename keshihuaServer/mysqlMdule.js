// 这是一个我自己封装的mysql数据库操作模块,里边封装了关于mysql数据的代码
// 导入数据库第三方操作模块
var mysql = require("mysql")
// 创建数据库操作信息对象
var options = {
    host: "localhost",      // 本地数据库
    port: "3306",           // 数据库端口
    user: "root",           // 用户名
    password: "181818",       // 密码
    database: "haojing22"    // 目标数据库名
}

// 先尝试连接数据库, 判断数据库是否正常
var db = mysql.createConnection(options)
db.connect(function (err) {
    if (err) console.log("数据库连接失败", err.message)
    else console.log("数据库连接成功")
    db.end()
})


// 封装一个数据库操作函数
function action(sqlStr, callback) {
    // 创建连接对象
    var db = mysql.createConnection(options)
    // 开始连接数据库
    db.connect(function () {
        db.query(sqlStr, function (err, data) {
            if (err) {
                console.log("数据库操作失败,请检查sql语句", err.message)
            } else {
                console.log("数据库操作成功")
                // 如果时查询语句,返回查询结果
                if (sqlStr.startsWith("select")) {
                    // 如果是查询操作, 会得到查询结果data,此时通过返回值的形式把结果返回
                    // console.log("查询结果1", data)
                    // 这里return的值在调用时拿不到, 原因是异步回调函数中不能通过同步return返回结果, 同步代码总是在异步代码之前执行, 所以异步查询结束之前, 同步return就已经执行了undefined,  此时使用回调函数返回结果即可
                    // return data
                    if (callback) callback(data)
                }
            }
            // 操作完成后, 关闭数据库连接
            db.end()
        })
    })
}
// 把封装的操作函数导出
module.exports = action;

