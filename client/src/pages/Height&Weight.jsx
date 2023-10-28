import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import { API_URL } from "../configs";

const socket = io(API_URL);

const HeightWeight = () => {
	const [apiError, setApiError] = useState(null);
	const [currVideo, setCurrVideo] = useState(null);
	const [measurement, setMeasurement] = useState(0);
	const [searchParams] = useSearchParams({ mode: "height" });
	const mode = searchParams.get("mode"); // height || weight
	const lastMeasurement = useRef(0);
	const configsRef = useRef([]);
	const sameMeasurementCounter = useRef(0);

	useEffect(() => {
		axios
			.get(`/api/${mode}/init`)
			.then(({ data }) => {
				if (data.msg !== "success") return setApiError(data.msg);
				configsRef.current = data.data.configs;
			})
			.catch((err) => {
				// console.log(err);
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

		socket.on("new-image", (data) => {
			console.log("New Image");
			setCurrVideo(data.video);
		});

		socket.on("new-measurement", handleMeasurementChange);

		return () => {
			socket.off("connect");
			socket.off("new-video");
			socket.off("new-measurement");
			socket.off("disconnect");
		};
	}, []);

	const handleMeasurementChange = (data) => {
		let newMeasurement = parseInt(data.measurement);
		if (mode === "weight") {
			if (newMeasurement < 0) {
				newMeasurement = 0;
			}
			newMeasurement = newMeasurement / 1000;
		}
		// console.log(newMeasurement);

		setMeasurement(newMeasurement);

		if (newMeasurement === lastMeasurement.current) {
			sameMeasurementCounter.current = sameMeasurementCounter.current + 1;

			if (sameMeasurementCounter.current === 15) {
				// console.log("same height for ", lastMeasurement.current);
				// timeout = setTimeout(() => {
				displayImageFromMeasurement(lastMeasurement.current);
				// }, 2000);
				sameMeasurementCounter.current = 0;
			}

			return;
		}

		lastMeasurement.current = newMeasurement;
	};

	const displayImageFromMeasurement = (measurement) => {
		const configs = configsRef.current;
		if (configs.length === 0) return;

		const found = configs.find((config) => {
			if (
				measurement < parseFloat(config.max) &&
				measurement > parseFloat(config.min)
			) {
				return config;
			}
		});
		if (found) {
			setCurrVideo(found.video);
			socket.off("new-measurement");
		}
	};

	return (
		<div>
			{apiError && (
				<div className="text-center mt-10 text-red-600">
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
						<Link to={`/${mode}-dashboard`} className="text-blue-500">
							dashboard
						</Link>
					</p>
				</div>
			)}
			<div className="bg-gray-900 flex justify-center items-center h-screen text-white">
				{!currVideo ? (
					<div>
						<h1 className="text-[20rem] mb-24">
							{mode === "height" ? measurement : measurement.toFixed(2)}
							<span className="text-5xl text-gray-400">
								{mode === "height" ? "cm" : "kg"}
							</span>
						</h1>
					</div>
				) : (
					<video
						src={`${API_URL}/api/${mode}/upload/${currVideo}`}
						autoPlay
						muted
						// controls
						className="w-full h-full fixed top-0 left-0 object-contain bg-black"
						onEnded={() => {
							socket.on("new-measurement", handleMeasurementChange);
							setCurrVideo("");
						}}
					/>
				)}
			</div>
			{/* {setCurrVideo || defaultVideo ? (
				<img
					src={`${API_URL}/api/height/upload/${
						setCurrVideo ? setCurrVideo : defaultVideo
					}`}
					className="w-full h-full fixed top-0 left-0 object-contain bg-black"
				/>
			) : (
				<div className="text-center mt-10">
					{!apiError && (
						<>
							<h1 className="text-4xl">{measurement}</h1>
						</>
					)}
				</div>
			)} */}
		</div>
	);
};

export default HeightWeight;
