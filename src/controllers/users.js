const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const Note = require("../models/Note.js");
const User = require("../models/User.js");

usersRouter.get("/", (request, response, next) => {
  User.find({})
    .then(users => response.json(users))
    .catch(error => next(error));
});

usersRouter.get("/:id", (request, response, next) => {
  const { id } = request.params;
  User.findById(id)
    .then(user => {
      user
        ? response.json(user)
        : response.status(404).send({ error: "User not found" });
    })
    .catch(error => next(error));
});

usersRouter.delete("/:id", async (request, response, next) => {
  const { id } = request.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      for (const noteId of user.notes) {
        let note = await Note.findById(noteId);
        if (note) {
          note.user = undefined;
          await note.save();
        }
      }
      return response.status(204).end();
    }
    response.status(404).send({ error: "Note not found" });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (request, response, next) => {
  const { name = "", username, password, notes = [] } = request.body;

  if (!username) {
    return response.status(400).json({ error: "Username field is required" });
  }
  if (!password) {
    return response.status(400).json({ error: "Password field is required" });
  }

  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);

  const notesIds = [];
  for (const note of notes) {
    const wholeNote = await Note.findById(note);
    if (!wholeNote) {
      return response.status(400).json({ error: "Note not found" });
    }
    notesIds.push(wholeNote._id);
  }

  const user = new User({
    name: name,
    username,
    passwordHash,
    notes: notesIds,
  });

  try {
    await user.save();
    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
