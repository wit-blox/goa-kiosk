import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import VernierDashboard from "./pages/VernierDashboard";
import SensorsDashboard from "./pages/SensorsDashboard";
import SensorsHome from "./pages/SensorsHome";
import VernierHome from "./pages/VernierHome";
import Reveal from "./pages/Reveal";
import RevealDashboard from "./pages/RevealDashboard";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/vernier",
		element: <VernierHome />,
	},
	{
		path: "/sensors",
		element: <SensorsHome />,
	},
	{
		path: "/vernier-dashboard",
		element: <VernierDashboard />,
	},
	{
		path: "/sensors-dashboard",
		element: <SensorsDashboard />,
	},
	{
		path: "/reveal",
		element: <Reveal />,
	},
	{
		path: "/reveal-dashboard",
		element: <RevealDashboard />,
	},
]);

const App = () => {
	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	);
};

export default App;
