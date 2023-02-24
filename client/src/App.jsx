import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import SerialDashboard from "./pages/SerialDashboard";
import SerialRead from "./pages/SerialRead";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/dashboard",
		element: <Dashboard />,
	},
	{
		path: "/serial-dashboard",
		element: <SerialDashboard />,
	},
	{
		path: "/serial_read",
		element: <SerialRead />,
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
