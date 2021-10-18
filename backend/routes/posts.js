const express = require("express");
const PostsController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, PostsController.newPost);

router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

router.get("", PostsController.getAllPosts);

router.get("/:id", PostsController.getSinglePost);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
