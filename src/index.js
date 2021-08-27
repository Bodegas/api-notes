require("dotenv").config();
require("./mongo");

const express = require("express");
const cors = require("cors");
const handleErrors = require("./middleware/handleError");
const notFound = require("./middleware/notFound");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Api molona</h1>");
});

app.use("/api/login", loginRouter);

app.use("/api/notes", notesRouter);

app.use("/api/users", usersRouter);

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
