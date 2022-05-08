const express = require("express");
const { updateRating } = require("./ratings_controller");

const router = express.Router();

router.post("/rating/rating_controller/update_rating", updateRating);

module.exports = router;
