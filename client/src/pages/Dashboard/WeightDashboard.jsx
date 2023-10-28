import axios from "axios";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../../configs";
import DashboardNav from "../../components/DashboardNav";

const WeightDashboard = () => {
	const [configs, setConfigs] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const { data } = await axios.get("/api/weight/configs");

			if (data.msg !== "success") return;
			setConfigs(data.data);
		};

		getData();
	}, []);

	const handleThresholdChange = (e, id, condition) => {
		const val = parseFloat(e.target.value).toFixed(2);
		let newConfigs = [...configs];
		let newConfigIdx = newConfigs.findIndex((c) => c.id === id);

		if (condition === "min") {
			newConfigs[newConfigIdx].min = val;
		} else {
			newConfigs[newConfigIdx].max = val;
		}
		setConfigs(newConfigs);
	};

	const handleAddMoreConfig = () => {
		let newConfigs = [...configs];
		newConfigs.push({
			min: "0.00",
			max: "0.00",
			video: "",
			id: uuidv4(),
		});
		setConfigs(newConfigs);
	};

	const handleRemoveConfig = (id) => {
		if (configs.length === 1) return;
		let newConfigs = [...configs];
		let newConfigIdx = newConfigs.findIndex((c) => c.id === id);
		newConfigs.splice(newConfigIdx, 1);
		setConfigs(newConfigs);
	};

	const handleSubmit = async () => {
		const res = await axios.patch("/api/weight/configs", { configs });
		if (res.data.msg !== "success") return alert("Something went wrong");

		alert("Configs updated successfully");
	};

	const uploadVideo = async (e, id) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		const { data } = await axios.post("/api/weight/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (data.msg !== "success") return alert("Something went wrong");

		let newConfigs = [...configs];
		let newConfigIdx = newConfigs.findIndex((c) => c.id === id);
		newConfigs[newConfigIdx].video = data.filename;
		setConfigs(newConfigs);
	};

	return (
		<>
			<DashboardNav />

			<main className="h-[80vh] p-5 flex justify-center flex-col items-center">
				<div className="w-full min-w-fit sm:w-4/12 p-5 rounded-lg shadow-gray-300 shadow-2xl">
					<div className="text-xl font-semibold text-center my-2">
						<h2>Configurations for Weight Scale</h2>
					</div>
					<div className="max-h-96 overflow-auto">
						{configs.map((config, idx) => (
							<div
								className="border-[1px] border-gray-900/10 rounded-md mx-4 my-4 p-2 relative"
								key={config.id}
							>
								<div className="my-1">
									<label className="mr-2" htmlFor={`min-${config.id}`}>
										Min Value for: {idx + 1}
									</label>
									<input
										id={`min-${config.id}`}
										type="number"
										className="shadow appearance-none border border-gray-400 rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
										value={config.min}
										onChange={(e) => handleThresholdChange(e, config.id, "min")}
									/>
								</div>
								<div>
									<label
										className="mr-2"
										htmlFor={`max-${config.id}`}
										title={`ID: ${config.id}`}
									>
										Max Value for: {idx + 1}
									</label>
									<input
										id={`max-${config.id}`}
										type="number"
										className="shadow appearance-none border border-gray-400 rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
										value={config.max}
										onChange={(e) => handleThresholdChange(e, config.id, "max")}
									/>
								</div>
								<div className="my-4 flex items-center gap-1">
									<div>
										<label
											className="px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-500 cursor-pointer text-white"
											htmlFor={`video-${config.id}`}
										>
											Upload Video
										</label>
										<input
											id={`video-${config.id}`}
											type="file"
											onChange={(e) => uploadVideo(e, config.id)}
											hidden
											accept="video/*"
										/>

										{config.video && (
											<a
												href={`${API_URL}/api/height/upload/${config.video}`}
												target="_blank"
												rel="noreferrer"
												className="underline text-blue-600 hover:text-blue-500 mx-2"
											>
												video link
											</a>
										)}
									</div>
								</div>

								<button
									className="absolute top-1/2 -left-5 transform -translate-y-1/2 p-0 px-2 rounded-md bg-red-600 hover:bg-red-500 cursor-pointer text-white"
									onClick={() => handleRemoveConfig(config.id)}
								>
									X
								</button>
							</div>
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

				<div className="my-10">
					<button
						className="bg-blue-600 text-white px-4 py-1 rounded-md shadow-sm shadow-blue-300 hover:bg-blue-500"
						onClick={handleSubmit}
					>
						Update Configs
					</button>
				</div>
			</main>

			<footer className="fixed bottom-0 py-4 shadow-gray-200 shadow-lg flex justify-center items-center w-full">
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

export default WeightDashboard;
