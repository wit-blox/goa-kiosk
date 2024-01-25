/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				"infinite-scroll": "infinite-scroll 20s linear infinite",
			},
			keyframes: {
				"infinite-scroll": {
					from: { transform: "translateY(0)" },
					to: { transform: "translateY(-100%)" },
				},
			},
		},
	},
	plugins: [],
};
