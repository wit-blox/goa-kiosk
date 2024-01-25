import React, { useEffect, useState } from "react";
import DashboardNav from "../../../components/DashboardNav";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../configs";

const AddConfig = () => {
	const params = useParams();
	const [configData, setConfigData] = useState({
		id: params.id,
		name: "",
		scientificName: "",
		habitat: "",
		diet: "",
		foundIn: "",
		behaviour: "",
		lifespan: "",
		funfacts: "",
		appearance: "",
		threats: "",
		images: [],
	});
	const [initialConfigs, setInitialConfigs] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const { data } = await axios.get("/api/reveal/configs");

			if (data.msg !== "success") return;
			setInitialConfigs(data.data.videos);
			const config = data.data.videos.find((v) => v.id === params.id);
			if (!config) return;
			setConfigData(config);
		};

		getData();
	}, []);

	const handleConfigInputChange = (e) => {
		const newConfig = { ...configData };
		let value = e.target.value;
		if (!value) value = "";
		newConfig[e.target.name] = e.target.value;
		setConfigData(newConfig);
	};

	const uploadImage = async (e) => {
		const files = e.target.files;
		if (files.length === 0) return;

		const formData = new FormData();
		for (const file of files) {
			formData.append("files", file);
		}

		try {
			const { data } = await axios.post(
				"/api/reveal/upload-multiple",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (data.msg !== "success") return alert("Something went wrong");
			const newConfigs = { ...configData };
			newConfigs.images = [...newConfigs.images, ...data.files];
			setConfigData(newConfigs);
		} catch (error) {
			console.log(error);
		}
	};

	const handleImageRemove = (id) => {
		console.log(id);
		let newConfigs = { ...configData };
		newConfigs.images = newConfigs.images.filter((i) => i.id !== id);
		setConfigData(newConfigs);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		const configIdx = initialConfigs.findIndex((c) => c.id === params.id);
		let newConfig = [...initialConfigs];
		if (configIdx === -1) {
			newConfig = [...initialConfigs, configData];
		} else {
			newConfig[configIdx] = configData;
		}

		const res = await axios.patch("/api/reveal/configs", {
			configs: newConfig,
		});
		if (res.data.msg !== "success") return alert("Something went wrong");

		alert("Configs updated successfully");
	};

	return (
		<>
			<DashboardNav />

			<main className="min-h-[80vh] p-5 flex justify-center">
				<form
					className="shadow-md shadow-gray-300 p-5 w-8/12"
					onSubmit={handleSave}
				>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="name"
							id="name"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.name}
						/>
						<label
							htmlFor="name"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Name
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="scientificName"
							id="scientificName"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.scientificName}
						/>
						<label
							htmlFor="scientificName"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Scientific Name
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="habitat"
							id="habitat"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.habitat}
						/>
						<label
							htmlFor="habitat"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Habitat
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="diet"
							id="diet"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.diet}
						/>
						<label
							htmlFor="diet"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Diet
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="foundIn"
							id="foundIn"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.foundIn}
						/>
						<label
							htmlFor="foundIn"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Greet me here
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="behaviour"
							id="behaviour"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.behaviour}
						/>
						<label
							htmlFor="behaviour"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Behaviour
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="lifespan"
							id="lifespan"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.lifespan}
						/>
						<label
							htmlFor="lifespan"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Lifespan
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="funfacts"
							id="funfacts"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.funfacts}
						/>
						<label
							htmlFor="funfacts"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Fun Facts
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="appearance"
							id="appearance"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.appearance}
						/>
						<label
							htmlFor="appearance"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Appearance
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="threats"
							id="threats"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							onChange={handleConfigInputChange}
							value={configData.threats}
						/>
						<label
							htmlFor="threats"
							className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Threats
						</label>
					</div>
					<div>
						<input
							type="file"
							multiple
							accept="image/*"
							onChange={uploadImage}
							hidden
							id="image"
						/>

						<label
							htmlFor="image"
							className="bg-blue-600 text-white rounded-md px-4 py-2"
						>
							Upload Images
						</label>

						<div className="flex mt-2 overflow-auto gap-1">
							{configData.images.map((image) => (
								<div className="relative">
									<img
										src={`${API_URL}/api/reveal/upload/${image.filename}`}
										alt={image.filename}
										key={image.id}
										className="w-32 h-32"
									/>
									<button
										onClick={(e) => {
											e.preventDefault();
											handleImageRemove(image.id);
										}}
										className="absolute right-0 top-0 bg-red-600 text-white w-8 h-8 flex justify-center items-center"
									>
										x
									</button>
								</div>
							))}
						</div>
					</div>

					<button
						className="bg-blue-600 text-white rounded-md px-4 py-2 self-center"
						type="submit"
					>
						Update Configs
					</button>
				</form>
			</main>
		</>
	);
};

export default AddConfig;
