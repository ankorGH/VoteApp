const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection
  .once("open", () => {
    console.log("We got a tight connection lets make fireworks");
  })
  .on("error", () => {
    console.log("error occured during connection");
  });
