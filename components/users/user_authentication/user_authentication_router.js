const express = require("express");
const { loginUser } = require("./user_authentication_controller");
const { check, body, validationResult } = require("express-validator");

const router = express.Router();

router.post("/user/login", check("email").isEmail().withMessage("Not a Correct Email").normalizeEmail(), loginUser);

module.exports = router;
