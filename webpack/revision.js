/* globals require, module */
const path = require("path");
const fs = require("fs");
const exec = require("child_process").execSync;

const {NODE_ENV = "development"} = process.env;

// Identifies the git revision.
// Makes it available in the environement of the app.

const get_revision = () => {
	// Git revision from deployment.
	const file = path.resolve("./.git-revision");
	if (fs.existsSync(file)) {
		// It is assumed that the build process *can* dirty the repo,
		// but it manages to do it in a sane way.
		return fs.readFileSync(file, {encoding: "utf-8"}).trim();
	}

	// Assumes no need to show revision, *should* be clean.
	return "";
};

const get_version = () => {
	const file = path.resolve("./package.json");
	const data = fs.readFileSync(file, {encoding: "utf-8"}).trim();
	const {version} = JSON.parse(data);

	if (NODE_ENV === "development") {
		return version + "-dev";
	}

	return version;
};

module.exports = {
	get_revision,
	get_version,
};
