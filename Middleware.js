module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', "Please Sign In First");
        res.redirect("/login");
    }
    next();
}