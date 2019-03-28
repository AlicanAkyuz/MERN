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

// @route:  POST for api/posts/like/:id
// @desc:   like post
// @access: private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "User already liked this post" });
        }

        // Add user id to the likes array
        post.likes.unshift({ user: req.user.id });
        post.save().then(post => res.json(post));
      });
    });
  }
);

// @route:  POST for api/posts/unlike/:id
// @desc:   unlike post
// @access: private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: "You have not yet liked this post" });
        }

        // Get the remove index
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        // Delete from likes
        post.likes.splice(removeIndex, 1);

        // Save edited likes array
        post.save().then(post => res.json(post));
      });
    });
  }
);

// @route:  POST for api/posts/comment/:id
// @desc:   post a comment to a post
// @access: private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id).then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };

      // add new comment to comments array
      post.comments.unshift(newComment);

      // save
      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

module.exports = router;
