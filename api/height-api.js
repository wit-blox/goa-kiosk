const express = require("express");
const router = express.Router();
const path = require("path");

const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const multer = require("multer");

const { db } = require("../utils/db");

// Multer setup
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "height-files/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

// Arduino port setup
let activePort = null;
let port = null;
let parser = null;

let lastVideoId = null;
let lastMeasurement = 0;

async function initArdiuno() {
	const availablePorts = await SerialPort.list();
	activePort = availablePorts.find((port) => port.productId);

	if (!activePort) {
		return {
			success: false,
			msg: "Please connect the arduino",
		};
	}

	if (!port) {
		port = new SerialPort({
			path: activePort.path,
			baudRate: 9600,
		});
		parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));
	}

	return { success: true };
}

router.get("/init", async (req, res) => {
	try {
		const isConnected = await initArdiuno();

		if (!isConnected.success) {
			return res.status(401).json({ msg: "error", data: isConnected.msg });
		}

		const configurations = await db.getData("/height-configs");

		port.on("open", () => {
			console.log("serial port open");
		});

		let matchCounter = 0;

		parser.on("data", (data) => {
			const measurement = parseInt(data);
			// console.log("data -> ", measurement);
			// if (measurement === lastMeasurement) {
			// 	matchCounter = matchCounter + 1;
			// 	return;
			// }
			// lastMeasurement = measurement;

			// const found = configurations.find(
			// 	(config) =>
			// 		parseFloat(config.min) <= measurement &&
			// 		parseFloat(config.max) >= measurement
			// );
			req.io.emit("new-measurement", { measurement: measurement });
		});

		res.json({ msg: "success", data: { configs: configurations } });
	} catch (error) {
		res.status(401).json({ msg: "error", data: error.message });
	}
});

router.get("/configs", async (req, res) => {
	try {
		const configurations = await db.getData("/height-configs");
		res.json({ msg: "success", data: configurations });
	} catch (error) {
		res.json({ msg: "error", data: error.message });
	}
});

router.patch("/configs", async (req, res) => {
	const configs = req.body.configs;

	await db.push("/height-configs", configs, true);
	res.json({ msg: "success", data: configs });
});

router.post("/upload", upload.single("file"), async (req, res) => {
	res.json({ msg: "success", filename: req.file.filename });
});

router.get("/upload/:filename", async (req, res) => {
	const { filename } = req.params;
	const file = path.join(__dirname, "../height-files", filename);
	res.sendFile(file);
});

module.exports = router;
