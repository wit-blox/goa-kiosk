import React from "react";
import { API_URL } from "../configs";

const Modal = ({ onClose, isHidden, activeItem }) => {
	return (
		<div
			id="staticModal"
			data-modal-backdrop="static"
			tabIndex="-1"
			aria-hidden="true"
			hidden={isHidden}
			className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh]"
		>
			<div className="h-screen relative">
				<button
					type="button"
					className="absolute top-0 p-1 right-0 z-50 inline-flex items-center justify-center w-16 h-16 text-red-900 transition-colors duration-150 bg-white rounded-l-lg rounded-t-none shadow hover:text-gray-200 focus:outline-none"
					data-dismiss="modal"
					aria-label="Close"
					onClick={onClose}
				>
					<svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							stroke="red"
							d="M14.348 5.652a.5.5 0 010 .707L10.707 10l3.64 3.64a.5.5 0 11-.707.707L10 10.707l-3.64 3.64a.5.5 0 01-.707-.707L9.293 10 5.652 6.36a.5.5 0 01.707-.707L10 9.293l3.64-3.64a.5.5 0 01.708 0z"
						/>
					</svg>
				</button>

				<div className="h-full rounded-lg shadowbg-gray-900">
					{activeItem && (
						<video
							src={`${API_URL}/api/reveal/upload/${activeItem}`}
							alt="item"
							className="w-full h-full object-cover"
							loop
							autoPlay
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Modal;
