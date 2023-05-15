let fs = require("fs");
let http = require("http");
let url = require("url");

let userId = "";
let arrClients = [];
let arrUsers = [];
let arrRpsType = [];

let server = http.createServer((req, res) => {
  fs.readFile("index.html", function (error, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

server.listen(8888, function () {
  console.log("run at 8888");
});

let io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket) {
  arrClients.push(socket.id);
  socket.emit(checkUser(arrUsers.length));

  socket.on("regUserId", function (data) {
    socket.userId = data;
    makeUser(socket, data);
    isStart(io, arrUsers);
    arrRpsType = [];
    arrClients = checkOutClient(socket.id);
    if (arrUsers.length >= 2) alertFull();
  });

  socket.on("whoWin", function (data) {
    arrRpsType.push({ id: socket.id, rpsType: data });
    if (arrRpsType.length == 2) {
      io.sockets
        .to(arrRpsType[0].id)
        .emit("isWin", {
          optType: arrRpsType[1].rpsType,
          isWin: isWin(arrRpsType[0].rpsType, arrRpsType[1].rpsType),
        });
      io.sockets
        .to(arrRpsType[1].id)
        .emit("isWin", {
          optType: arrRpsType[0].rpsType,
          isWin: isWin(arrRpsType[1].rpsType, arrRpsType[0].rpsType),
        });
    }
  });

  socket.on("disconnect", function (e) {
    let id = socket.id;
    if (socket.userId) {
      arrUsers = checkOutUser(id);
      alertSpare();
    } else {
      arrClients = checkOutClient(id);
    }
    isStart();
    arrRpsType = [];
  });
});

function isWin(one, two) {
  if (one == two) {
    return 0;
  }
  let temp = one + 1;
  if (temp > 3) temp = 1;
  if (temp == two) return -1;
  return 1;
}

function makeUser(socket, data) {
  if (arrUsers.length == 0) {
    arrUsers.push({ id: socket.id, userId: data, opponent: "" });
  } else {
    arrUsers[0].opponent = data;
    arrUsers.push({
      id: socket.id,
      userId: data,
      opponent: arrUsers[0].userId,
    });
  }
}

function isStart() {
  for (let user of arrUsers) {
    io.sockets.to(user.id).emit("game", { user, length: arrUsers.length });
  }
}

function checkOutUser(id) {
  return arrUsers.filter(function (client) {
    return client.id != id;
  });
}

function checkOutClient(id) {
  return arrClients.filter(function (client) {
    return client != id;
  });
}

function alertFull() {
  for (let client of arrClients) {
    io.sockets.to(client).emit("full");
  }
}

function alertSpare() {
  for (let client of arrClients) {
    io.sockets.to(client).emit("intro");
  }
}

function checkUser(length) {
  if (length < 2) {
    return "intro";
  } else if (length >= 2) {
    return "full";
  }
}
