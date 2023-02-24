const express = require("express");
const app = express();
const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const cors = require("cors");
const { JsonDB, Config } = require("node-json-db");
const multer = require("multer");
const path = require("path");

const PORT = 3001;

// JsonDB setup
const db = new JsonDB(new Config("sensors-db", true, false, "/"));

app.use(express.json());
app.use(cors());

// Multer setup
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads2/");
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

app.get("/", (req, res) => {
	res.json({ msg: "Working!" });
});

app.get("/api/init", async (req, res) => {
	try {
		const isConnected = await initArdiuno();

		if (!isConnected.success) {
			return res.status(401).json({ msg: "error", data: isConnected.msg });
		}

		const configs = await db.getData("/configs");

		port.on("open", () => {
			console.log("serial port open");
		});

		parser.on("data", (data) => {
			if (parseInt(data) > configs.length - 1) return;

			const currData = configs[parseInt(data)];
			if (lastVideoId !== currData.id) {
				// console.log(configs[parseInt(data)]);
				io.emit("digitalRead", { data: currData });
				lastVideoId = currData.id;
			}
		});

		res.json({ msg: "success", data: { configs } });
	} catch (error) {
		res.status(401).json({ msg: "error", data: error.message });
	}
});

app.get("/api/configs", async (req, res) => {
	try {
		const configurations = await db.getData("/configs");
		res.json({ msg: "success", data: configurations });
	} catch (error) {
		res.json({ msg: "error", data: error.message });
	}
});

app.patch("/api/configs", async (req, res) => {
	try {
		const configs = req.body.configs;

		const newConfigs = await db.push("/configs", configs, true);
		res.json({ msg: "success", data: newConfigs });
	} catch (error) {
		res.json({ msg: "error", data: error.message });
	}
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
	res.json({ msg: "success", filename: req.file.filename });
});

app.get("/api/upload/:filename", async (req, res) => {
	const { filename } = req.params;
	const file = path.join(__dirname, "uploads2", filename);
	res.sendFile(file);
});

io.on("connection", (socket) => {
	console.log("a user connected:", socket.id);

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

httpServer.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
