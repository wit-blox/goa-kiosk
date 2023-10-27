import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="bg-gray-100 h-screen flex justify-center items-center">
			<div className="border-2 p-10 rounded-lg flex flex-col justify-center items-center text-center">
				<h1 className="text-2xl mb-5">Quick Links</h1>

				<div className="flex flex-col">
					<Link to="/sensors" className="text-blue-500">
						Sensors
					</Link>
					<Link to="/sensors-dashboard" className="text-blue-500">
						Sensors Dashboard
					</Link>
					<Link to="/vernier" className="text-blue-500">
						Vernier
					</Link>
					<Link to="/vernier-dashboard" className="text-blue-500">
						Vernier Dashboard
					</Link>
					<Link to="/reveal" className="text-blue-500">
						Reveal
					</Link>
					<Link to="/reveal-dashboard" className="text-blue-500">
						Reveal Dashboard
					</Link>
					<Link to="/height-weight" className="text-blue-500">
						Height & Weight
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
