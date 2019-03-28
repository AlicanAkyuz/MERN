const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load post model of mongoose
const Post = require("../../models/Post");
// Load profile model of mongoose
const Profile = require("../../models/Profile");

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

// @route:  GET for api/posts
// @desc:   get all posts
// @access: public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route:  GET for api/posts/:id
// @desc:   get single post by id
// @access: public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that id" })
    );
});

// @route:  DELETE for api/posts/:id
// @desc:   delete post by id
// @access: private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        // check for post owner
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ notauthorized: "User not authorized to delete this post" });
        }
        // delete post
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(404).json({ nopostfound: "No post found with that id" })
          );
      });
    });
  }
);

module.exports = router;
