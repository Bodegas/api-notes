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
    const users = await User.find({ username });
    const { _id } = users[0];
    const result = await api
      .post("/api/login")
      .send({
        username,
        password,
      })
      .expect(200);
    const dataToSign = { id: _id, username };
    const tokenExpected = jwt.sign(dataToSign, process.env.JWT_KEY);
    expect(result.body.token).toBe(tokenExpected);
  });

  test("Login with no user fails", async () => {
    const result = await api
      .post("/api/login")
      .send({
        password: "aaa",
      })
      .expect(400);
    expect(result.body.error).toBe("username field is required");
  });

  test("Login with no user fails", async () => {
    const result = await api
      .post("/api/login")
      .send({
        username: initialUsers[0].username,
      })
      .expect(400);
    expect(result.body.error).toBe("password field is required");
  });

  test("Login with invalid password fails", async () => {
    const { username } = await getValidUser();
    const result = await api
      .post("/api/login")
      .send({
        username,
        password: "aaa",
      })
      .expect(401);
    expect(result.body.error).toBe("username or password not valid");
  });

  test("Login with not found user fails", async () => {
    const result = await api
      .post("/api/login")
      .send({
        username: "aaa",
        password: "aaa",
      })
      .expect(401);
    expect(result.body.error).toBe("username or password not valid");
  });
});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});
