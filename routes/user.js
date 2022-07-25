const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CatchAsync = require('../utils/CatchAsync');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const users = require("../controllers/users");

router.route("/register")
    .get((users.renderRegister))
    .post(CatchAsync(users.Register));

router.route('/login')
    .get((users.renderLogin))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.Login);

router.get("/logout", (users.Logout));

module.exports = router;