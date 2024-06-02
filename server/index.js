const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

require("./dbconfig");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb" }));

app.listen(process.env.PORT, (req, res) => {
  console.log(`connected to port ${process.env.PORT}`);
});

app.use("/api", require("./routes/route"));
