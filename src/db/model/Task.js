const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
   // TODO: link tasks to user
   owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
   },
   description: {
      type: String,
      required: true
   },
   completed: {
      type: Boolean,
      trim: true,
      default: false
   }
});

module.exports = Task = mongoose.model("Task", TaskSchema);
