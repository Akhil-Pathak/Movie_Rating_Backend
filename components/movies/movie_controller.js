const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const { MovieMain } = require("./movies_model");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const searchMovie = (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    MovieMain.aggregate([
      { $match: { name: { $regex: regex } } },
      {
        $project: {
          name: 1,
        },
      },
    ]).exec((err, movies) => {
      if (err) {
        return res.status(400).json({ status: "ERROR", errors: err, msg: "Can't Search Movie" });
      }
      return res.status(200).send({ status: "SUCCESS", movies: movies });
    });
  } else {
    return res.status(200).send({});
  }
};

module.exports = {
  searchMovie,
};
