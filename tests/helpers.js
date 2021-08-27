const supertest = require("supertest");
const { app } = require("../src/index");
const api = supertest(app);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const initialNotes = [
  {
    content: "Content1",
    date: new Date(),
    important: false,
  },
  {
    content: "Content2",
    date: new Date(),
    important: true,
  },
];

const initialUsers = [
  {
    name: "Neil McCauley",
    username: "neil",
    password: "1234",
    passwordHash: bcrypt.hashSync("1234", 10),
    notes: [],
  },
  {
    name: "Vincent Hanna",
    username: "vincent",
    password: "1234",
    passwordHash: bcrypt.hashSync("1234", 10),
    notes: [],
  },
];

const getAllContentsFromNotes = async () => {
  const result = await api.get("/api/notes").expect(200);
  const notes = result.body;
  const contents = notes.map(note => note.content);
  return { result, contents };
};

const getUserToken = async () => {
  const { users } = await getAllUsers();
  const { id, username } = users[0];
  return jwt.sign({ id, username }, process.env.JWT_KEY);
};

const createNewNote = async newNote => {
  const token = await getUserToken();
  const savedNote = await api
    .post("/api/notes")
    .set("Authorization", `Bearer ${token}`)
    .send(newNote)
    .expect(201);
  expect(savedNote.body.content).toBe(newNote.content);
  const { contents } = await getAllContentsFromNotes();
  expect(contents).toContain(newNote.content);
};

const getAllUsers = async () => {
  const users = await api.get("/api/users").expect(200);
  const usernames = users.body.map(user => user.username);
  return { users: users.body, usernames };
};

const getValidUser = async () => {
  const { users } = await getAllUsers();
  return users[0];
};

const wrongId = "6122f08dacdd864b280029e3asdf";
const notFoundId = "6122f08dacdd864b280029e4";

module.exports = {
  initialNotes,
  initialUsers,
  api,
  wrongId,
  notFoundId,
  getValidUser,
  getAllContentsFromNotes,
  getAllUsers,
  createNewNote,
  getUserToken,
};
