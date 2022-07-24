const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CatchAsync = require('../utils/CatchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', CatchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to YelpCamp');
        res.redirect('/campgrounds');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }


}));

module.exports = router;