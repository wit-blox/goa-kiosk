const express = require("express");
const app = express();
const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const cors = require("cors");

const PORT = 3001;

app.use(express.json());
app.use(cors());

// Arduino port setup
let activePort = null;
let port = null;
let parser = null;

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
	const isConnected = await initArdiuno();

	if (!isConnected.success) {
		return res.status(401).json({ msg: "error", data: isConnected.msg });
	}

	port.on("open", () => {
		console.log("serial port open");
	});

	parser.on("data", (data) => {
		let parsedData = data.replace("\r", "");
		const [pin, value] = parsedData.split("->");
		io.emit("digitalRead", { pin, value });
	});

	res.json({ msg: "success", data: "" });
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
