const mongoose = require("mongoose");
require("dotenv").config();
const chalk = require("chalk");
const DATABASE_URI = process.env.DATABASE;

console.log();

mongoose
  .connect(DATABASE_URI)
  .then(() => {
    console.info(chalk.green.bold("Connected to database"));
  })
  .catch((err) => {
    console.log(chalk.red(err));
  });
