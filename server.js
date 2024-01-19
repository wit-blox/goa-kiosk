const express = require("express");
const app = express();
const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const cors = require("cors");
const childProcess = require("child_process");
var waitOn = require("wait-on");

const PORT = 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// create a middleware to pass io to only the routes that need it
app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use("/api", require("./api"));

io.on("connection", (socket) => {
	console.log("a user connected:", socket.id);

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

const startChromeProcess = (command) => {
	childProcess.exec(command, (err, stdout, stderr) => {
		if (err) {
			console.log(err);
			return;
		}
		if (!stdout) return;
		console.log(stdout);
	});
};

httpServer.listen(PORT, () => {
	const arg = process.argv[2];

	const opts = {
		resources: ["tcp:3000"],
	};

	waitOn(opts).then(() => {
		if (arg === "weight" || arg === "height") {
			startChromeProcess(
				`start chrome --kiosk http://localhost:3000/height-weight?mode=${arg}`
			);
			return;
		}

		if (arg) {
			startChromeProcess(
				`start chrome --kiosk http://localhost:3000/${arg || ""}`
			);
		}
	});

	console.log(`Server started on port http://localhost:${PORT}`);
});
