const { response } = require("express");
const express = require("express");
const logger = require("./loggerMiddleware");

const app = express();
app.use(express.json());
app.use(logger);

let contents = [
  { id: 1, content: "Content 1", color: "red" },
  {
    id: 2,
    content: "Content2",
    color: "yellow",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Api molona</h1>");
});

app.get("/api/contents", (request, response) => {
  response.json(contents);
});

app.get("/api/contents/:id", (request, response) => {
  const id = request.params.id;
  const content = contents.find((content) => content.id.toString() === id);
  if (content) {
    response.json(content);
  } else {
    response.status(404).end("<h1>Content not found</h1>");
  }
});

app.delete("/api/contents/:id", (request, response) => {
  const id = request.params.id;
  const found = contents.find((content) => content.id.toString() === id);
  contents = contents.filter((content) => content.id.toString() !== id);
  if (found) {
    response.send(`<h1>Content ${id} deleted</h1>`);
  } else {
    response.status(404).end("<h1>Content not found</h1>");
  }
});

app.post("/api/contents", (request, response) => {
  const body = request.body;
  const ids = contents.map((content) => content.id);
  const maxId = Math.max(...ids);
  contents.push({ id: maxId + 1, ...body });
  response.status(201).json(contents);
});

app.use((request, response) => {
  response.status(404).end("<h1>Wrong url</h1>");
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server runnig on port ${PORT}`));
