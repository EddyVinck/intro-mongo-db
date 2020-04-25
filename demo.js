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
  openSince: Number,
  students: Number,
  isGreat: Boolean,
  staff: [{type: String}],
});

// Mongo will pluralize this: 'student' -> 'students' in the database
const Student = mongoose.model("student", student);
const School = mongoose.model("school", school);

connect()
  .then(async (_conn) => {
    // const newSchool = await School.create({name: "cool school"});
    // const newStudent = await Student.create({
    //   firstName: "Bobbie",
    //   school: newSchool._id,
    // });

    // // query with the school
    // const match = await Student.findById(newStudent.id)
    //   .populate("school") // creates a sort of virtual join table
    //   .exec();
    //console.log(match);
    const schoolConfig = {
      name: "Cool School",
      openSince: 2009,
      students: 1100,
      isGreat: true,
      staff: ["a", "b", "c"],
    };
    const schoolConfig2 = {
      name: "Another School",
      openSince: 1980,
      students: 600,
      isGreat: false,
      staff: ["d", "e", "f"],
    };

    const schools = await School.create([schoolConfig, schoolConfig2]);
    const match = await School.findOne({
      students: {
        $gt: 600, // $gt means greater than and comes from Mongo, not Mongoose
      },
      staff: "b", // mongoose is smart enough to look in the array
      // other operators include
      // $in: {staff: ['d', 'e']}
    })
      .sort({openSince: -1}) // or 1 for ascending
      .limit(2)
      .exec();

    console.log(match);
    // const school = School.findOneAndUpdate(
    //   {name: "cool school"},
    //   {name: "cool school"},
    //   {upsert: true, new: true}
    // ).exec();
  })
  .catch((e) => console.error(e));
