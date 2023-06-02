let fs = require("fs");
let ejs = require("ejs");
let mysql = require("mysql");
let express = require("express");
let bodyParser = require("body-parser");

let dbcon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "world",
});

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(8888, function () {
  console.log("run at 8888");
});

app.get("/_querytest", function (request, response) {
  fs.readFile("db_tester.html", "utf8", function (error, data) {
    response.send(
      ejs.render(data, {
        code: -1,
        query: "",
        error: null,
        result: null,
      })
    );
  });
});

app.post("/_querytest", function (request, response) {
  let { query } = request.body;
  fs.readFile("db_tester.html", "utf8", function (error, data) {
    dbcon.query(query, function (error, result) {
      if (error)
        response.send(
          ejs.render(data, {
            code: 0,
            query,
            error,
            result: null,
          })
        );
      else
        response.send(
          ejs.render(data, {
            code: 1,
            query,
            error: null,
            result,
          })
        );
    });
  });
});
