const express = require("express");

const app = express();

app.use("/auth", require("./auth"))
app.use("/tasks", require("./tasks"))
app.use("/chat", require("./chat"))
app.use("/users", require("./users"))

module.exports = app;