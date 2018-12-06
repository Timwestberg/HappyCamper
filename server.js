const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
console.log(PORT);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//const exphbs = require("express-handlebars");
// app.engine(
//   "handlebars",
//   exphbs({
//     defaultLayout: "main"
//   })
// );
// app.set("view engine", "handlebars");

const htmlRoutes = require("./routes/htmlRoutes");
app.use(htmlRoutes);

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});

module.exports = app;