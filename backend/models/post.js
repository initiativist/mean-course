// Backend Post model (Also has _id)

const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
});

// Externally Accessible
module.exports = mongoose.model("Post", postSchema);
