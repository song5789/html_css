const express = require("express");
let socketio = require("socket.io");

const app = express();
app.use(express.static("public"));

let server = app
  .get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  })
  .listen(8888, () => {
    console.log("now server is running...");
  });

let io = socketio.listen(server);

let arr = [];

io.on("connection", (socket) => {
  console.log("SOCKETIO connection EVENT:", socket.id, "client connected");

  socket.on("send", (data) => {
    socket.rpsType = data;
    arr.push(socket.rpsType, socket.id);
    console.dir(arr);

    // console.log("데이터 수신(send type is: " + data);
    if (arr[0] && arr[2]) {
      let myCompareResult = rpsBattle(arr[0], arr[2]);
      let rivalCompareResult = rpsBattle(arr[2], arr[0]);
      let myResultObj = {
        type: arr[2],
        compare: myCompareResult,
      };

      let rivalResultObj = {
        type: arr[0],
        compare: rivalCompareResult,
      };
      socket.broadcast.emit("myResult", myResultObj);
      io.to(arr[3]).emit("rivalResult", rivalResultObj);
      arr = [];
    } else {
      io.sockets.emit("holdInput");
    }
  });

  socket.on("disconnect", () => {
    console.log("SOCKETIO disconnection EVENT:", socket.id, "client disconnected");
  });

  socket.on("reset", () => {
    io.sockets.emit("reload");
  });
});

function rpsBattle(user1, user2) {
  if (user1 == user2) {
    return "무";
  } else if (user2 - user1 == 1 || user2 - user1 == -2) {
    return "패";
  } else {
    return "승리";
  }
}
