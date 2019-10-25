const express = require("express");
require("./db/mongoose");

const config = require("../config/config");

// routers
const userRouter = require("./routers/router-user");
const taskRouter = require("./routers/router-task");

const app = express();
const port = process.env.PORT || 3000;

// sample middleware
// app.use((req, res, next) => {
//    res.status(503).send(
//       "Site under maintenance. Please come back again some other time."
//    );
// });

// automatically parse request/response object
app.use(express.json());

// user routes from file
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
   console.log("Server is up on port: " + port);
});

// const Task = require("./db/model/Task");
// const User = require("./db/model/User");

// const main = async () => {
//    // const task = await Task.findById("5db348a8f8cda24d08117110");
//    // await task.populate("owner").execPopulate();
//    // console.log(task);

//    const user = await User.findById("5db31a5400dd236c54e75fe5");
//    await user.populate("tasks").execPopulate();
//    console.log(user.tasks);
// };
// main();
