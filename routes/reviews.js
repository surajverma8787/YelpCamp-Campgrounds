const express = require("express");
const router = express.Router({ mergeParams: true });
const CatchAsync = require("../utils/CatchAsync");
const ExpressErrors = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require('../schema.js');
const Campground = require('../models/campground.js');
const Review = require("../models/review")

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
router.post("/", validateReview, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect("/campgrounds/" + campground._id);
}));

//Deleting the Review
router.delete("/:reviewID", CatchAsync(async (req, res) => {
    //Destructuring
    console.log("deleted");
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect("/campgrounds/" + id);
}))

module.exports = router;