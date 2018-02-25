const passport = require("passport");
const express = require("express");
const app = express();
const passportConfig = require("./config/passport_config");
const AuthRoute = require("./routes/auth_routes");
const PollRoute = require("./routes/poll_routes");
const UserRoute = require("./routes/user_routes");
const CookieSession = require("cookie-session");

const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(
  CookieSession({
    name: "_votingapp",
    keys: [process.env.COOKIE],
    maxAge: 24 * 60 * 60 * 1000
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", AuthRoute);
app.use("/profile", UserRoute);
app.use("/poll", PollRoute);

app.get("/", (req, res) => {
  res.render("home", { user: req.user, err: null });
});

app.listen(PORT, () => console.log(`listening to port ${PORT}`));
