const mongoose = require("mongoose");
console.log(process.env.MONGO_DB_URI);
const connectionString = process.env.MONGO_DB_URI;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to notesDB"))
  .catch(error => console.log(error));
