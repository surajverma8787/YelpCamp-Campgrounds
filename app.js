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
const Joi = require("joi");


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

app.get("/", (req, res) => {
    res.render("home.ejs");
});

//Now making a Campground database
app.get("/campgrounds", CatchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}));

//Making a new Campgrounds Page that have form to add camp
app.get("/campgrounds/new", CatchAsync((req, res, next) => {
    res.render("campgrounds/new.ejs");
}));

//Handling the Post request of the form
app.post("/campgrounds", CatchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //     throw new ExpressErrors('Invalid camp data', 400);
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.string().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressErrors(error.details, 400);
    }
    const camp = new Campground(req.body.campground);
    await camp.save();
    var s = "/campgrounds/" + camp._id;
    res.redirect(s);
}))

//Searching a camp via its Id 
app.get("/campgrounds/:id", CatchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show.ejs", { campground });
}));


//Request for Editing the Camp
app.get("/campgrounds/:id/edit", CatchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit.ejs", { campground });
}));

//Updating the Camp
app.put("/campgrounds/:id", CatchAsync(async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect("/campgrounds/" + campground._id);
}));

//Deleting any Camp
app.delete("/campgrounds/:id", CatchAsync(async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}))

//sending all request for all path the error
app.all('*', (req, res, next) => {
    next(new ExpressErrors("Page not Found", 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render('error', { err });
})
app.listen(3000, () => {
    console.log("Server started on Port 3000");
})