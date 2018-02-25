const mongoose = require("mongoose");
const ConnectDB = require("./connection");
const Schema = mongoose.Schema;

const option = new Schema({
  name: String,
  size: Number
});

const poll = new Schema({
  name: String,
  options: [option]
});

const user = new Schema({
  username: String,
  password: String,
  polls: [poll]
});

const User = mongoose.model("user", user);

module.exports = User;
