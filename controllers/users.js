const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.Register = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.Login = (req, res) => {

    req.flash('success', 'Logged In');
    const path = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(path);
}

module.exports.Logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Logged Out");
        res.redirect("/campgrounds");
    });

}