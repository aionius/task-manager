const jwt = require("jsonwebtoken");
const User = require("../db/model/User");
const config = require("../../config/config");

const auth = async (req, res, next) => {
   try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, config.secretOrPrivateKey);

      const user = await User.findOne({
         _id: decoded._id,
         "tokens.token": token
      });

      if (!user) {
         throw new Error();
      }

      req.token = token;
      req.user = user;
      next();
   } catch (err) {
      res.status(401).send({ error: "Please authenticate." });
   }
};

module.exports = auth;
