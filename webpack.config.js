const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const {get_version, get_revision} = require("./webpack/revision");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist")
	},
	module: {
		loaders: [
			{
				test: /.js$/,
				// ES2015 to JS, without some features:
				// → https://buble.surge.sh/guide/
				loaders: "buble-loader",
				include: path.join(__dirname, "src"),
				query: {
					objectAssign: "Object.assign"
				}
			},
			{
				test: /\.less$/,
				use: [
					{loader: "raw-loader"},
					{loader: "less-loader"},
				]
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			template: "src/app.html",
		}),
		new webpack.DefinePlugin({
			"GIT_REVISION": JSON.stringify(get_revision()),
			"VERSION": JSON.stringify(get_version()),
		}),
	]
};
