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

io.on("connection", (socket) => {
  console.log("SOCKETIO connection EVENT:", socket.id, "client connected");

  socket.on("send", (data) => {
    console.log("데이터 수신(send type is: " + data);
    if (!data) console.log("빈값");

    setTimeout(function () {
      socket.broadcast.emit("echo", data);
    }, 750);
  });

  socket.on("disconnect", () => {
    console.log(
      "SOCKETIO disconnection EVENT:",
      socket.id,
      "client disconnected"
    );
  });

  socket.on("reset", () => {
    io.sockets.emit("reload");
  });
});

/* ------------------------------------------ */

function createUserObj(number, socket) {
  return {
    name: `user${number}`,
    socketId: socket,
    chkSocketId(data) {
      if (data == this.socketId) return true;
    },
  };
}
