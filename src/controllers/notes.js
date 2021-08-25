const notesRouter = require("express").Router();
const Note = require("../models/Note.js");
const User = require("../models/User.js");

notesRouter.get("/", async (request, response, next) => {
  try {
    const notes = await Note.find({}).populate("users", {
      name: 1,
      usernamte: 1,
    });
    response.json(notes);
  } catch (error) {
    next(error);
  }
});

notesRouter.get("/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findById(id)
    .then(note => {
      note
        ? response.json(note)
        : response.status(404).send({ error: "Note not found" });
    })
    .catch(error => next(error));
});

notesRouter.delete("/:id", async (request, response, next) => {
  const { id } = request.params;
  try {
    const note = await Note.findByIdAndDelete(id);
    if (note) {
      const user = await User.findById(note.user);
      if (user) {
        user.notes = user.notes.filter(note => note !== note._id);
        await user.save();
      }
      return response.status(204).end();
    }
    response.status(404).send({ error: "Note not found" });
  } catch (error) {
    next(error);
  }
});

notesRouter.post("/", async (request, response) => {
  const { content, important, user: userId } = request.body;
  if (!content) {
    return response.status(400).json({ error: "Content field is required" });
  }
  if (!userId) {
    return response.status(400).json({ error: "User field is required" });
  }

  const user = await User.findById(userId);
  console.log(user);
  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }

  const note = new Note({
    content: content,
    date: new Date(),
    important: important,
    user: user._id,
  });

  try {
    await note.save();
    user.notes = [...user.notes, note._id];
    user.save();
    response.status(201).json(note);
  } catch (error) {
    response.status(500).end();
  }
});

notesRouter.put("/:id", (request, response, next) => {
  const { id } = request.params;
  const body = request.body;

  Note.findByIdAndUpdate(
    id,
    {
      ...body,
    },
    { new: true }
  )
    .then(updatedNote => {
      response.status(200).json(updatedNote);
    })
    .catch(error => next(error));
});

module.exports = notesRouter;
