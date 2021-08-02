const express = require("express");
const { request } = require("http");
const app = express();

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
  const content = contents.find(content => content.id.toString() === id);
  if(content){
    response.json(content);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/contents/:id", (request, response) => {
  const id = request.params.id;
  contents = contents.filter(content => content.id.toString() !== id);
  if(contents){
    response.json(contents);
  } else {
    response.status(404).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server runnig on port ${PORT}`));
