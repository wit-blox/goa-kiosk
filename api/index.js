const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.json({ msg: "Working" });
});

router.use("/vernier", require("./vernier-api"));
router.use("/sensors", require("./sensors-api"));
router.use("/reveal", require("./reveal-api"));
router.use("/height", require("./height-api"));
router.use("/weight", require("./weight-api"));

module.exports = router;
