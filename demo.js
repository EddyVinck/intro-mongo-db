const mongoose = require("mongoose");

const connect = () => {
  const hostname = "localhost";
  const port = 27017;
  const dbName = "whatever";
  return mongoose.connect(`mongodb://${hostname}:${port}/${dbName}`);
};

const student = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
    },
    favoriteFoods: [{type: String}],
    info: {
      school: {
        type: String,
      },
      shoeSize: {
        type: Number,
      },
    },
  },
  {timestamps: true}
);

// Mongo will pluralize this: 'student' -> 'students' in the database
const Student = mongoose.model("student", student);

connect()
  .then(async (_conn) => {
    const newStudent = await Student.create({firstName: "Bobby"});
    Student.find({firstName: "Bobby"});
    console.log(newStudent);
  })
  .catch((e) => console.error(e));
