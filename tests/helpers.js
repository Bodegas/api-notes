const supertest = require("supertest");
const { app } = require("../src/index");
const api = supertest(app);

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
    passwordHash: "1234",
    notes: [],
  },
  {
    name: "Vincent Hanna",
    username: "vincent",
    passwordHash: "1234",
    notes: [],
  },
];

const getAllContentsFromNotes = async () => {
  const result = await api.get("/api/notes").expect(200);
  const notes = result.body;
  const contents = notes.map(note => note.content);
  return { result, contents };
};

const createNewNote = async newNote => {
  const savedNote = await api.post("/api/notes").send(newNote).expect(201);
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
};
