const mongoose = require("mongoose");
const { server } = require("../src/index");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

const { api, initialUsers, getValidUser } = require("./helpers");

beforeEach(async () => {
  await User.deleteMany({});
  const user = initialUsers[0];
  const newUser = new User(user);
  await newUser.save();
});

describe("Login", () => {
  test("Login with valid user and password returns user with token", async () => {
    const { username, password } = initialUsers[0];
    const { body: _id } = await User.find({ username });
    const result = await api
      .post("/api/login")
      .send({
        username,
        password,
      })
      .expect(200);
    const tokenExpected = jwt.sign({ id: _id, username }, process.env.JWT_KEY);
    expect(result.token).toBe(tokenExpected);
  });

  test("Login with invalid password fails", async () => {
    const { username } = getValidUser();
    const result = await api
      .post("/api/login")
      .send({
        username,
        password: "aaa",
      })
      .expect(401);
    expect(result.body.error).toBe("invalid username or password");
  });

  test("Login with not found user fails", async () => {
    const result = await api
      .post("/api/login")
      .send({
        username: "aaa",
        password: "aaa",
      })
      .expect(401);
    expect(result.body.error).toBe("invalid username or password");
  });
});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});
