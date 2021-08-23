require("dotenv").config();
require("./mongo");

const express = require("express");
const cors = require("cors");
const logger = require("./middleware/loggerMiddleware");
const handleErrors = require("./middleware/handleError");
const notFound = require("./middleware/notFound");
const Note = require("./models/Note");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (request, response) => {
  response.send("<h1>Api molona</h1>");
});

app.get("/api/notes", (request, response, next) => {
  Note.find({})
    .then(notes => response.json(notes))
    .catch(error => next(error));
});

app.get("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findById(id)
    .then(note => {
      note
        ? response.json(note)
        : response.status(404).send({ error: "Note not found" });
    })
    .catch(error => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findByIdAndDelete(id)
    .then(note =>
      note
        ? response.status(204).end()
        : response.status(404).send({ error: "Note not found" })
    )
    .catch(error => next(error));
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({ error: "Content field is required" });
  }

  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important,
  });

  note
    .save()
    .then(() => response.status(201).end())
    .catch(() => response.status(500).end());
});

app.put("/api/notes/:id", (request, response, next) => {
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

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;
const server = app.listen(PORT, () =>
  console.log(`Server runnig on port ${PORT}`)
);

module.exports = {
  app,
  server,
};
