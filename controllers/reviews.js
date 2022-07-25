const Review = require("../models/review")
const Campground = require('../models/campground.js');

module.exports.createReviews = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created a New Review');
    res.redirect("/campgrounds/" + campground._id);
}

module.exports.deleteReviews = async (req, res) => {
    //Destructuring
    console.log("deleted");
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted the review');
    res.redirect("/campgrounds/" + id);
}