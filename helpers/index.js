const replaceFileNameSpaces = (fileName) => {
	return fileName.replace(/ /g, "_");
};

module.exports = { replaceFileNameSpaces };
