const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Campground = require('./models/campground.js');

//added the useNewUrlParser flag to 
//allow users to fall back to the old parser if they find a bug in the new parser.

/*
useCreateIndex: Again previously MongoDB used an ensureIndex function call to 
ensure that Indexes exist and, if they didn't, to create one. 
This too was deprecated in favour of createIndex. the useCreateIndex option 
ensures that you are using the new function calls.
*/
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
});

// Set View Engine to ejs to use the ejs files.
app.set('view engine', 'ejs');

// join is combining the views directory as public to path.
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

//Now making a Campground database
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
});
app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show.ejs", { campground });
});
app.listen(3000, () => {
    console.log("Server started on Port 3000");
})