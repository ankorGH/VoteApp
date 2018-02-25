const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../model/users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    if (err) return done(err);
    done(null, user);
  });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!(username && password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);
