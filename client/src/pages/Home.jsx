import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { API_URL } from "../configs";

const socket = io(API_URL);

const Home = () => {
	const [apiError, setApiError] = useState(null);
	const [currVideo, setCurrVideo] = useState(null);
	const [defaultVideo, setDefaultVideo] = useState(null);

	useEffect(() => {
		axios
			.get("/api/init")
			.then(({ data }) => {
				if (data.msg !== "success") return setApiError(data.msg);
				console.log(data.data);

				setDefaultVideo(data.data.configs[0].video);
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

		socket.on("measurement", (data) => {
			setCurrVideo(data.video);
		});

		socket.on("digitalRead", (data) => {
			setCurrVideo(data.data.video);
		});

		return () => {
			socket.off("connect");
			socket.off("measurement");
			socket.off("digitalRead");
			socket.off("disconnect");
		};
	}, []);

	return (
		<div>
			{apiError && (
				<div className="text-center mt-10">
					<h1 className="text-2xl">{apiError && apiError}</h1>
					<p>
						If you have connected the arudino, still seeing this?
						<a href="/" className="text-blue-500">
							{" "}
							Click here
						</a>
					</p>
				</div>
			)}
			{console.log(currVideo)}
			{currVideo || defaultVideo ? (
				<video
					src={`${API_URL}/api/upload/${currVideo ? currVideo : defaultVideo}`}
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
							<Link className="text-blue-500 text-center" to="/dashboard">
								Click here to change configurations
							</Link>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default Home;
