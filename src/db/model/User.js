const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task = require("./Task");

const UserSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true
      },
      email: {
         type: String,
         unique: true,
         required: true,
         trim: true,
         lowercase: true,
         validate(value) {
            if (!validator.isEmail(value)) {
               throw new Error("Email is invalid.");
            }
         }
      },
      password: {
         type: String,
         required: true,
         trim: true,
         minlength: 6,
         validate(value) {
            if (value.toLowerCase().includes("password")) {
               throw new Error("You can't use '" + value + "' for password.");
            }
         }
      },
      age: {
         type: Number,
         default: 0,
         validate(value) {
            if (value < 0) {
               throw new Error("Age must be positive number.");
            }
         }
      },
      tokens: [
         {
            token: {
               type: String,
               required: true
            }
         }
      ],
      avatar: {
         type: Buffer
      }
   },
   {
      timestamps: true
   }
);

UserSchema.virtual("tasks", {
   ref: "Task",
   localField: "_id",
   foreignField: "owner"
});

// statics are only accessible on the model
UserSchema.statics.findByCredentials = async (email, password) => {
   const user = await User.findOne({ email });
   if (!user) {
      throw new Error("Unable to login.");
   }

   const isPasswordMatched = await bcrypt.compare(password, user.password);
   if (!isPasswordMatched) {
      throw new Error("Unable to login.");
   }

   return user;
};

// methods are accessible on the instance of the model
UserSchema.methods.generateAuthToken = async function() {
   const user = this;
   const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.SECRET_OR_PRIVATE_KEY,
      { expiresIn: "30m" }
   );

   user.tokens = user.tokens.concat({ token });
   await user.save();

   return token;
};

// UserSchema.methods.getPublicProfile = function() {
//    const user = this;
//    const userObject = user.toObject();

//    delete userObject.password;
//    delete userObject.tokens;

//    return userObject;
// };

// another method that's basically the same from aboves code
UserSchema.methods.toJSON = function() {
   const user = this;
   const userObject = user.toObject();

   delete userObject.password;
   delete userObject.tokens;
   delete userObject.avatar;

   return userObject;
};

// hash the plain text password before saving
UserSchema.pre("save", async function(next) {
   const user = this;
   if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
   }
   next();
});

// delete tasks when user is deleted
UserSchema.pre("remove", async function(next) {
   const user = this;
   await Task.deleteMany({ owner: user._id });
   next();
});

module.exports = User = mongoose.model("User", UserSchema);
