const express = require("express");
const router = new express.Router();

const Task = require("../db/model/Task");

const auth = require("../middleware/authentication");

// @path    /tasks
// @desc    create tasks
// @access  PUBLIC
router.post("/tasks", auth, async (req, res) => {
   // const task = new Task(req.body);
   const task = new Task({
      ...req.body,
      owner: req.user._id
   });

   try {
      await task.save();
      res.status(201).send(task);
   } catch (err) {
      res.status(400).send(err);
   }

   // task
   //    .save()
   //    .then(() => {
   //       res.status(201).send(task);
   //    })
   //    .catch(err => {
   //       res.status(400).send(err);
   //    });
});

// @path    /tasks/:id
// @desc    update task by id
// @access  PUBLIC
router.patch("/tasks/:id", auth, async (req, res) => {
   const updates = Object.keys(req.body);
   const allowedUpdates = ["description", "completed"];
   const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
   );
   if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid update!" });
   }

   try {
      // const task = await Task.findById(req.params.id);
      const task = await Task.findOne({
         _id: req.params.id,
         owner: req.user._id
      });
      if (!task) {
         return res.status(404).send({ error: "Task Not Found" });
      }

      updates.forEach(update => (task[update] = req.body[update]));
      await task.save();

      // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      //    new: true,
      //    runValidators: true
      // });

      res.send(task);
   } catch (err) {
      res.status(400).send(err);
   }
});

// @path    /tasks
// @path    /tasks?completed=true
// @path    /tasks?limit=<number>&skip=<number>
// @path    /tasks?sortBy=<string>
// @desc    get all tasks
// @access  PRIVATE
router.get("/tasks", auth, async (req, res) => {
   const match = {};
   const sort = {};

   if (req.query.completed) {
      match.completed = req.query.completed === "true";
   }

   if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
   }

   try {
      // const tasks = await Task.find({ owner: req.user._id });
      // res.status(201).send(tasks);

      // another way to get tasks
      await req.user
         .populate({
            path: "tasks",
            match,
            options: {
               limit: parseInt(req.query.limit),
               skip: parseInt(req.query.skip),
               sort
            }
         })
         .execPopulate();
      res.send(req.user.tasks);
   } catch (err) {
      res.status(500).send(err);
   }

   // Task.find()
   //    .then(tasks => {
   //       res.status(201).send(tasks);
   //    })
   //    .catch(err => {
   //       res.status(500).send(err);
   //    });
});

// @path    /tasks/:id
// @desc    get task by id
// @access  PUBLIC
router.get("/tasks/:id", auth, async (req, res) => {
   const _id = req.params.id;

   try {
      const task = await Task.findOne({
         _id,
         owner: req.user._id
      });

      if (!task) {
         return res.status(404).send({ error: "Task Not Found" });
      }
      res.status(201).send(task);
   } catch (err) {
      res.status(400).send(err);
   }

   // Task.findById(_id)
   //    .then(task => {
   //       if (!task) {
   //          return res.status(404).send({ error: "User Not Found" });
   //       }
   //       res.status(200).send(task);
   //    })
   //    .catch(err => {
   //       res.status(500).send(err);
   //    });
});

// @path    /tasks/:id
// @desc    delete task by idsd
// @access  PUBLIC
router.delete("/tasks/:id", auth, async (req, res) => {
   try {
      // const task = await Task.findByIdAndDelete(req.params.id);
      const task = await Task.findOneAndDelete({
         _id: req.params.id,
         owner: req.user._id
      });
      if (!task) {
         return res.status(404).send({ error: "Task Not Found" });
      }

      res.status(201).send(task);
   } catch (err) {
      console.log(err);
      res.status(500).send(err);
   }
});

module.exports = router;
