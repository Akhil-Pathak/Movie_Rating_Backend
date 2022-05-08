const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  number_of_ratings: {
    type: Number,
    default: 1,
  },
  average_rating: {
    type: Number,
  },
});
MovieSchema.index({ name: "text" });

const MovieMain = mongoose.model("MovieMain", MovieSchema);

module.exports = { MovieMain };
