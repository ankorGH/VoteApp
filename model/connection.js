const mongoose = require("mongoose");
const keys = require("../config/config");

mongoose.connect(keys.mongoConnect);

mongoose.connection
  .once("open", () => {
    console.log("We got a tight connection lets make fireworks");
  })
  .on("error", () => {
    console.log("error occured during connection");
  });
