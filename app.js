const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const Campground = require('./models/campground.js');
const ejsMate = require('ejs-mate');
const CatchAsync = require("./utils/CatchAsync");
const ExpressErrors = require("./utils/ExpressError");
const session = require("express-session");
const JOI = require('joi');
const { campgroundSchema, reviewSchema } = require('./schema.js');
const Review = require("./models/review")
const userRoutes = require("./routes/user")
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


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
app.use(express.static('public'));

const sessionConfig = {
    secret: "10thMarch",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 ** 60 * 24 * 7,
        maxAge: 1000 * 60 ** 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set View Engine to ejs to use the ejs files.
app.set('view engine', 'ejs');

// join is combining the views directory as public to path.
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use("/", userRoutes);
app.use('/campgrounds', campgroundsRoutes);

app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get("/", (req, res) => {
    res.render("home.ejs");
});

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