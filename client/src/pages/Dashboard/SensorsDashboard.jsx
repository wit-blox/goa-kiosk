import axios from "axios";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../../configs";
import { Link } from "react-router-dom";
import DashboardNav from "../../components/DashboardNav";

const SerialDashboard = () => {
	const [configs, setConfigs] = useState({
		defaultVideo: "",
		videos: [],
	});

	useEffect(() => {
		const getData = async () => {
			const { data } = await axios.get("/api/sensors/configs");

			if (data.msg !== "success") return;
			setConfigs(data.data);
		};

		getData();
	}, []);

	const handleAddMoreConfig = () => {
		if (configs.length === 11) return alert("Max 11 pins allowed");
		let newConfigs = [...configs.videos];
		newConfigs.push({
			video: "",
			id: uuidv4(),
		});
		setConfigs({ ...configs, videos: newConfigs });
	};

	const handleRemoveConfig = (id) => {
		if (configs.length === 1) return;
		let newConfigs = [...configs.videos];
		let newConfigIdx = newConfigs.findIndex((c) => c.id === id);
		newConfigs.splice(newConfigIdx, 1);
		setConfigs({ ...configs, videos: newConfigs });
	};

	const handleSubmit = async () => {
		const res = await axios.patch("/api/sensors/configs", { configs });
		if (res.data.msg !== "success") return alert("Something went wrong");

		alert("Configs updated successfully");
	};

	const uploadVideo = async (e, id) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		try {
			const { data } = await axios.post("/api/sensors/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (data.msg !== "success") return alert("Something went wrong");

			if (id === "default")
				return setConfigs({ ...configs, defaultVideo: data.filename });

			let newConfigs = [...configs.videos];
			let newConfigIdx = newConfigs.findIndex((c) => c.id === id);
			newConfigs[newConfigIdx].video = data.filename;
			setConfigs({ ...configs, videos: newConfigs });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<DashboardNav />

			<main className="h-[80vh] p-5 flex justify-center flex-col items-center">
				<div className="w-full min-w-fit sm:w-4/12 p-5 rounded-lg shadow-gray-300 shadow-2xl">
					<div className="text-xl font-semibold text-center my-2">
						<h2>Configurations for Sensors</h2>
					</div>
					<div className="max-h-96 overflow-auto">
						<ConfigCard
							config={{
								video: configs?.defaultVideo,
								id: "default",
							}}
							uploadVideo={uploadVideo}
							btnText={`Upload Default Video`}
							isDefault
						/>

						{configs.videos.map((config, idx) => (
							<ConfigCard
								key={config.id}
								config={config}
								idx={idx}
								handleRemoveConfig={handleRemoveConfig}
								uploadVideo={uploadVideo}
								btnText={`Upload Video for Pin ${idx + 1}`}
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

export default SerialDashboard;

const ConfigCard = ({
	config,
	isDefault,
	handleRemoveConfig,
	uploadVideo,
	btnText,
}) => {
	return (
		<div className="border-[1px] border-gray-900/10 rounded-md mx-4 my-4 p-2 relative">
			<div className="my-4 flex items-center gap-1">
				<div>
					<label
						className="px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-500 cursor-pointer text-white"
						htmlFor={`video-${config.id}`}
					>
						{btnText}
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
							href={`${API_URL}/api/sensors/upload/${config.video}`}
							target="_blank"
							rel="noreferrer"
							className="underline text-blue-600 hover:text-blue-500 mx-2"
						>
							video link
						</a>
					)}
				</div>
			</div>

			{!isDefault && (
				<button
					className="absolute top-1/2 -right-2 transform -translate-y-1/2 p-0 px-2 rounded-md bg-red-600 hover:bg-red-500 cursor-pointer text-white"
					onClick={() => handleRemoveConfig(config.id)}
				>
					X
				</button>
			)}
		</div>
	);
};
