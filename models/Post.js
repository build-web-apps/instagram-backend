const mongoose = require("mongoose");

//SCHEMA for Post
const InstaPostSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
  },
  comment: [],
});

module.exports = mongoose.model("insta_post", InstaPostSchema);
