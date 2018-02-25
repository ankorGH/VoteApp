const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
const User = require("../model/users");
const passport = require("passport");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/signin", (req, res) => {
  res.render("signin", { user: null, err: null });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: null, err: null });
});

router.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post(
  "/signin",
  urlencodedParser,
  passport.authenticate("local", { failureRedirect: "/auth/signin" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.post("/signup", urlencodedParser, (req, res) => {
  if (req.body.password !== req.body.confirmpassword) {
    res.render("signup", { user: null, err: "Password is not the same" });
  } else {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    User.findOne({ username: newUser.username }, (err, oldUser) => {
      if (err) throw err;

      if (oldUser)
        return res.render("signup", { user: null, err: "username is taken" });
      else {
        newUser.save((err, user) => {
          if (err) throw err;
          console.log("user saved to db");
          res.redirect("/auth/signin");
        });
      }
    });
  }
});

module.exports = router;
