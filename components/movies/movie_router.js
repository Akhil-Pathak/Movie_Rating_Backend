const express = require("express");
const { check } = require("express-validator");

const { searchMovie } = require("./movie_controller");

const router = express.Router();

router.get("/movie/movie_controller/search", searchMovie);

module.exports = router;
