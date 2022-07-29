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
const { route } = require("./user");
const multer = require('multer');
const { storage } = require("../cloudinary/index");
const upload = multer({ storage: storage });


router.route('/')
    .get(CatchAsync(campgrounds.index))
    //.post(isLoggedin, validateCampgrounds,CatchAsync(campgrounds.createCampground));
    .post(upload.array('image'), (req, res) => {
        console.log('POST REQUESTS');
        console.log(req.body, req.files);
        res.send("IT WORKED");
    })

//Making a new Campgrounds Page that have form to add camp
router.get("/new", isLoggedin, CatchAsync(campgrounds.renderNewForm));

router.route('/:id')
    .get(CatchAsync(campgrounds.showCampground))
    .put(validateCampgrounds, isLoggedin, isAuthor, CatchAsync(campgrounds.updateCampground))
    .delete(isLoggedin, isAuthor, CatchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedin, isAuthor, CatchAsync(campgrounds.renderEditForm));


module.exports = router;