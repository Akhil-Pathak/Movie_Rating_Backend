const mongoose = require("mongoose");

const RatingSchema = mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MovieMain",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserMain",
  },
  ratings: [
    {
      type: Number,
    },
  ],
});

const RatingMain = mongoose.model("RatingMain", RatingSchema);

module.exports = { RatingMain };
