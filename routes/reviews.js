const express = require("express");
const router = express.Router({ mergeParams: true });
const CatchAsync = require("../utils/CatchAsync");
const ExpressErrors = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require('../schema.js');
const Campground = require('../models/campground.js');
const Review = require("../models/review")
const { validateReview, isLoggedin, isReviewAuthor } = require("../Middleware");
const reviews = require('../controllers/reviews');


//Adding the Reviews
router.post("/", isLoggedin, validateReview, CatchAsync(reviews.createReviews));

//Deleting the Review
router.delete("/:reviewID", isLoggedin, isReviewAuthor, CatchAsync(reviews.deleteReviews))

module.exports = router;