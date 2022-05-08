const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const { UserAuthenticationDetails } = require("../user_authentication/user_authentication_model");
const { UserMain } = require("./user_model");
const { MovieMain } = require("../../movies/movies_model");
const { RatingMain } = require("../../ratings/ratings_model");

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
      //   console.log(doc);
      return res.send({ status: "SUCCESS", msg: "User Registered Successfully" });
    })
    .catch((err) => {
      return res.status(400).json({ status: "ERROR", errors: err, msg: "Can't register user" });
    });
};

const addMovieAndRating = (req, res) => {
  if (req.session.user_id === undefined) {
    return res
      .status(400)
      .json({ status: "ERROR", errors: "Login to Add Movie to Profile", msg: "Login to Add Movie to Profile" });
  }
  const { movies, ratings } = req.body;
  movies.forEach((movie, index) => {
    MovieMain.findOne({ name: movie })
      .exec()
      .then((movieDocs) => {
        // Check If Movie exist if No,
        // Create Movie Doc
        // Create Rating Doc
        // Update User Doc movie array
        if (!movieDocs) {
          const newMovie = new MovieMain({
            name: movie,
            average_rating: parseFloat(ratings[index]),
          });
          newMovie
            .save()
            .then((newMovieDoc) => {
              const newRating = new RatingMain({
                movie_id: newMovieDoc._id,
                user_id: req.session.user_id,
                ratings: parseFloat(ratings[index]),
              });
              return newRating.save();
            })
            .then((ratingDoc) => {
              UserMain.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(req.session.user_id) },
                { $push: { added_movies: ratingDoc.movie_id } }
              ).exec((err, doc) => {
                if (err) {
                  throw new Error("Error in Updating Movies in Profile");
                }
              });
            });
        } else {
          const newNumberOfRatings = movieDocs.number_of_ratings + 1;
          const newRating =
            (movieDocs.average_rating * movieDocs.number_of_ratings + parseFloat(ratings[index])) / newNumberOfRatings;
          movieDocs.average_rating = newRating;
          movieDocs.number_of_ratings = newNumberOfRatings;

          movieDocs.save();

          RatingMain.findOneAndUpdate(
            { user_id: mongoose.Types.ObjectId(req.session.user_id), movie_id: movieDocs._id },
            { $push: { ratings: parseFloat(ratings[index]) } }
          )
            .exec()
            .then((ratingDoc) => {
              UserMain.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(req.session.user_id) },
                { $push: { added_movies: ratingDoc.movie_id } }
              ).exec((err, doc) => {
                if (err) {
                  throw new Error("Error in Updating Movies in Profile");
                }
              });
            });
        }
      })
      .catch((err) => {
        return res.status(400).json({ status: "ERROR", errors: err, msg: "Can't Add Movie" });
      });
    if (index + 1 == movies.length) {
      return res.send({ status: "SUCCESS", msg: "Movies Added Successfully in Profile" });
    }
  });
};

module.exports = {
  registerUser,
  addMovieAndRating,
};
