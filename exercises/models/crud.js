const User = require("./user");

const getUserById = (id) => {
  // .exec() returns the real promise
  // only works for queries (anything that starts with find), not creating
  return User.findById(id).exec();
};

const getAllUsers = () => {
  return User.find({}).exec();
};

const createUser = (userDetails) => {
  return User.create(userDetails);
};
const removeUserById = (id) => {
  return User.findByIdAndDelete(id).exec();
};

const updateUserById = (id, update) => {
  return User.findByIdAndUpdate(id, update, {new: true}).exec();
};

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  removeUserById,
  updateUserById,
};
