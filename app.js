const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const Campground = require('./models/campground.js');
const ejsMate = require('ejs-mate');
const CatchAsync = require("./utils/CatchAsync");
const ExpressErrors = require("./utils/ExpressError");
const JOI = require('joi');
const { campgroundSchema, reviewSchema } = require('./schema.js');
const Review = require("./models/review")
const campgrounds = require("./routes/campgrounds");


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
//TO use ejs engine
app.engine('ejs', ejsMate);
//To parse the body data we use urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set View Engine to ejs to use the ejs files.
app.set('view engine', 'ejs');

// join is combining the views directory as public to path.
app.set('views', path.join(__dirname, 'views'));

app.use('/campgrounds', campgrounds);

app.get("/", (req, res) => {
    res.render("home.ejs");
});

//Adding the Validation to Reviews
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressErrors(error.details, 400);
    }
    else {
        next();
    }
}

//Adding the Reviews
app.post("/campgrounds/:id/reviews", validateReview, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect("/campgrounds/" + campground._id);
}));

//Deleting the Review
app.delete("/campgrounds/:id/reviews/:reviewID", CatchAsync(async (req, res) => {
    //Destructuring
    console.log("deleted");
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect("/campgrounds/" + id);
}))

//sending all request for all path the error
// app.all('*', (req, res, next) => {
//     next(new ExpressErrors("Page not Found", 404));
// })
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render('error', { err });
})
app.listen(3000, () => {
    console.log("Server started on Port 3000");
})