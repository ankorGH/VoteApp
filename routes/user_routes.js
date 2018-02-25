const router = require("express").Router();
const Users = require("../model/users");

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/signin");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  res.render("user", { user: req.user, all: null });
});

router.get("/all", authCheck, (req, res) => {
  Users.findOne({ username: req.user.username }, (err, user) => {
    if (err) throw err;
    res.render("user", { user: user, all: "yes" });
  });
});

// create route for changing user password
router.get("/changePassword", authCheck, (req, res) => {
  // console.log("got here");
});

module.exports = router;
