import React from "react";
import { Link } from "react-router-dom";

const DashboardNav = () => {
	return (
		<nav className="p-4 shadow-gray-200 shadow-lg flex justify-between items-center">
			<h1>Dashboard</h1>

			<ul className="flex gap-2 text-blue-500 underline">
				<Link to="/">
					<li className="px-4 py-2 rounded-md hover:bg-gray-900/10 cursor-pointer">
						Home
					</li>
				</Link>
				<Link to="/vernier-dashboard">
					<li className="px-4 py-2 rounded-md hover:bg-gray-900/10 cursor-pointer">
						Vernier Dashboard
					</li>
				</Link>
				<Link to="/sensors-dashboard">
					<li className="px-4 py-2 rounded-md hover:bg-gray-900/10 cursor-pointer">
						Sensors Dashboard
					</li>
				</Link>
				<Link to="/reveal-dashboard">
					<li className="px-4 py-2 rounded-md hover:bg-gray-900/10 cursor-pointer">
						Reveal Dashboard
					</li>
				</Link>
				<Link to="/height-dashboard">
					<li className="px-4 py-2 rounded-md hover:bg-gray-900/10 cursor-pointer">
						Height Dashboard
					</li>
				</Link>
			</ul>
		</nav>
	);
};

export default DashboardNav;
