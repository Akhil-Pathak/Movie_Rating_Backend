const mongoose = require("mongoose");

const UserMainSchema = mongoose.Schema({
  authentication_detials: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAuthenticationDetails",
  },
  // ratings: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     // ref: "UserAuthenticationDetails",
  //   },
  // ],
  added_movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MovieMain",
    },
  ],
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const UserMain = mongoose.model("UserMain", UserMainSchema);

module.exports = { UserMain };
