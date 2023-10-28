const express = require("express");
const app = express();
const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const cors = require("cors");
var childProcess = require("child_process");

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

httpServer.listen(PORT, () => {
	const arg = process.argv[2];

	if (arg === "weight" || arg === "height") {
		childProcess.exec(
			`start chrome --kiosk http://localhost:3000/height-weight?mode=${arg}`,
			(err, stdout, stderr) => {
				if (err) {
					console.log(err);
					return;
				}
				if (!stdout) return;
				console.log(stdout);
			}
		);
		return;
	}

	if (arg) {
		childProcess.exec(
			`start chrome --kiosk http://localhost:3000/${arg || ""}`,
			(err, stdout, stderr) => {
				if (err) {
					console.log(err);
					return;
				}
				if (!stdout) return;
				console.log(stdout);
			}
		);
	}

	console.log(`Server started on port http://localhost:${PORT}`);
});
