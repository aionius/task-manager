require("../src/db/mongoose");

const Task = require("../src/db/model/Task");

// Task.findByIdAndRemove("5db07569c9a345279c9b2679")
//    .then(result => {
//       console.log(result);
//       return Task.find({ completed: true });
//    })
//    .then(completed => {
//       console.log(completed);
//    })
//    .catch(err => console.log);

const deleteTaskAndCount = async taskId => {
   if (!taskId) {
      throw new Error("Task ID required.");
   }

   const deleteTask = await Task.findByIdAndRemove(taskId);
   const count = await Task.countDocuments({ completed: true });

   return count;
};

deleteTaskAndCount("5db07569c9a345279c9b2679")
   .then(count => console.log(count))
   .catch(err => console.log(err));
