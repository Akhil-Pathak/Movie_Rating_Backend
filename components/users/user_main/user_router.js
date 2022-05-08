const express = require("express");
const { registerUser } = require("./user_controller");
const { check, body, validationResult } = require("express-validator");

const router = express.Router();

router.post(
  "/user/user_controller/create_user",
  check("email").isEmail().withMessage("Please Input a correct Email").normalizeEmail(),
  check("password").isLength({ min: 5 }).withMessage("must be at least 3 chars long"),
  registerUser
);

module.exports = router;
