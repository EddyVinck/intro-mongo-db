const mongoose = require("mongoose");

const connect = () => {
  const hostname = "localhost";
  const port = 27017;
  const dbName = "__whatever";
  return mongoose.connect(`mongodb://${hostname}:${port}/${dbName}`, {
    useNewUrlParser: true,
  });
};

const school = new mongoose.Schema({
  district: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "district",
  },
  name: {type: String, unique: false},
  openSince: Number,
  students: Number,
  isGreat: Boolean,
  staff: [{type: String}],
});

school.index(
  {
    // the order here matters
    // in this case, names have to be unique
    // underneath a district
    // as a general rule: scope the big ones first and the little ones underneath them.
    district: 1,
    name: 1,
  },
  {unique: true}
);

school
  .pre("validate", function () {
    // can I chain these?
  })
  .pre("save", function () {
    console.log("before save");
  })
  // if you ask for `next`, you must call it.
  // they check if you ask for `next` and will wait
  // for you to call it.
  // If you don't, it will hang.
  .post("save", function (_doc, next) {
    console.log("post save");
    next();
  });
// Hooks are a great place to update all your
// clients if you are using websockets.

school
  .virtual("staffCount")
  // 🚫 .get(() => {}) don't use arrow functions!
  // we need `this` in here to not be scoped to the outer scope.
  .get(function () {
    // `this` needs to be the instance of a school
    // 🚫 This is not the place where you might want to do async code if a virtual field is frequently accessed.
    // 👍 Try to keep things syncronous.

    // console.log("In virtual");
    return this.staff.length;
  });

const School = mongoose.model("school", school);

connect()
  .then(async (_conn) => {
    const mySchool = await School.create({
      name: "My School",
      staff: ["Elliott", "Harvey", "Maru"],
    });

    console.log(mySchool.staffCount);
  })
  .catch((e) => console.error(e));
