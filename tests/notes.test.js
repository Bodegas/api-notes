const mongoose = require("mongoose");
const { server } = require("../src/index");
const Note = require("../src/models/Note");

const {
  initialState,
  api,
  wrongNoteId,
  notFoundId,
  getAllContentsFromNotes,
  createNewNote,
} = require("./helpers");

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
  test("There are two notes", async () => {
    const { contents } = await getAllContentsFromNotes();
    expect(contents).toHaveLength(initialState.length);
  });
  test("Obtain first note", async () => {
    const { contents } = await getAllContentsFromNotes();
    expect(contents).toContain(initialState[0].content);
  });
});

describe("GET note", () => {
  test("Fetch a note with right id returns a note", async () => {
    const { result } = await getAllContentsFromNotes();
    const noteId = result.body[0].id;
    const resultNote = await api.get(`/api/notes/${noteId}`).expect(200);
    const note = resultNote.body;
    expect(note.content).toBe(initialState[0].content);
  });

  test("Fetch a note with wrong id returns 400 error", async () => {
    const result = await api.get(`/api/notes/${wrongNoteId}`).expect(400);
    expect(result.body.error).toBe("id sent is wrong");
  });
  test("Fetch a note that not exists returns a 404", async () => {
    const result = await api.get(`/api/notes/${notFoundId}`).expect(404);
    expect(result.body.error).toBe("Note not found");
  });
});

describe("DELETE note", () => {
  test("Delete a note with right id returns 204", async () => {
    const { result: resultBefore } = await getAllContentsFromNotes();
    const noteToDelete = resultBefore.body[0];
    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const { contents } = await getAllContentsFromNotes();
    expect(contents).toHaveLength(resultBefore.body.length - 1);
    expect(contents).not.toContain(noteToDelete.content);
  });
  test("Delete a note with wrong id returns 400", async () => {
    const result = await api.delete(`/api/notes/${wrongNoteId}`).expect(400);
    expect(result.body.error).toBe("id sent is wrong");
  });
  test("Delete a note that not exists returns 404", async () => {
    const result = await api.delete(`/api/notes/${notFoundId}`).expect(404);
    expect(result.body.error).toBe("Note not found");
  });
});

describe("CREATE note", () => {
  test("Create a note with content, important and date", async () => {
    const newNote = {
      content: "New content",
      date: new Date(),
      imporant: false,
    };
    await createNewNote(newNote);
  });

  test("Create a note only with content", async () => {
    const newNote = {
      content: "New content",
    };
    await createNewNote(newNote);
  });

  test("Can't create a incomplete note", async () => {
    const newNote = {
      date: new Date(),
    };
    const result = await api.post("/api/notes").send(newNote).expect(400);
    expect(result.body.error).toBe("Content field is required");
  });

  test("Can't create a note with wrong url", async () => {
    const newNote = {
      content: "New content",
      date: new Date(),
      imporant: false,
    };
    await api.post("/api/notes/asdf").send(newNote).expect(404);
  });
});

describe("UPDATE note", () => {
  test("Update a note ", async () => {
    const newNote = {
      content: "New content",
      date: new Date(),
      imporant: false,
    };
    const { result } = await getAllContentsFromNotes();
    const noteId = result.body[0].id;
    const updatedNote = await api
      .put(`/api/notes/${noteId}`)
      .send(newNote)
      .expect(200);
    expect(updatedNote.body.content).toBe(newNote.content);
    const { contents } = await getAllContentsFromNotes();
    expect(contents).toContain(newNote.content);
  });
});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});
