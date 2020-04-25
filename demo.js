const mongoose = require("mongoose");

const connect = () => {
  const hostname = "localhost";
  const port = 27017;
  const dbName = "__whatever";
  return mongoose.connect(`mongodb://${hostname}:${port}/${dbName}`, {
    useNewUrlParser: true,
  });
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
    school: {
      // A reference to another document that is unique
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "school", // don't put the pluralized version
    },
  },
  {timestamps: true}
);

const school = new mongoose.Schema({
  name: String,
});

// Mongo will pluralize this: 'student' -> 'students' in the database
const Student = mongoose.model("student", student);
const School = mongoose.model("school", school);

connect()
  .then(async (_conn) => {
    const newSchool = await School.create({name: "cool school"});
    const newStudent = await Student.create({
      firstName: "Bobbie",
      school: newSchool._id,
    });

    // query with the school
    const match = await Student.findById(newStudent.id)
      .populate("school") // creates a sort of virtual join table
      .exec();

    console.log(match);
  })
  .catch((e) => console.error(e));
