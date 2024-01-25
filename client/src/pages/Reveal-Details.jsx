import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../configs";
import learnMoreImage from "../assets/img/blog/learnmore.png";

const TIMER = 30; // in seconds

const RevealDetails = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [configData, setConfigData] = useState(null);
	const [isMoreInfoClicked, setIsMoreInfoClicked] = useState(false);

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
			.get(`/api/reveal/on?pin=${1}`)
			.then(({ data }) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleMoreInfo = () => {
		setIsMoreInfoClicked(true);
	};

	if (!configData) return;

	return (
		<main className="bg-image h-screen py-2 px-32">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-semibold uppercase">{configData.name}</h1>
				<Link
					to="/reveal"
					className="bg-red-600 text-white flex justify-center items-center px-4 py-1 rounded-md mr-8"
				>
					Home
				</Link>
			</div>

			<section className="mt-6 grid grid-cols-3 grid-rows-5 gap-4">
				<div className="col-span-2 row-span-5 w-full relative">
					<img
						src={`${API_URL}/api/reveal/upload/${configData.images[0].filename}`}
						alt="..."
						className="w-[65vw] max-h-[60vh]"
					/>

					<table className="mt-2 border-spacing-4">
						<tbody className="text-lg">
							{isMoreInfoClicked ? (
								<>
									<tr>
										<td className="font-bold">Behaviour</td>
										<td className="pl-20">{configData.behaviour}</td>
									</tr>
									<tr>
										<td className="font-bold">Lifespan</td>
										<td className="pl-20">{configData.lifespan}</td>
									</tr>
									<tr>
										<td className="font-bold">Fun Facts</td>
										<td className="pl-20">{configData.funfacts}</td>
									</tr>
									<tr>
										<td className="font-bold">Appearance</td>
										<td className="pl-20">{configData.appearance}</td>
									</tr>
									{configData.threats && (
										<tr>
											<td className="font-bold">Appearance</td>
											<td className="pl-20">{configData.appearance}</td>
										</tr>
									)}
								</>
							) : (
								<>
									<tr>
										<td className="font-bold">Scientific Name</td>
										<td className="pl-20">{configData.scientificName}</td>
									</tr>
									<tr>
										<td className="font-bold">Habitat</td>
										<td className="pl-20">{configData.habitat}</td>
									</tr>
									<tr>
										<td className="font-bold">Diet</td>
										<td className="pl-20">{configData.diet}</td>
									</tr>
									<tr>
										<td className="font-bold">Greet me here</td>
										<td className="pl-20">{configData.foundIn}</td>
									</tr>
								</>
							)}
						</tbody>
					</table>

					<div className="absolute right-5 -bottom-12">
						{!isMoreInfoClicked && (
							<button onClick={handleMoreInfo}>
								<img src={learnMoreImage} alt="..." width={200} />
							</button>
						)}
					</div>
				</div>

				<div className="row-span-5 col-start-3 h-[80vh] overflow-hidden">
					<div className="animate-infinite-scroll flex flex-col">
						{configData.images.map((image, idx) => {
							if (idx === 0) return null;
							return (
								<div className={`slide-${idx}`} key={image.id}>
									<img
										src={`${API_URL}/api/reveal/upload/${image.filename}`}
										alt="..."
										className="w-96 h-72 my-2"
									/>
								</div>
							);
						})}
					</div>
					<div aria-hidden className="animate-infinite-scroll">
						{configData.images.map((image, idx) => {
							if (idx === 0) return null;
							return (
								<div className={`slide-${idx}`} key={image.id}>
									<img
										src={`${API_URL}/api/reveal/upload/${image.filename}`}
										alt="..."
										className="w-96 h-72 my-2"
									/>
								</div>
							);
						})}
					</div>
				</div>
			</section>
		</main>
	);
};

export default RevealDetails;
