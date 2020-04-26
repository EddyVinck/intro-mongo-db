const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const connect = (url, options = {}) => mongoose.connect(url, options);

module.exports = connect;
