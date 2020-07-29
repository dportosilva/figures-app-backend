const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../config/keys").secret;
const Session = require("../../model/Session");
const User = require("../../model/User");
const Level = require("../../model/Level");

/**
 * @route POST api/sessions/begin/:user/:level
 * @desc Begin the session
 * @access Public
 */

router.post("/begin/:user/:level", (req, res) => {
  Level.findOne({ number: req.params.level }).then((level) => {
    if (!level) {
      return res.status(400).json({
        msg: "Level not found",
      });
    } else {
      let newSession = new Session({});
      newSession.level = req.params.level;
      sessionId = newSession._id;
      //check for User
      User.findOne({
        _id: req.params.user,
      }).then((user) => {
        if (!user) {
          return res.status(400).json({
            msg: "User not found",
          });
        } else {
          user.sessions.push(sessionId);
          user.save().then((user) => {
            return res.status(201).json({
              success: true,
              msg: "Session registered on User",
            });
          });
          newSession.save().then((session) => {
            return res.status(201).json({
              success: true,
              msg: "Session registered",
            });
          });
        }
      });
    }
  });
});

/**
 * @route POST api/sessions/end/:id
 * @desc End the session
 * @access Public
 */

router.post("/end/:id", (req, res) => {
  //check for Session
  Session.findById({
    _id: req.params.id,
  }).then((session) => {
    if (!session) {
      return res.status(400).json({
        msg: "Session not found",
      });
    } else {
      const current_date = new Date();
      var delta = Math.abs(current_date - session.date) / 1000;
      var days = Math.floor(delta / 86400);
      var hours = Math.floor(delta / 3600) % 24;
      var minutes = Math.floor(delta / 60) % 60;
      var seconds = Math.floor(delta % 60);
      session.finished = true;
      session.elapsetime = hours + ":" + minutes + ":" + seconds;
      session.score = 99;
      session.save().then((session) => {
        return res.status(201).json({
          success: true,
          msg: "Session terminated",
        });
      });
    }
  });
});

/**
 * @route POST api/sessions/get
 * @desc Return all sessions's
 * @access Private
 */

router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(201).json({
      session: req.session,
    });
  }
);

/**
 * @route GET api/sessions/get/:id
 * @desc Return one session's data
 * @access Public
 */

router.get("/get/:id", (req, res) => {
  Session.findById({ _id: req.params.id }).then((session) => {
    if (!session) {
      return res.status(400).json({
        msg: "Session not found",
      });
    } else {
      res.json(session);
    }
  });
});

/**
 * @route DELETE api/sessions/delete/:user/:session
 * @desc Delete session
 * @access Private
 */

router.delete("/delete/:user/:session", (req, res) => {
  Session.findByIdAndRemove({ _id: req.params.session }).then((session) => {
    if (!session) {
      return res.status(400).json({
        msg: "Session not found",
      });
    } else {
      User.findOne({
        _id: req.params.user,
      }).then((user) => {
        if (!user) {
          return res.status(400).json({
            msg: "User not found",
          });
        } else {
          user.sessions.remove(req.params.session);
          user.save().then((user) => {
            return res.status(201).json({
              success: true,
              msg: "Session removerd from User",
            });
          });
        }
      });
      return res.status(201).json({
        success: true,
        msg: "Session deleted",
      });
    }
  });
});

module.exports = router;
