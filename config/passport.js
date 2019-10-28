const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("User");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_PRIVATE_KEY;

// console.log(opts);

module.exports = passport => {
   passport.use(
      new JwtStrategy(opts, (jwtPayload, done) => {
         User.findById(jwtPayload.id)
            .then(user => {
               if (user) {
                  return done(null, user);
               }

               return done(null, false);
            })
            .catch(err => console.log);
      })
   );
};
