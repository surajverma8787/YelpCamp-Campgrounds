const express = require("express");
const router = express.Router({ mergeParams: true });
const CatchAsync = require("../utils/CatchAsync");
const ExpressErrors = require("../utils/ExpressError");
const { campgroundSchema } = require('../schema.js');
const Campground = require('../models/campground.js');
const Review = require("../models/review")

const validateCampgrounds = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressErrors(error.details, 400);
    }
    else {
        next();
    }

}
//Now making a Campground database
router.get("/", CatchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}));

//Making a new Campgrounds Page that have form to add camp
router.get("/new", CatchAsync((req, res, next) => {
    res.render("campgrounds/new.ejs");
}));

//Handling the Post request of the form
router.post("/", validateCampgrounds, CatchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //     throw new ExpressErrors('Invalid camp data', 400);
    const camp = new Campground(req.body.campground);
    await camp.save();
    var s = "/campgrounds/" + camp._id;
    res.redirect(s);
}))

//Searching a camp via its Id 
router.get("/:id", CatchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show.ejs", { campground });
}));


//Request for Editing the Camp
router.get("/:id/edit", CatchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    console.log(req.params.id);
    res.render("campgrounds/edit.ejs", { campground });
}));

//Updating the Camp
router.put("/:id", CatchAsync(async (req, res, next) => {
    console.log(req.body.campground);
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect("/campgrounds/" + campground._id);
}));

//Deleting any Camp
router.delete("/:id", CatchAsync(async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}))


module.exports = router;