const express = require("express");
const router = express.Router({ mergeParams: true });
const CatchAsync = require("../utils/CatchAsync");
const ExpressErrors = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require('../schema.js');
const Campground = require('../models/campground.js');
const Review = require("../models/review")
const { validateReview } = require("../Middleware");


//Adding the Reviews
router.post("/", validateReview, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created a New Review');
    res.redirect("/campgrounds/" + campground._id);
}));

//Deleting the Review
router.delete("/:reviewID", CatchAsync(async (req, res) => {
    //Destructuring
    console.log("deleted");
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted the review');
    res.redirect("/campgrounds/" + id);
}))

module.exports = router;