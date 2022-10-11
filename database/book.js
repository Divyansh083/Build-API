const mongoose = require("mongoose");

//Creating Book Schema
const BookSchema = mongoose.Schema({
  ISBN: String,
  title: String,
  pubDate: String,
  language: String,
  numPage: Number,
  author: [Number],
  publication: Number,
  category: [String],
});

//Creating Book Model
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;
