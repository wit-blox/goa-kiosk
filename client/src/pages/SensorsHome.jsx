import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { API_URL } from "../configs";

const socket = io(API_URL);

const SensorsHome = () => {
	const [apiError, setApiError] = useState(null);
	const [currVideo, setCurrVideo] = useState(null);
	const [defaultVideo, setDefaultVideo] = useState(null);

	useEffect(() => {
		axios
			.get("/api/sensors/init")
			.then(({ data }) => {
				if (data.msg !== "success") return setApiError(data.msg);

				setDefaultVideo(data.data.configs.defaultVideo);
			})
			.catch((err) => {
				setApiError(err.response.data.data);
			});
	}, []);

	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected to socket");
		});

		socket.on("disconnect", () => {
			console.log("disconnected from socket");
		});

		socket.on("new-video", (data) => {
			setCurrVideo(data.data.video);
		});

		return () => {
			socket.off("connect");
			socket.off("new-video");
			socket.off("disconnect");
		};
	}, []);

	return (
		<div>
			{apiError && (
				<div className="text-center mt-10">
					<h1 className="text-2xl">{apiError && apiError}</h1>
					<p>
						If you have connected the arudino, still seeing this?{" "}
						<button
							onClick={() => {
								window.location.reload();
							}}
							className="text-blue-500"
						>
							Click Here
						</button>
					</p>
					<p>
						Link for{" "}
						<Link to="/sensors-dashboard" className="text-blue-500">
							dashboard
						</Link>
					</p>
				</div>
			)}
			{currVideo || defaultVideo ? (
				<video
					src={`${API_URL}/api/sensors/upload/${
						currVideo ? currVideo : defaultVideo
					}`}
					autoPlay
					muted
					loop
					className="w-full h-full fixed top-0 left-0 object-contain bg-black"
				/>
			) : (
				<div className="text-center mt-10">
					{!apiError && (
						<>
							<h1 className="text-4xl ">No video to display</h1>
							<Link
								className="text-blue-500 text-center"
								to="/sensors-dashboard"
							>
								Click here to change configurations
							</Link>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default SensorsHome;
