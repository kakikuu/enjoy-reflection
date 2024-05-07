let createError = require("http-errors");
let express = require("express");
const cors = require("cors");
let path = require("path");
let logger = require("morgan");
let indexRouter = require("./routes/index.ts");
let usersRouter = require("./routes/users.ts");
let projectsRouter = require("./routes/projects.ts");
let personalReflectionsRouter = require("./routes/personal_reflections.ts");
let conferenceRecordsRouter = require("./routes/conference_records.ts");
let questionsRouter = require("./routes/questions.ts");
let answersRouter = require("./routes/answers.ts");
// let testRouter = require("./routes/test.ts");

const dotenv = require("dotenv");

dotenv.config();
let app = express();
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use("/users/:user_clerk_id/projects", projectsRouter);

app.use(
  "/users/:user_clerk_id/projects/:project_id/personal-reflections",
  personalReflectionsRouter
);

app.use(
  "/users/:user_clerk_id/projects/:project_id/conference-records/:conference_id/questions/:question_id/answers",
  answersRouter
);

app.use(
  "/users/:user_clerk_id/projects/:project_id/conference-records/:conference_id/questions",
  questionsRouter
);

app.use(
  "/users/:user_clerk_id/projects/:project_id/conference-records",
  conferenceRecordsRouter
);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error"); // エラーが発生した際にエラービューをレンダリングする
});

module.exports = app;
