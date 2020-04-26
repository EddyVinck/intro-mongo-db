const express = require("express");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const {urlencoded, json} = require("body-parser");

app.use(morgan("dev"));
app.use(urlencoded({extended: true}));
app.use(json());

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  body: {
    type: String,
    minlength: 10,
  },
});

const Note = mongoose.model("note", noteSchema);

app.get("/note", async (req, res) => {
  const notes = await Note.find({})
    .lean() // optimisation: just give me the JSON
    .exec();
  // for pagination, you can do a .sort, a .skip and a .limit
  res.status(200).json(notes);
});

app.post("/note", async (req, res) => {
  const noteToBeCreated = req.body;
  const note = await Note.create(noteToBeCreated);
  res.status(201).json(
    note.toObject() // optimisation
  );
});

const connect = () => {
  const hostname = "localhost";
  const port = 27017;
  const dbName = "__whatever";
  return mongoose.connect(`mongodb://${hostname}:${port}/${dbName}`, {
    useNewUrlParser: true,
  });
};

connect()
  .then(async (_conn) => {
    app.listen(3000);
  })
  .catch((e) => console.error(e));
