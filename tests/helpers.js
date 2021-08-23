const supertest = require("supertest");
const { app } = require("../src/index");
const api = supertest(app);

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

const getAllContentsFromNotes = async () => {
  const result = await api.get("/api/notes").expect(200);
  const notes = result.body;
  const contents = notes.map(note => note.content);
  return { result, contents };
};

const createNewNote = async newNote => {
  await api.post("/api/notes").send(newNote).expect(201);
  const { contents } = await getAllContentsFromNotes();
  expect(contents).toContain(newNote.content);
};

const wrongNoteId = "6122f08dacdd864b280029e3asdf";
const notFoundId = "6122f08dacdd864b280029e4";

module.exports = {
  initialState,
  api,
  wrongNoteId,
  notFoundId,
  getAllContentsFromNotes,
  createNewNote,
};
