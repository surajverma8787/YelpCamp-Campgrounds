const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CatchAsync = require('../utils/CatchAsync');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const users = require("../controllers/users");

router.get('/register', (users.renderRegister));

router.post('/register', CatchAsync(users.Register));

router.get("/login", (users.renderLogin));

router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.Login);

router.get("/logout", (users.Logout));

module.exports = router;