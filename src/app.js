const express = require("express");
require("./db/mongoose");

// routers
const userRouter = require("./routers/router-user");
const taskRouter = require("./routers/router-task");

const app = express();

// automatically parse request/response object
app.use(express.json());

// TODO: implement this in the future
// passport middleware
const passport = require("passport");
app.use(passport.initialize());
// load passport config
require("../config/passport.js")(passport);

// user routes from file
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
