const mongoose = require("mongoose");
const config = require("../../config/config");

const mongoURL =
   "mongodb://" +
   config.dbUsername +
   ":" +
   config.dbPassword +
   "@ds229088.mlab.com:29088/task-manager-api";

mongoose.connect(mongoURL, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false
});
