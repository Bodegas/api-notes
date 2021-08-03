const express = require("express");
const cors = require("cors");
const logger = require("./loggerMiddleware");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

let contents = [
  {
    id: 1,
    content: "Content 1",
    date: "2021-08-03T22:26:04.615Z",
    important: true,
  },
  {
    id: 2,
    content: "Content 2",
    date: "2021-08-03T22:27:04.615Z",
    important: true,
  },
  {
    id: 3,
    content: "Content 3",
    date: "2021-08-03T22:28:04.615Z",
    important: false,
  },
  {
    id: 4,
    content: "Content 4",
    date: "2021-08-03T22:29:04.615Z",
    important: false,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Api molona</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(contents);
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const content = contents.find((content) => content.id.toString() === id);
  if (content) {
    response.json(content);
  } else {
    response.status(404).end("<h1>Content not found</h1>");
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const found = contents.find((content) => content.id.toString() === id);
  contents = contents.filter((content) => content.id.toString() !== id);
  if (found) {
    response.send(`<h1>Content ${id} deleted</h1>`);
  } else {
    response.status(404).end("<h1>Content not found</h1>");
  }
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  const ids = contents.map((content) => content.id);
  const maxId = Math.max(...ids);
  const newContent = { id: maxId + 1, ...body };
  contents.push();
  response.status(201).json(newContent);
});

app.use((request, response) => {
  response.status(404).end("<h1>Wrong url</h1>");
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server runnig on port ${PORT}`));
