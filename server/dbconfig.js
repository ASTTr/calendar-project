const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOOSE_URL);

const connection = mongoose.connection;
connection.on("connected", () => {
  console.log("connected to database !");
});

connection.on("error", (err) => {
  if (err) console.error(`error occured while connecting to database ${err}`);
  process.exit();
});
