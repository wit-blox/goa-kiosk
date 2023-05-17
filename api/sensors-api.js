const express = require("express");
const router = express.Router();
const path = require("path");

const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const multer = require("multer");

const { db } = require("../utils/db");
const { replaceFileNameSpaces } = require("../helpers");

// Multer setup
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "sensor-files/");
	},
	filename: function (req, file, cb) {
		cb(null, replaceFileNameSpaces(file.originalname));
	},
});

const upload = multer({ storage: storage });

// Arduino port setup
let activePort = null;
let port = null;
let parser = null;

let lastVideoId = null;

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
		console.log("Initializing Serial port");
		const isConnected = await initArdiuno();

		if (!isConnected.success) {
			return res.status(401).json({ msg: "error", data: isConnected.msg });
		}

		const configs = await db.getData("/sensor-configs");

		port.on("open", () => {
			console.log("serial port open");

			res.json({ msg: "success", data: { configs } });
		});

		port.on("error", (err) => {
			console.log("Error: ", err.message);
			res.json({ msg: "error", data: err.message });
		});

		parser.on("data", (data) => {
			if (data.split("")[0] === "o") {
				lastVideoId = configs.defaultVideo;
				req.io.emit("new-video", {
					data: { id: "default", video: configs.defaultVideo },
				});
				return;
			}

			if (parseInt(data) > configs.videos.length - 1) return;

			// console.log("Sensor data -> ", data);

			const currData = configs.videos[parseInt(data)];

			if (lastVideoId !== currData?.id) {
				// console.log(configs[parseInt(data)]);
				req.io.emit("new-video", { data: currData });
				// console.log("new video", currData);
				lastVideoId = currData?.id;
			}
		});
	} catch (error) {
		res.status(401).json({ msg: "error", data: error.message });
	}
});

router.get("/configs", async (req, res) => {
	try {
		const configurations = await db.getData("/sensor-configs");
		res.json({ msg: "success", data: configurations });
	} catch (error) {
		res.json({ msg: "error", data: error.message });
	}
});

router.patch("/configs", async (req, res) => {
	try {
		const configs = req.body.configs;

		await db.push("/sensor-configs", configs, true);

		res.json({ msg: "success", data: configs });
	} catch (error) {
		res.json({ msg: "error", data: error.message });
	}
});

router.post("/upload", upload.single("file"), async (req, res) => {
	const fileName = replaceFileNameSpaces(req.file.filename);
	res.json({ msg: "success", filename: fileName });
});

router.get("/upload/:filename", async (req, res) => {
	const { filename } = req.params;
	const file = path.join(
		__dirname,
		"../sensor-files",
		replaceFileNameSpaces(filename)
	);
	res.sendFile(file);
});

module.exports = router;
