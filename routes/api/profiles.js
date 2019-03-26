const express = require("express");
const router = express.Router();

// @route:  GET for api/profiles/test
// @desc:   tests profiles route
// @access: public
router.get("/test", (req, res) => res.json({ msg: "profiles work for now" }));

module.exports = router;
