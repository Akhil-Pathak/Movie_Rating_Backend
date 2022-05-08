require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_PASS,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);

const PORT = process.env.PORT || 8000;

require("./startup/db");

// Routers Import

const user_router = require("./components/users/user_main/user_router");
const user_authentication_router = require("./components/users/user_authentication/user_authentication_router");

app.get("/test", function (req, res) {
  res.send(`test working ${req.session.username}`);
});

app.use("/api", user_router);
app.use("/api", user_authentication_router);

app.listen(PORT, () => {
  console.info(chalk.blue.bold(`App listening at http://localhost:${PORT}`));
});
