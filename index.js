const http = require("http");

const data = [
  { id: 1, content: "Content 1", color: "red" },
  {
    id: 2,
    content: "Content2",
    color: "yellow",
  },
];

const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
});

const PORT = 3001;
app.listen(PORT);
