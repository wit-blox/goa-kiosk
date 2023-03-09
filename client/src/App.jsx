import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import VernierDashboard from "./pages/VernierDashboard";
import SensorsDashboard from "./pages/SensorsDashboard";
import SensorsHome from "./pages/SensorsHome";
import VernierHome from "./pages/VernierHome";

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
]);

const App = () => {
	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	);
};

export default App;
