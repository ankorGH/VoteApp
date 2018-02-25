const router = require("express").Router();
const Users = require("../model/users");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const urlencodedParser = bodyParser.urlencoded({ extended: true });

const authCheck = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/auth/signin");
  }
};

router.get("/all", (req, res) => {
  Users.find({}, (err, users) => {
    res.render("allPolls", { user: req.user, allUsers: users });
  });
});

router.get("/show/:userid/:pollName", (req, res) => {
  let userUpdate = null;
  Users.findById(req.params.userid, (err, user) => {
    if (err) throw err;
    let pollIndex = user.polls.findIndex(poll => {
      return poll.name.trim() === req.params.pollName.trim();
    });
    if (pollIndex === -1) {
      res.end("poll was deleted");
    }
    if (req.user) {
      userUpdate = "yes";
    }
    let data = {
      user: req.user,
      poll: user.polls[pollIndex],
      pollOwner: user.id,
      update: userUpdate
    };
    res.render("poll", data);
  });
});

router.get("/update/:userid/:pollName", authCheck, (req, res) => {
  Users.findById(req.params.userid, (err, user) => {
    if (err) throw err;
    let pollIndex = user.polls.findIndex(poll => {
      return poll.name.trim() === req.params.pollName.trim();
    });
    res.render("updatePoll", { user: req.user, poll: pollIndex });
  });
});

router.post(
  "/update/:userid/:pollName",
  authCheck,
  urlencodedParser,
  (req, res) => {
    Users.findById(req.params.userid, (err, user) => {
      if (err) throw err;
      let pollIndex = user.polls.findIndex(poll => {
        return poll.name.trim() === req.params.pollName.trim();
      });
      let newOptions = req.body;
      for (option in newOptions) {
        user.polls[pollIndex].options.push({
          name: newOptions[option],
          size: 0
        });
      }
      user.save((err, user) => {
        res.redirect(`/poll/show/${user.id}/${user.polls[pollIndex].name}`);
      });
    });
  }
);

router.post("/show/:userid/:pollName", urlencodedParser, (req, res) => {
  Users.findById(req.params.userid, (err, user) => {
    if (err) throw err;
    let pollIndex = user.polls.findIndex(poll => {
      return poll.name.trim() === req.params.pollName.trim();
    });
    let optionIndex = user.polls[pollIndex].options.findIndex(option => {
      return option.name === req.body.customRadio;
    });

    user.polls[pollIndex].options[optionIndex]["size"]++;
    user.save((err, user) => {
      if (err) throw err;
      res.redirect(
        "/poll/show/" + req.params.userid + "/" + req.params.pollName
      );
    });
  });
});

router.post("/new", urlencodedParser, (req, res) => {
  let usersPost = req.body;
  if (req.user) {
    Users.findOne({ username: req.user.username }, (err, user) => {
      if (err) throw err;
      let poll = { name: req["body"]["name"], options: [] };
      for (option in usersPost) {
        if (option !== "name") {
          poll.options.push({ name: usersPost[option], size: 0 });
        }
      }
      user.polls.push(poll);
      user.save((err, product) => {
        // saved new poll
        if (err) throw err;
        res.redirect("/poll/show/" + req.user.id + "/" + poll.name);
      });
    });
  }
});

router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  Users.findOne({ username: req.user.username }, (err, user) => {
    if (err) throw err;
    let pollIndex = user.polls.findIndex(poll => {
      return poll.id === id;
    });
    user.polls.splice(pollIndex, 1);
    user.save((err, user) => {
      res.redirect("/profile/all");
    });
  });
});

function findPollIndex() {}
// router.get("/update/")

module.exports = router;
