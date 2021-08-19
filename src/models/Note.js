const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Note = model("Note", noteSchema);

module.exports = Note;
