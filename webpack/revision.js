/* globals require, module */
const path = require("path");
const fs = require("fs");
const exec = require("child_process").execSync;

const {NODE_ENV = "development"} = process.env;

// Identifies the git revision.
// Makes it available in the environement of the app.

const get_revision = () => {
	if (NODE_ENV === "development") {
		return "[development]";
	}

	let GIT_COMMIT = null;

	// Git revision from deployment.
	const file = path.resolve("./.git-revision");
	if (fs.existsSync(file)) {
		// It is assumed that the build process *can* dirty the repo,
		// but it manages to do it in a sane way.
		return fs.readFileSync(file, {encoding: "utf-8"}).trim();
	}

	console.error("!!!");

	// Deployment / use from a git repo.
	if (!GIT_COMMIT || GIT_COMMIT === "") {
		GIT_COMMIT =`${exec("git rev-parse HEAD")}`.trim();

		// Prints how many files are different / added.
		const dirty = parseInt(`${exec("git status --porcelain 2>/dev/null| grep '^??' | wc -l")}`.trim(), 10);
		if (dirty && dirty > 0) {
			GIT_COMMIT += `:~${dirty}`;
		}
	}

	if (!GIT_COMMIT || GIT_COMMIT === "") {
		GIT_COMMIT = "(unknown)";
	}

	return GIT_COMMIT;
};

const get_version = () => {
	const file = path.resolve("./package.json");
	const data = fs.readFileSync(file, {encoding: "utf-8"}).trim();

	return JSON.parse(data)["version"];
};

module.exports = {
	get_revision,
	get_version,
};
