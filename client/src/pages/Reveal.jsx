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

				console.log(data.data.configs.videos, "init data");
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
			<div className="h-screen p-5 bg-black">
				<div className="grid grid-cols-4 grid-rows-2 h-full">
					<ItemContainer
						idx={1}
						item={items[0]}
						handleItemClick={handleItemClick}
					/>
					<ItemContainer
						idx={2}
						item={items[1]}
						handleItemClick={handleItemClick}
					/>
					<ItemContainer
						idx={3}
						item={items[2]}
						handleItemClick={handleItemClick}
					/>
					<ItemContainer
						idx={4}
						item={items[3]}
						handleItemClick={handleItemClick}
					/>
					<ItemContainer
						idx={5}
						item={items[4]}
						handleItemClick={handleItemClick}
					/>
					<ItemContainer
						idx={6}
						item={items[5]}
						handleItemClick={handleItemClick}
					/>
					<ItemContainer
						idx={7}
						item={items[6]}
						handleItemClick={handleItemClick}
					/>
					<ItemContainer
						idx={8}
						item={items[7]}
						handleItemClick={handleItemClick}
					/>
				</div>

				<Modal
					onClose={handleModalClose}
					isHidden={activeItem ? false : true}
					activeItem={activeItem}
				/>
			</div>
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
					className="w-full h-full object-cover"
				/>
			) : (
				<div>🙈</div>
			)}
		</div>
	);
};
