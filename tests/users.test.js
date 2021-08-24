const mongoose = require("mongoose");
const { server } = require("../src/index");
const User = require("../src/models/User");

const { initialUsers, api, getAllUsers } = require("./helpers");

beforeEach(async () => {
  await User.deleteMany({});
  for (const user of initialUsers) {
    const newUser = new User(user);
    await newUser.save();
  }
});

describe("Get users", () => {
  test("Get two users", async () => {
    const { usernames } = await getAllUsers();
    expect(usernames).toHaveLength(initialUsers.length);
  });

  test("Get first user", async () => {
    const { usernames } = await getAllUsers();
    expect(usernames).toContain(initialUsers[0].username);
  });
});

describe("Get user", () => {
  test("Fetch an user by username that exists returns the user", async () => {
    const username = initialUsers[0].username;
    const result = await api.get(`/api/users/${username}`).expect(200);
    expect(result.body.username).toBe(username);
  });

  test("Fetch an user by username that doesn't exist return an error", async () => {
    const username = "asdf";
    const result = await api.get(`/api/users/${username}`).expect(404);
    expect(result.body.error).toBe("User not exists");
  });
});

describe("Creation users", () => {
  test("Creation of a new user returns new user", async () => {
    const newUser = {
      name: "Michael Mann",
      username: "michael",
      passwordHash: "1234",
    };
    await api.create("/api/users").send(newUser).expect(201);
    const { usernames } = await getAllUsers();
    expect(usernames).toHaveLength(initialUsers.length + 1);
    expect(usernames).toContain("michael");
  });

  test("Creation of an incomplete user fails", async () => {
    const newUser = {
      name: "Michael Mann",
      passwordHash: "1234",
    };
    const result = await api.create("/api/users").send(newUser).expect(400);
    expect(result.body.error).toBe("username is required");
  });

  test("Creation of an user that already exists fails", async () => {
    const newUser = initialUsers[0];
    const result = await api.create("/api/users").send(newUser).expect(400);
    expect(result.body.errors.username).toBe("user already exists");
  });
});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});
