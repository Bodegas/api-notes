const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const connectionString =
  "mongodb+srv://david:piZXMWhkrgAciY3tnVco@cluster0.a8u2d.mongodb.net/notesDB?retryWrites=true&w=majority";

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to notesDB"))
  .catch((error) => console.log(error));

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const NoteModel = model("Note", noteSchema);

const newNote = new NoteModel({
  content: "Content 3",
  date: "2021-08-03T22:26:04.615Z",
  important: true,
});

newNote
  .save()
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => mongoose.connection.close());
