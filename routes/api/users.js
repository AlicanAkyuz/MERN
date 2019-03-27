const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateInputRegister = require("../../validation/register");
const validateInputLogin = require("../../validation/login");

// Load user model of mongoose
const User = require("../../models/User");

// @route:  GET for api/users/test
// @desc:   tests users route
// @access: public
router.get("/test", (req, res) => res.json({ msg: "users work for now" }));

// @route:  GET for api/users/register
// @desc:   register a user
// @access: public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateInputRegister(req.body);

  // Check validation
  if (!isValid) {
    res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    // check if email already exists
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json({ errors });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route:  GET for api/users/login
// @desc:   finds user by email in db, checks for pwd and returns Json token
// @access: public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateInputLogin(req.body);

  // Check validation
  if (!isValid) {
    res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = "user not found!";
      return res.status(404).json({ email: errors });
    }

    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // user matched: create jwt payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        //sign token through jsonwebtoken
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "password incorrect";
        return res.status(400).json({ password: errors });
      }
    });
  });
});

// @route:  GET for api/users/current
// @desc:   return current user
// @access: private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
module.exports = router;
