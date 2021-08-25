const mongoose = require("mongoose");
const { server } = require("../src/index");
const User = require("../src/models/User");

const {
  initialUsers,
  wrongId,
  notFoundId,
  api,
  getAllUsers,
  getValidUser,
} = require("./helpers");

beforeEach(async () => {
  await User.deleteMany({});
  for (const user of initialUsers) {
    const newUser = new User(user);
    await newUser.save();
  }
});

describe("Get users", () => {
  test("Get two users", async () => {
    const { users } = await getAllUsers();
    expect(users).toHaveLength(initialUsers.length);
  });

  test("Get first user", async () => {
    const { usernames } = await getAllUsers();
    expect(usernames).toContain(initialUsers[0].username);
  });
});

describe("Get user", () => {
  test("Fetch an user by user that exists returns the user", async () => {
    const { id, username } = await getValidUser();
    const result = await api.get(`/api/users/${id}`).expect(200);
    expect(result.body.username).toBe(username);
  });

  test("Fetch an user by a wrong userId", async () => {
    const result = await api.get(`/api/users/${wrongId}`).expect(400);
    expect(result.body.error).toBe("id sent is wrong");
  });

  test("Fetch an user by user that doesn't exist return an error", async () => {
    const result = await api.get(`/api/users/${notFoundId}`).expect(404);
    expect(result.body.error).toBe("User not found");
  });
});

describe("Creation users", () => {
  test("Creation of a new user returns new user", async () => {
    const newUser = {
      name: "Michael Mann",
      username: "michael",
      password: "1234",
    };
    const savedUser = await api.post("/api/users").send(newUser).expect(201);
    expect(savedUser.body.username).toBe(newUser.username);
    const { usernames } = await getAllUsers();
    expect(usernames).toHaveLength(initialUsers.length + 1);
    expect(usernames).toContain("michael");
  });

  test("Creation of an incomplete user fails", async () => {
    const newUser = {
      name: "Michael Mann",
      password: "1234",
    };
    const result = await api.post("/api/users").send(newUser).expect(400);
    expect(result.body.error).toBe("Username field is required");
  });

  test("Creation of an user that already exists fails", async () => {
    const initialUser = initialUsers[0];
    const newUser = {
      name: initialUser.name,
      username: initialUser.username,
      password: initialUser.passwordHash,
    };
    const result = await api.post("/api/users").send(newUser).expect(400);
    expect(result.body.errors.username.message).toContain(
      "Error, expected `username` to be unique"
    );
  });
});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});
