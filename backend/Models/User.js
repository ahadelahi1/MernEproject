let mongoose = require("mongoose");

let user_schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  Record_time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("users", user_schema);
