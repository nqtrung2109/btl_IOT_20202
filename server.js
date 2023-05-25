var express = require("express");// require module express vào project. Trong Node, khi muốn sử dụng một module, bạn sẽ phải dùng hàm require() với tham số là tên module
var app = express();// Khởi tạo một app mới sử dụng module express
app.use(express.static("public"));//Thư mục public sẽ là nơi chứa toàn bộ các file tĩnh.
app.set("view engine","ejs"); // su dung ejs lam view engine
app.set("views","./views");   // trong thu muc client

var server = require("http").Server(app);  // khoi tao server
var io = require("socket.io")(server);    // goi bien io với thư viện socket ra dung
server.listen(process.env.PORT ||3000);  // tao dia chi cho server localhost

var moment = require('moment');
// giao tiep vs client
var mangUser = [];

io.on("connection", function(socket){
    console.log("Co nguoi vua ket noi: " + socket.id)
    socket.on("client-send-Username", function(data){
        if(mangUser.indexOf(data)>=0){
            socket.emit("server-send-dkthatbai")
        } else{
            mangUser.push(data);
            socket.Username = data;
            io.sockets.emit("server-send-dsUser", mangUser);
            var txt="Hello "+data
            socket.emit("server-send-dkthanhcong", txt);
            var time=moment().format('hh:mm a').toString();
            var txt="";
            txt+= "<div class='notify'> <strong> Chat Bot </strong>"
            txt+= "<span style='text-transform: uppercase'>"+time+"</span><br/>";
            txt+= socket.Username+" đã đăng nhập" + "</div>" ;
            io.emit("server-send-mess", txt);
        }
    });
    socket.on("logout", function(){
        var time=moment().format('hh:mm a').toString();
        var txt="";
        txt+= "<div class='notify'> <strong> Chat Bot </strong>"
        txt+= "<span style='text-transform: uppercase'>"+time+"</span><br/>";
        txt+= socket.Username+" đã rời phòng" + "</div>" ;
        io.emit("server-send-mess", txt);
        mangUser.splice(
            mangUser.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("server-send-dsUser", mangUser);
        console.log("Co nguoi vua ngat ket noi: " + socket.id)
    })
     socket.on("disconnect", function(){
        if (mangUser.indexOf(socket.Username)>=0){
            mangUser.splice(mangUser.indexOf(socket.Username), 1);
        }
       socket.broadcast.emit("server-send-dsUser", mangUser);
       console.log("Co nguoi vua ngat ket noi: " + socket.id)
     })
    socket.on("user-send-mess", function(data){
        var time=moment().format('hh:mm a').toString();
        var txt="";
        txt+= "<div class='mess'>";
        txt+= "<strong>" +socket.Username +" </strong>"
        txt+= "<span style='text-transform: uppercase'>"+time+"</span><br/>";
        txt+= data + "</div>" ;
        socket.broadcast.emit("server-send-mess", txt);
    
        txt="";
        txt+= "<div class='idmess'>";
        txt+= "<strong>You </strong>"
        txt+= "<span style='text-transform: uppercase'>"+time+"</span><br/>";
        txt+= data + "</div>" ;
        socket.emit("server-send-mess", txt);
    });
    socket.on("toi-dang-go-chu", function(){
        var s = socket.Username + " đang gõ chữ";
        socket.broadcast.emit("ai-do-dang-go-chu", s);
    })
    socket.on("toi-da-go-xong", function(){
        socket.broadcast.emit("ai-do-da-dung-go",);
    })
});

app.get("/", function(req, res){
    res.render("trangchu");
})

//css giup dinh dang trang web, cung cap bo cuc, front chu, mau sac cho cac phan tu html