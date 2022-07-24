const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CatchAsync = require('../utils/CatchAsync');
const passport = require("passport");
const LocalStrategy = require("passport-local");

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', CatchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err)
                return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }


}));

router.get("/login", (req, res) => {
    res.render('users/login');
});

router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {

    req.flash('success', 'Logged In');
    const path = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(path);
});

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Logged Out");
        res.redirect("/campgrounds");
    });

})

module.exports = router;