import axios from "axios";
import React, { useEffect, useState } from "react";

const Home = () => {
	const [apiError, setApiError] = useState(null);

	useEffect(() => {
		axios
			.get("/api/init")
			.then(({ data }) => {
				console.log(data);
			})
			.catch((err) => {
				setApiError(err.response.data.data);
			});
	}, []);

	return (
		<div>
			<h1>Home</h1>
			<h1>{apiError && apiError}</h1>
		</div>
	);
};

export default Home;
