import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { API_URL } from "../configs";
import { FaHome } from "react-icons/fa";

const TIMER = 30; // in seconds

const RevealDetails = () => {
	const params = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [configData, setConfigData] = useState(null);

	useEffect(() => {
		const getData = async () => {
			const { data } = await axios.get("/api/reveal/configs");

			if (data.msg !== "success") return;
			const config = data.data.videos.find((v) => v.id === params.id);
			if (!config) return;
			setConfigData(config);
		};

		getData();

		const timeout = setTimeout(() => {
			axios
				.get(`/api/reveal/on?pin=0`)
				.then(({ data }) => {
					navigate("/reveal");
				})
				.catch((err) => {
					console.log(err);
				});
		}, TIMER * 1000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	useEffect(() => {
		axios
			.get(`/api/reveal/on?pin=${searchParams.get("pin")}`)
			.then(({ data }) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	if (!configData) return;

	return (
		<main className="h-screen w-full bg-black relative">
			<img
				src={`${API_URL}/api/reveal/upload/${configData.finalImage}`}
				alt="..."
				className="h-full w-full"
			/>
			<Link
				to="/reveal"
				className="bg-red-600 text-white flex justify-center items-center p-3 bottom-5 left-10 rounded-full absolute animate-pulse"
			>
				<FaHome className="text-5xl" />
			</Link>
		</main>
	);
};

export default RevealDetails;
