const express = require("express");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const multer = require("multer");

const { db } = require("../utils/db");

// Multer setup
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "reveal-files/");
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

		const configurations = await db.getData("/reveal-configs");

		port.on("open", () => {
			console.log("serial port open");
		});

		// parser.on("data", (data) => {
		// 	console.log("data -> ", data);
		// 	// const measurement = data.split(" ")[0];
		// 	// if (measurement === lastMeasurement) return;
		// 	// lastMeasurement = measurement;

		// 	// const found = configurations.find(
		// 	// 	(config) =>
		// 	// 		parseFloat(config.min) <= measurement &&
		// 	// 		parseFloat(config.max) >= measurement
		// 	// );
		// 	// if (!found) return;
		// 	// if (found.id === lastVideoId) return;
		// 	// lastVideoId = found.id;
		// 	// // console.log("found", measurement, "->", found);
		// 	// req.io.emit("new-video", { ...found, measurement });
		// });

		// const socket = req.app.get("socket");
		// console.log(socket.id, " connected");

		res.json({ msg: "success", data: { configs: configurations } });
	} catch (error) {
		res.status(401).json({ msg: "error", data: error.message });
	}
});

router.get("/on", (req, res) => {
	if (!port) return res.json({ msg: "error", data: "port not initialized" });
	const pin = req.query.pin;
	port.write(`${pin}\n`, (err) => {
		if (err) return res.json({ msg: "error", data: err.message });
		console.log("Last pin on: ", pin);
	});

	res.json({ msg: "success", data: "pin sent" });
});

router.get("/configs", async (req, res) => {
	try {
		const configurations = await db.getData("/reveal-configs");
		res.json({ msg: "success", data: configurations });
	} catch (error) {
		res.json({ msg: "error", data: error.message });
	}
});

router.patch("/configs", async (req, res) => {
	const configs = req.body.configs;

	await db.push(
		"/reveal-configs",
		{
			videos: configs,
		},
		true
	);
	res.json({ msg: "success", data: configs });
});

router.post("/upload", upload.single("file"), async (req, res) => {
	res.json({ msg: "success", filename: req.file.filename });
});

router.post("/upload-multiple", upload.array("files"), async (req, res) => {
	const result = req.files.map((f) => {
		return {
			filename: f.filename,
			id: uuidv4(),
		};
	});
	res.json({ msg: "success", files: result });
});

router.get("/upload/:filename", async (req, res) => {
	const { filename } = req.params;
	const file = path.join(__dirname, "../reveal-files", filename);
	res.sendFile(file);
});

module.exports = router;
