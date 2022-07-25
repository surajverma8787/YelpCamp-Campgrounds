const express = require("express");
const router = express.Router();
const CatchAsync = require("../utils/CatchAsync");
const ExpressErrors = require("../utils/ExpressError");
const { campgroundSchema, validate } = require('../schema.js');
const Campground = require('../models/campground.js');
const Review = require("../models/review")
const flash = require("connect-flash");
const { isLoggedin, isAuthor, validateCampgrounds, validateReview } = require("../Middleware");
const campground = require("../models/campground.js");
const campgrounds = require('../controllers/campgrounds');

//Now making a Campground database
router.get("/", CatchAsync(campgrounds.index));

//Making a new Campgrounds Page that have form to add camp
router.get("/new", isLoggedin, CatchAsync(campgrounds.renderNewForm));

//Handling the Post request of the form
router.post("/", isLoggedin, validateCampgrounds, CatchAsync(campgrounds.createCampground));

//Searching a camp via its Id 
router.get("/:id", CatchAsync(campgrounds.showCampground));


//Request for Editing the Camp
router.get("/:id/edit", isLoggedin, isAuthor, CatchAsync(campgrounds.renderEditForm));

//Updating the Camp
router.put("/:id", validateCampgrounds, isLoggedin, isAuthor, CatchAsync(campgrounds.updateCampground));

//Deleting any Camp
router.delete("/:id", isLoggedin, isAuthor, CatchAsync(campgrounds.deleteCampground))


module.exports = router;