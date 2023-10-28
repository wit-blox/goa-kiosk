import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import VernierDashboard from "./pages/Dashboard/VernierDashboard";
import SensorsDashboard from "./pages/Dashboard/SensorsDashboard";
import SensorsHome from "./pages/SensorsHome";
import VernierHome from "./pages/VernierHome";
import Reveal from "./pages/Reveal";
import RevealDashboard from "./pages/Dashboard/RevealDashboard";
import HeightWeight from "./pages/Height&Weight";
import HeightDashboard from "./pages/Dashboard/HeightDashboard";
import WeightDashboard from "./pages/Dashboard/WeightDashboard";

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
	{
		path: "/height-weight",
		element: <HeightWeight />,
	},
	{
		path: "/height-dashboard",
		element: <HeightDashboard />,
	},
	{
		path: "/weight-dashboard",
		element: <WeightDashboard />,
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
