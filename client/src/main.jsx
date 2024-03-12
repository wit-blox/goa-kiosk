import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { API_URL } from "./configs";
import "./index.css";

axios.defaults.baseURL = API_URL;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
