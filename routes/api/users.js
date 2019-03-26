const express = require("express");
const router = express.Router();

// @route:  GET for api/users/test
// @desc:   tests users route
// @access: public
router.get("/test", (req, res) => res.json({ msg: "users work for now" }));

module.exports = router;
