const express = require("express");
require("./db/mongoose");

const config = require("../config/config");

// routers
const userRouter = require("./routers/router-user");
const taskRouter = require("./routers/router-task");

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
   console.log("Server is up on port: " + port);
});
