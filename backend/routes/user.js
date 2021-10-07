// Package Imports
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Instantiate Router
const router = express.Router();

// Custom Imports
const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "auth failed1",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        res.status(401).json({
          message: "auth failed2",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "oddly-particular-secret".repeat(10),
        { expiresIn: "1h" }
      ); // This is extremely insecure??
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: "auth failed3",
      });
    });
});

module.exports = router;
