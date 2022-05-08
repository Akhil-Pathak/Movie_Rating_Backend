const mongoose = require("mongoose");

const { RatingMain } = require("./ratings_model");
const { MovieMain } = require("../movies/movies_model");

const updateRating = (req, res) => {
  if (req.session.user_id === undefined) {
    return res.status(400).json({ status: "ERROR", errors: "Login to Update Rating", msg: "Login to Update Rating" });
  }

  RatingMain.findOneAndUpdate(
    { user_id: mongoose.Types.ObjectId(req.session.user_id), movie_id: mongoose.Types.ObjectId(req.body.movie_id) },
    { $push: { ratings: parseFloat(req.body.updated_rating) } }
  )
    .exec()
    .then((ratingDoc) => {
      MovieMain.findOne({ _id: mongoose.Types.ObjectId(req.body.movie_id) }).exec((err, movieDocs) => {
        if (err) {
          throw new Error("Error in Updating Rating");
        } else {
          const newRating =
            (movieDocs.average_rating * movieDocs.number_of_ratings -
              parseFloat(ratingDoc.ratings[ratingDoc.ratings.length - 2]) +
              parseFloat(ratingDoc.ratings[ratingDoc.ratings.length - 1])) /
            movieDocs.number_of_ratings;
          console.log(newRating);
          movieDocs.average_rating = newRating;

          movieDocs.save().then(res.send({ status: "SUCCESS", msg: "Rating updated successfully" }));
        }
      });
    })
    .catch((err) => {
      return res.status(400).json({ status: "ERROR", errors: err, msg: "Can't Update Rating" });
    });
  //
};

module.exports = { updateRating };
