const mongoose = require("mongoose");
const supertest = require("supertest");
const { server, app } = require("../src/index");
const api = supertest(app);
const Note = require("../src/models/Note");

const initialState = [
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

beforeEach(async () => {
  await Note.deleteMany({});
  for (const note of initialState) {
    const newNote = new Note(note);
    await newNote.save();
  }
});

describe("Common", () => {
  test("Fetch root returns Api molona", async () => {
    await api.get("/").expect(200, "<h1>Api molona</h1>");
  });
  test("Wrong url returns not found error", async () => {
    await api.get("/adf").expect(404, "<h1>Not found</h1>");
  });
});

describe("GET notes", () => {
  test("Obtain all notes as json", async () => {
    const result = await api.get("/api/notes").expect(200);
    const notes = result.body;
    const contents = notes.map(note => note.content);
    expect(notes).toHaveLength(initialState.length);
    expect(contents).toContain("Content1");
  });
});

// describe("GET note", () => {
//   test("Fetch a note with right id returns a note", () => {});
//   test("Fetch a note with wrong id returns 400 error", () => {});
//   test("Fetch a note with no id returns a 400 error", () => {});
//   test("Fetch a note that not exists returns a 404", () => {});
// });

// describe("DELETE note", () => {
//   test("Delete a note with right id returns 200", () => {});
//   test("Delete a note with wrong id returns 400", () => {});
//   test("Delete a note with no id returns 400", () => {});
//   test("Delete a note that not exists returns 404", () => {});
// });

// describe("CREATE note", () => {
//   test("Create a note with content, important and date", () => {});
//   test("Create a note with content, important and date", () => {});
// });

// describe("UPDATE note", () => {});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});
