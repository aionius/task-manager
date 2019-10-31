const request = require("supertest");
const app = require("../src/app");
const User = require("../src/db/model/User");

const userOne = {
   name: "User One",
   email: "userone@mail.com",
   password: "userone"
};

beforeEach(async () => {
   await User.deleteMany();
   //    await new User(userOne).save();
});

test("Should singup a new user", async () => {
   await request(app)
      .post("/users")
      .send({
         name: "Jeffrey Yong",
         email: "jeffrey.yong@gmail.com",
         password: "tester88"
      })
      .expect(201);
});

test("Should login existing user", async () => {
   await request(app)
      .post("/users/login")
      .send({
         email: "jeffrey.yong@gmail.com",
         password: "tester88"
      })
      .expect(200);
});

// test("Should not login nonexistent user", async () => {
//    await request(app)
//       .post("/users/login")
//       .send({
//          email: "userone@mail.com",
//          password: "usertwo"
//       })
//       .expect(400);
// });
