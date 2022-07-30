const { campgroundSchema, validate } = require('./schema.js');
const ExpressErrors = require("./utils/ExpressError");
const Campground = require('./models/campground.js');
const Review = require("./models/review");
const { reviewSchema } = require('./schema.js');

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalURL;
        req.flash('error', "Please Sign In First");
        res.redirect("/login");
    }
    next();
}

module.exports.validateCampgrounds = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressErrors(error.details, 400);
    }
    else {
        next();
    }

}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Permission Required By Author For Changes');
        return res.redirect('/campgrounds/' + id);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressErrors(error.details, 400);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (review && !review.author.equals(req.user._id)) {
        req.flash('error', 'Only Authorized Users can Access');
        return res.redirect('/campgrounds/' + id);
    }
    next();
}