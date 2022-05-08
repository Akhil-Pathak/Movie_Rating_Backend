const mongoose = require("mongoose"); // or the database can be mongo depending upon the requirement
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const UserAuthenticationDetailsSchema = new mongoose.Schema({
  username: {
    type: String,
    default: null,
    unique: true,
  },

  user_email: {
    type: String,
    unique: true,
  },

  salt: String,

  user_encrypted_password: {
    type: String,
    require: true,
  },

  last_login_time: {
    type: Date,
    default: null,
  },

  incorrect_attempts: {
    type: Number,
    default: 0,
  },
  lockout_start_time: {
    type: Date,
    default: null,
  },
  lockout_state: {
    type: Boolean,
    default: false,
    required: true,
  },
});

UserAuthenticationDetailsSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.user_encrypted_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

UserAuthenticationDetailsSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.user_encrypted_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex");
    } catch (err) {
      return "";
    }
  },
};

const UserAuthenticationDetails = mongoose.model("UserAuthenticationDetails", UserAuthenticationDetailsSchema);

module.exports = { UserAuthenticationDetails };
