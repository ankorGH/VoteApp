const mongoose = require("mongoose");

mongoose.connect("mongodb://ankor:pass6789@ds247838.mlab.com:47838/voteapp");

mongoose.connection
  .once("open", () => {
    console.log("We got a tight connection lets make fireworks");
  })
  .on("error", () => {
    console.log("error occured during connection");
  });
