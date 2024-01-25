import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { API_URL } from "../configs";
import Modal from "../components/Modal";

const socket = io(API_URL);

const Reveal = () => {
	const [apiError, setApiError] = useState(null);
	const [items, setItems] = useState([]);
	const [activeItem, setActiveItem] = useState(null);

	useEffect(() => {
		axios
			.get("/api/reveal/init")
			.then(({ data }) => {
				if (data.msg !== "success") return setApiError(data.msg);

				// console.log(data.data.configs.videos, "init data");
				setItems(data.data.configs.videos);
			})
			.catch((err) => {
				setApiError(err.response.data.data);
			});
	}, []);

	useEffect(() => {
		axios
			.get(`/api/reveal/on?pin=0`)
			.then(({ data }) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});

		socket.on("connect", () => {
			console.log("connected to socket");
		});

		socket.on("disconnect", () => {
			console.log("disconnected from socket");
		});

		return () => {
			socket.removeAllListeners();
		};
	}, []);

	const handleItemClick = (idx) => {
		axios
			.get(`/api/reveal/on?pin=${idx}`)
			.then(({ data }) => {
				// console.log(data);
				// console.log(items[idx - 1].image, "image");
				if (items[idx - 1]) {
					setActiveItem(items[idx - 1].video);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleModalClose = () => {
		axios
			.get(`/api/reveal/on?pin=0`)
			.then(({ data }) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
		setActiveItem(null);
	};

	if (apiError) {
		return (
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
					<Link to="/reveal-dashboard" className="text-blue-500">
						dashboard
					</Link>
				</p>
			</div>
		);
	}

	if (!items.length) {
		return (
			<div className="text-center bg-black text-white h-screen">
				<h1 className="text-2xl">Loading...</h1>
			</div>
		);
	}

	return (
		<>
			<main className="grid grid-cols-2 gap-1 bg-black h-screen">
				<div
					className="relative"
					style={{
						background: `url(${API_URL}/api/reveal/upload/${items[0].images[0].filename}) no-repeat center center/cover`,
						backgroundSize: "100% 100%",
					}}
				>
					<Link
						to={`/reveal/${items[0].id}?pin=${1}`}
						className="bg-red-500 text-white p-2 px-4 rounded-md bottom-2 left-2 absolute uppercase"
					>
						{items[0].name} &#187;
					</Link>
				</div>
				<div
					className="relative"
					style={{
						background: `url(${API_URL}/api/reveal/upload/${items[1].images[0].filename}) no-repeat center center/cover`,
						backgroundSize: "100% 100%",
					}}
				>
					<Link
						to={`/reveal/${items[1].id}?pin=${2}`}
						className="bg-red-500 text-white p-2 px-4 rounded-md bottom-2 left-2 absolute uppercase"
					>
						{items[1].name} &#187;
					</Link>
				</div>
				<div
					className="relative"
					style={{
						background: `url(${API_URL}/api/reveal/upload/${items[2].images[0].filename}) no-repeat center center/cover`,
						backgroundSize: "100% 100%",
					}}
				>
					<Link
						to={`/reveal/${items[2].id}?pin=${3}`}
						className="bg-red-500 text-white p-2 px-4 rounded-md bottom-2 left-2 absolute uppercase"
					>
						{items[2].name} &#187;
					</Link>
				</div>
				<div
					className="relative"
					style={{
						background: `url(${API_URL}/api/reveal/upload/${items[3].images[0].filename}) no-repeat center center/cover`,
						backgroundSize: "100% 100%",
					}}
				>
					<Link
						to={`/reveal/${items[3].id}?pin=${4}`}
						className="bg-red-500 text-white p-2 px-4 rounded-md bottom-2 left-2 absolute uppercase"
					>
						{items[3].name} &#187;
					</Link>
				</div>
			</main>
		</>
	);
};

export default Reveal;

const ItemContainer = ({ item, handleItemClick, idx }) => {
	return (
		<div
			className="h-full flex justify-center items-center bg-black border-2 text-7xl transition-all"
			onClick={() => {
				handleItemClick(idx);
			}}
		>
			{item?.image ? (
				<img
					src={`${API_URL}/api/reveal/upload/${item.image}`}
					alt="item"
					className="w-full h-full object-contain"
				/>
			) : (
				<div>🙈</div>
			)}
		</div>
	);
};
