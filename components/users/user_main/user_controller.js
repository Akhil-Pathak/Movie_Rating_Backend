const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const { UserAuthenticationDetails } = require("../user_authentication/user_authentication_model");
const { UserMain } = require("./user_model");

const registerUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, age, username, email, password } = req.body;

  const newUserAuthenticationDetails = new UserAuthenticationDetails({
    username: username,
    user_email: email,
    password: password,
  });

  newUserAuthenticationDetails
    .save()
    .then((doc) => {
      const newUserMain = new UserMain({
        name: name,
        age: parseInt(age),
        authentication_detials: doc._id,
      });
      return newUserMain.save();
    })
    .then((doc) => {
      console.log(doc);
      return res.send({ status: "SUCCESS", msg: "User Registered Successfully" });
    })
    .catch((err) => {
      return res.status(400).json({ status: "ERROR", errors: err, msg: "Can't register user" });
    });
};

const updateMovie = (req, res) => {
  console.log("called");
};

module.exports = {
  registerUser,
  updateMovie,
};
