// MongoDB Atlas Logins:
// username: Spider
// password A4JfR3xbSdlGqWR2

const express = require('express');
const mongoose = require('mongoose');
const path = require("path")

const postRoutes = require("./routes/posts")

const app = express();

mongoose.connect('mongodb+srv://Spider:A4JfR3xbSdlGqWR2@cluster0.oypa8.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection to database failed!");
  });

app.use(express.json()); // used to be bodyParser, but that's deprecated.
app.use(express.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req,res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

app.use("/api/posts", postRoutes)

module.exports = app;

