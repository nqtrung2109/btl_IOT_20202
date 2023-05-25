// var socket= io("https://iotchatapp.herokuapp.com/");
var socket= io("http://localhost:3000");
socket.on("server-send-dkthatbai", function(){
  alert("Đăng ký thất bại - Tên đăng nhập đã có người dùng!!!");
});

socket.on("server-send-dsUser", function(data){
  $("#boxContent").html("");
  data.forEach(function(i){
    $("#boxContent").append("<div class='user'>" + i + "</div>");
  })    
});

socket.on("server-send-dkthanhcong", function(data){
  alert("Đăng ký thành công!!!");
  $("#currentUser").html(data);
  $("#loginForm").hide(1000);
  $("#chatForm").show(2000);
});

socket.on("server-send-mess", function(data){
  $("#listMess").append(data);
})

socket.on("ai-do-dang-go-chu", function(data){
  $("#thongbao").html(data);
})
socket.on("ai-do-da-dung-go", function(){
  $("#thongbao").html("");
})

$(document).ready(function(){
  $("#loginForm").show();
  $("#chatForm").hide();

  $("#btnRegister").click(function(){
    socket.emit("client-send-Username", $("#txtUsername").val());
    return false;
  });
  $("#btnLogout").click(function(){
    socket.emit("logout");
    $("#chatForm").hide(1000);
    $("#loginForm").show(2000);
  })
  //$("#btnSendMess").click(function(){
  //  socket.emit("user-send-mess", $("#txtMess").val());
  //})
  $("#btnSendMess").click(function(){
    if ($("#txtMess").val() !== ''){
    socket.emit("user-send-mess", $("#txtMess").val());
    $("#txtMess").val('');
    }
    return false;
  });

  $("#txtMess").focusin(function(){
    socket.emit("toi-dang-go-chu");
  })
  $("#txtMess").focusout(function(){
    socket.emit("toi-da-go-xong");
  })
});
