const express = require("express");
const app = express();
var path = require("path");

app.get("/", function(req, res) {
  console.log(req.params);
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;