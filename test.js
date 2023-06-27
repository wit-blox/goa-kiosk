const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const port = new SerialPort({
	path: "COM6",
	baudRate: 9600,
});

const parser = new ReadlineParser({ delimiter: "\n" });
port.pipe(parser);

port.on("open", () => {
	console.log("serial port open");

	setTimeout(() => {
		port.write("H", (err) => {
			if (err) {
				console.log(err);
			}
		});
	}, 3000);

	// setTimeout(() => {
	// 	port.write("L", (err) => {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 	});
	// }, 6000);
});

parser.on("data", (data) => {
	console.log("recieved: ", data);
});

parser.on("error", (err) => {
	console.log(err);
});
