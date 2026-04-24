
const express = require("express");
const cors = require("cors");
const routes = require("./routes/bfhlRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/bfhl", routes);

module.exports = app;
