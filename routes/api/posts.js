const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load post model of mongoose
const Post = require("../../models/Post");

// Load validation
const validatePostInput = require("../../validation/post");

// @route:  GET for api/posts/test
// @desc:   tests posts route
// @access: public
router.get("/test", (req, res) => res.json({ msg: "posts work for now" }));

// @route:  POST for api/posts
// @desc:   create new post
// @access: private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
