const mongoose = require("mongoose");
const Project = require("./project");
const cdnUrl = "https://cdn.adminapp.com";

const orgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subscription: {
    status: {
      type: String,
      required: true,
      default: ["active"],
      enum: ["active", "trialing", "overdue", "canceled"],
    },
    last4: {
      type: Number,
      min: 4,
      max: 4,
    },
  },
});

// Remove all the projects of a deleted organization
orgSchema.post("remove", async function (_, next) {
  const {id} = this;
  try {
    await Project.deleteMany({org: id});
    next();
  } catch (error) {
    return next(error);
  }
});

orgSchema.virtual("avatar").get(function () {
  return `${cdnUrl}/${this.id}`;
});

module.exports = mongoose.model("org", orgSchema);
