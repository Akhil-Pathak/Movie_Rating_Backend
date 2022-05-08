const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const { UserAuthenticationDetails } = require("./user_authentication_model");

const loginUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  UserAuthenticationDetails.findOne({ user_email: email })
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error("No user found");
      } else if (user.lockout_state) {
        // If user if Locked out check the time and if more than 30 min reset
        const now = new Date();
        const lockoutStartTime = user.lockout_start_time;

        let timeDiff = (now.getTime() - lockoutStartTime.getTime()) / 60000;

        console.log(parseInt(timeDiff));

        if (parseInt(timeDiff) < 30) {
          throw new Error(`You have been locked out for ${parseInt(30 - timeDiff)} min`);
        } else {
          user.lockout_state = false;
          user.lockout_start_time = null;
          user.incorrect_attempts = 0;
          user.save();
          throw new Error(`Your Lockout have finished Please try logging in again`);
        }
      } else if (!user.lockout_state && user.incorrect_attempts === 4) {
        // Put user in Lockout if incorrect attempts is 4
        user.lockout_state = true;
        user.lockout_start_time = new Date();
        user.save();

        throw new Error("Too many incorrect attempts, You have been locked out for 30min");
      } else if (!user.authenticate(password)) {
        req.session.destroy();

        user.incorrect_attempts += 1;
        user.save();

        throw new Error("Wrong Password or Username");
      } else {
        req.session.username = user.username;

        user.incorrect_attempts = 0;
        user.lockout_state = false;
        user.save();

        return res.status(200).send({ status: "SUCCESS", msg: "Logged in Successfully" });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(400).json({ status: "ERROR", errors: err.message, msg: "Can't Login user" });
    });
};

module.exports = { loginUser };
