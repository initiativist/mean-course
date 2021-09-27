/*

Posts router, handles the creation, deletion, and editing of posts, as well as accessing the posts db

*/

// Package Imports
const express = require("express");
const multer = require("multer");

// Custom Imports
const Post = require("../models/post");

// Instantiate Router
const router = express.Router();

// Global constant for returning a more manageable filetype string
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

// Multer package for handling images
const storage = multer.diskStorage({
  // Test validity and callback to images folder on server
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  // Creating filename
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// handles new posts
router.post(
  "",
  // pull out image if it exists
  multer({ storage: storage }).single("image"),
  // handle request
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      // assign image path for frontend image access
      imagePath: url + "/images/" + req.file.filename,
    });
    // Use mongoose to place in database and then send a response with the post in it (for imagepath and id access)
    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    });
  }
);

// Used for updating posts
router.put(
  "/:id",
  // Processes file if it exists
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    // Debug Handling for rn
    console.log(req.file);
    // create post to update
    // TODO:Currently getting ID overwrite error
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
    });
    // Mongoose update function bsed on filter and return success response
    Post.updateOne({ _id: req.params.id }, post).then((result) => {
      console.log(result);
      res.status(200).json({ message: "update successful!" }); // TODO: should this be a 201 return?
    });
  }
);

// Get ALL posts
router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "posts fetched successfully!",
      posts: documents,
    });
  });
});

// Get Single Post
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    // Test for post exist
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "post not found" });
    }
  });
});

// Handles post delete
router.delete("/:id", (req, res, next) => {
  // Mongoose delete function (I think)
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Deleted" });
  });
});

// Externally Accessible resource
module.exports = router;
