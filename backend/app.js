// MongoDB Atlas Logins:
// username: Spider
// password A4JfR3xbSdlGqWR2

// Package Imports
const express = require('express');
const mongoose = require('mongoose');

// Javascript imports
const path = require("path")

// Custom Imports
const postRoutes = require("./routes/posts")
const userRoutes = require("./routes/user")

// Instantiate express app
const app = express();

// Using mongoose package as ORM for MongoDB
mongoose.connect('mongodb+srv://Spider:A4JfR3xbSdlGqWR2@cluster0.oypa8.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection to database failed!");
  });

// Turn request into json and process incoming url
app.use(express.json()); // used to be bodyParser, but that's deprecated.
app.use(express.urlencoded({extended: false}));

// Parse images url to correct location
app.use("/images", express.static(path.join("backend/images")));

// Handles CORS errors for server access and header types
app.use((req,res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

// Posts router
app.use("/api/posts", postRoutes)
app.use("/api/user", userRoutes)

// Externaly accessible
module.exports = app;

