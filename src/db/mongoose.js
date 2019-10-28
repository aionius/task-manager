const mongoose = require("mongoose");

const mongoURL =
   "mongodb://" +
   process.env.MLAB_DB_USERNAME +
   ":" +
   process.env.MLAB_DB_PASSWORD +
   process.env.MLAB_URL;

mongoose.connect(mongoURL, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   useUnifiedTopology: true
});
