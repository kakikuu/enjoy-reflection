let createError = require("http-errors");
let express = require("express");
let path = require("path");
let logger = require("morgan");
let indexRouter = require("./routes/index.ts");
let usersRouter = require("./routes/users.ts");
let projectsRouter = require("./routes/projects.ts");

const dotenv = require("dotenv");

dotenv.config();
let app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/users/:user_id/projects", projectsRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error"); // エラーが発生した際にエラービューをレンダリングする
});

module.exports = app;
