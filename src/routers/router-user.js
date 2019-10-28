const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");

const multer = require("multer");
const upload = multer({
   // dest: "avatars",
   limits: {
      fileSize: 1000000
   },
   fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
         return cb(new Error("Please upload an image"));
      }

      cb(undefined, true);
   }
});

const User = require("../db/model/User");
const config = require("../../config/config");
const auth = require("../middleware/authentication");

// @path    /users
// @desc    register user
// @access  PUBLIC
router.post("/users", async (req, res) => {
   const user = new User(req.body);

   try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
   } catch (err) {
      res.status(400).send(err);
   }

   // user
   //    .save()
   //    .then(() => {
   //       res.status(201).send(user);
   //    })
   //    .catch(err => {
   //       res.status(400).send(err);
   //    });
});

// @path    /users/login
// @desc    login user
// @access  PUBLIC
router.post("/users/login", async (req, res) => {
   try {
      const user = await User.findByCredentials(
         req.body.email,
         req.body.password
      );

      const token = await user.generateAuthToken();

      //   res.send({ user: user.getPublicProfile(), token });
      res.send({ user, token });
   } catch (err) {
      res.status(400).send({ error: err.message });
   }
});

// @path    /users/logout
// @desc    logout user
// @access  PRIVATE
router.post("/users/logout", auth, async (req, res) => {
   try {
      req.user.tokens = req.user.tokens.filter(token => {
         return token.token !== req.token;
      });
      await req.user.save();

      res.sendStatus(200);
   } catch (err) {
      res.sendStatus(500);
   }
});

// @path    /users/logoutAll
// @desc    Logout all user token
// @access  PRIVATE
router.post("/users/logoutAll", auth, async (req, res) => {
   try {
      req.user.tokens = [];
      await req.user.save();

      res.sendStatus(200);
   } catch (err) {
      res.sendStatus(500);
   }
});

// @path    /users
// @desc    get all users
// @access  PRIVATE
router.get("/users", auth, async (req, res) => {
   try {
      const users = await User.find();
      res.status(201).send(users);
   } catch (err) {
      res.status(400).send(err);
   }

   // User.find()
   //    .then(result => {
   //       res.send(result);
   //    })
   //    .catch(err => {
   //       res.status(201).send(err);
   //    });
});

// @path    /users/profile
// @desc    get user profile
// @access  PRIVATE
router.get("/users/profile", auth, async (req, res) => {
   res.send(req.user);
});

// @path    /users/:id
// @desc    get user by id
// @acces   PUBLIC
// router.get("/users/:id", async (req, res) => {
//    const _id = req.params.id;

//    try {
//       const user = await User.findById(_id);
//       if (!user) {
//          return res.status(404).send({ error: "User Not Found" });
//       }

//       res.status(201).send(user);
//    } catch (err) {
//       res.status(400).send(err);
//    }

//    // User.findById(_id)
//    //    .then(user => {
//    //       if (!user) {
//    //          return res.status(404).send({ error: "User Not Found" });
//    //       }
//    //       res.send(user);
//    //    })
//    //    .catch(err => {
//    //       res.status(500).send(err);
//    //    });
// });

// @path    /user/profile
// @desc    update user
// @access  PUBLIC
router.patch("/users/profile", auth, async (req, res) => {
   const updates = Object.keys(req.body);
   const allowedUpdates = ["name", "email", "password", "age"];
   const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
   );

   if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid update!" });
   }

   try {
      //   const user = await User.findById(req.params.id);

      updates.forEach(update => {
         req.user[update] = req.body[update];
      });
      await req.user.save();

      //   if (!user) {
      //      return res.status(404).send({ error: "User Not Found" });
      //   }

      res.status(201).send(req.user);
   } catch (err) {
      res.status(400).send(err);
   }
});

// @path    /user
// @desc    delete user by id
// @access  PUBLIC
router.delete("/users/profile", auth, async (req, res) => {
   try {
      //   const user = await User.findByIdAndDelete(req.user._id);
      //   if (!user) {
      //      return res.status(404).send({ error: "User Not Found" });
      //   }

      await req.user.remove();

      res.status(201).send(req.user);
   } catch (err) {
      res.status(500).send(err);
   }
});

// @path    /users/profile/avatar
// @desc    upload profile picture
// @access  PRIVATE
router.post(
   "/users/profile/avatar",
   auth,
   upload.single("avatar"),
   async (req, res) => {
      req.user.avatar = req.file.buffer;
      await req.user.save();
      res.sendStatus(200);
   },
   (error, req, res, next) => {
      res.status(400).send({ error: error.message });
   }
);

// @path    /users/profile/avatar
// @desc    get user avatar
// @access  PRIVATE
router.get("/users/:id/avatar", async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      if (!user || !user.avatar) {
         throw new Error();
      }

      res.set("Content-Type", "image/jpg");
      res.send(user.avatar);
   } catch (err) {
      res.sendStatus(404);
   }
});

module.exports = router;
