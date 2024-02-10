import path from "path";
import fs from "fs";

// Get the current git revision.
const get_revision = () => {
  // Git revision from deployment.
  const file = path.resolve("./.git-revision");
  if (fs.existsSync(file)) {
    // It is assumed that the build process *can* dirty the repo,
    // but it manages to do it in a sane way.
    return fs.readFileSync(file, { encoding: "utf-8" }).trim();
  }

  // Assumes no need to show revision, *should* be clean.
  return "";
};

// Get the current version.
export const get_version = () => {
  const file = path.resolve("./package.json");
  const data = fs.readFileSync(file, { encoding: "utf-8" }).trim();
  const { version } = JSON.parse(data);

  if (process.env.NODE_ENV === "development") {
    return version + "-dev";
  }

  return version;
};

/** @type {import('vite').UserConfig} */
export default {
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  define: {
    GIT_REVISION: JSON.stringify(get_revision()),
    VERSION: JSON.stringify(get_version()),
  },
};
