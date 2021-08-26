const mongoose = require("mongoose");
const { NODE_ENV, MONGO_DB_URI, MONGO_DB_URI_TEST } = process.env;

const connectionString = NODE_ENV === "test" ? MONGO_DB_URI_TEST : MONGO_DB_URI;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(
    console.log(
      `Connected to ${NODE_ENV === "test" ? "notesDBTest" : "notesDB"}`
    )
  )
  .catch(error => console.error(error));

process.on("uncaughtException", error => {
  console.error(error);
  mongoose.disconnect();
});
