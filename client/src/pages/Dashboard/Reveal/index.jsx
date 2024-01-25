import axios from "axios";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../../../configs";
import { Link, useNavigate } from "react-router-dom";
import DashboardNav from "../../../components/DashboardNav";

const RevealDashboard = () => {
	const navigate = useNavigate();
	const [configs, setConfigs] = useState({
		videos: [],
	});

	useEffect(() => {
		const getData = async () => {
			const { data } = await axios.get("/api/reveal/configs");

			if (data.msg !== "success") return;
			console.log(data);
			setConfigs(data.data);
		};

		getData();
	}, []);

	const handleAddMoreConfig = () => {
		if (configs.videos.length === 8) return alert("Max 8 pins allowed");

		navigate(`/reveal-dashboard/edit/${uuidv4()}`);
	};

	const handleRemoveConfig = (id) => {
		if (configs.length === 1) return;
		let newConfigs = [...configs.videos];
		let newConfigIdx = newConfigs.findIndex((c) => c.id === id);
		newConfigs.splice(newConfigIdx, 1);
		setConfigs({ ...configs, videos: newConfigs });
	};

	return (
		<>
			<DashboardNav />

			<main className="min-h-[80vh] p-5 flex justify-center flex-col items-center">
				<div className="w-full p-5 rounded-lg">
					<div className="text-xl font-semibold text-center my-2">
						<h2>Configurations for Reveal</h2>
					</div>
					<div className="w-full flex flex-wrap">
						{configs.videos.map((config, idx) => (
							<ConfigCard
								key={config.id}
								config={config}
								idx={idx}
								handleRemoveConfig={handleRemoveConfig}
								pinCount={idx + 1}
							/>
						))}
					</div>
					<div className="ml-4 mt-4">
						<button
							className="border-[1px] border-gray-600 rounded-md p-1 px-3 text-sm hover:bg-gray-600 hover:text-white cursor-pointer"
							onClick={handleAddMoreConfig}
						>
							Add More
						</button>
					</div>
				</div>

				{/* <div className="my-10">
					<button
						className="bg-blue-600 text-white px-4 py-1 rounded-md shadow-sm shadow-blue-300 hover:bg-blue-500"
						onClick={handleSubmit}
					>
						
					</button>
				</div> */}
			</main>

			<footer className="bottom-0 py-4 shadow-gray-200 shadow-lg flex justify-center items-center w-full">
				<p>
					Powered by{" "}
					<a href="https://witblox.com" className="underline">
						WitBlox
					</a>
				</p>
			</footer>
		</>
	);
};

export default RevealDashboard;

const ConfigCard = ({ config, handleRemoveConfig }) => {
	return (
		<div className="border-[1px] border-gray-900/10 rounded-md mx-4 my-4 p-2 relative">
			<div className="my-4 flex justify-center gap-7 flex-col">
				<div>
					<img
						src={`${API_URL}/api/reveal/upload/${config.images[0]?.filename}`}
						alt="..."
						className="h-32 w-48 mt-2"
					/>
				</div>
			</div>

			<h1 className="font-semibold">{config.name}</h1>

			<div className="flex gap-2 justify-center">
				<Link
					to={`/reveal-dashboard/edit/${config.id}`}
					className="p-1 flex-1 bg-blue-600 text-white rounded-sm text-center"
				>
					Edit
				</Link>
				<button
					className="px-4 py-1 flex-1 bg-red-600 text-white rounded-sm"
					onClick={() => handleRemoveConfig(config.id)}
				>
					Remove
				</button>
			</div>
		</div>
	);
};
