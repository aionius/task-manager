require("../src/db/mongoose");

const User = require("../src/db/model/User");

// User.findOneAndUpdate({ _id: "5db06682578b8947e8c4f2ab" }, { age: 33 })
//    .then(user => {
//       console.log(user);
//       return User.countDocuments({ age: 33 });
//    })
//    .then(count => {
//       console.log(count);
//    })
//    .catch(err => {
//       console.log(err);
//    });

const updateAgeAndCount = async (id, age) => {
   if (age < 0) {
      return new Error("Age cannot be a negative number");
   }

   const user = await User.findByIdAndUpdate(id, { age });
   const count = await User.countDocuments({ age });
   return { user, count };
};

updateAgeAndCount("5db06682578b8947e8c4f2ab", -42)
   .then(result => {
      console.log(result);
   })
   .catch(err => console.log(err.message));
