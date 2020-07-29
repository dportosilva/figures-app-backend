const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../config/keys").secret;
const User = require("../../model/User");

/**
 * @route POST api/users/register
 * @desc Register the user
 * @access Public
 */

router.post("/register", (req, res) => {
  let { email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.status(400).json({
      msg: "Password do not match",
    });
  }
  //check for the unique email
  User.findOne({
    email: email + "@cli.com",
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        msg: "Email is already taken",
      });
    } else {
      //the data is valid and now we can registe the user
      let newUser = new User({
        email,
        password,
      });
      //hash the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.email = newUser.email + "@cli.com";
          newUser.save().then((user) => {
            return res.status(201).json({
              success: true,
              msg: "User is now registered",
            });
          });
        });
      });
    }
  });
});

/**
 * @route POST api/users/login
 * @desc login the user
 * @access Public
 */

router.post("/login", (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (!user) {
      return res.status(404).json({
        msg: "Email not found",
        success: false,
      });
    }
    //if there is user, compare passwd
    bcrypt.compare(req.body.password, user.password).then((isMatch) => {
      if (isMatch) {
        //user's password is correct and send the token to that user
        const payload = {
          _id: user._id,
          email: user.email,
        };
        //token expira numa semana
        jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) => {
          res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
            msg: "You are now logged in",
          });
        });
      } else {
        return res.status(404).json({
          msg: "Incorrect password",
          success: false,
        });
      }
    });
  });
});

/**
 * @route Get api/users/profile
 * @desc Return user's data
 * @access Private
 */

router.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    return res.json({
      user: req.user,
    });
  }
);

/**
 * @route GET api/users/:
 * @desc Return one level's data
 * @access Public
 */

router.get("/users/:email", (req, res) => {
  User.findOne({ email: req.params.email }).then(function (err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
});

/**
 * @route GET api/users/users
 * @desc Return all user's data
 * @access Public
 */

router.get("/users", (req, res) => {
  User.find({}).then(function (users) {
    res.json(users);
  });
});

/**
 * @route PUT api/users/users/:email
 * @desc Modify the selected user's data
 * @access Public
 */

router.put("/users/:email", (req, res) => {
  User.findOneAndUpdate(
    { email: req.params.email },
    {
      email: req.body.email,
      password: req.body.password,
      levels: req.body.levels,
      sessions: req.body.sessions,
    }
  ).then(function (err, user) {
    if (err) {
      res.json(err);
    }
    res.json(user);
  });
});

/**
 * @route PUT api/users/update/:email
 * @desc Modify the selected user's data
 * @access Public
 */

router.put("/update/:email", (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) throw err;
      User.findOneAndUpdate(
        { email: req.params.email },
        {
          email: req.body.email,
          password: hash,
          levels: req.body.levels,
          sessions: req.body.sessions,
        }
      ).then(function (err, user) {
        if (err) {
          res.json(err);
        }
        res.json(user);
      });
    });
  });
});

/**
 * @route DELETE api/users/:email
 * @desc Delete user
 * @access Public
 */

router.delete("/users/:email", (req, res) => {
  User.findOneAndRemove({ email: req.params.email }).then(function (err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
});

module.exports = router;
