const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.json({ msg: "Working" });
});

router.use("/vernier", require("./vernier-api"));
router.use("/sensors", require("./sensors-api"));

module.exports = router;
