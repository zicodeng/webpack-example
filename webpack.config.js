var webpack = require("webpack");

module.exports = {

	// Define multiple entry points
	entry: {
		main: "./src/main.js",
		component: "./src/component.jsx"
	},

	// Define output path
	output: {
		// The absolute path to the folder to which we want to output
		// It will automatically create this folder if not found
		// Global variable __dirname prints the absolute path to the directory
		// in which the currently executing file is located
		path: __dirname + "/dist",
		// Output file name
		filename: "[name]-bundle.min.js"
	},

	// Watch file changes,
	// so we don't have to run build every time file changes
	watch: true,

	// Define plugins
	module: {
		// loaders is an array of loader objects
		loaders: [
			{
				// Loader name
				loader: "babel-loader",
				// We don't want this loader to run every single file
				// test property specifies types of files this loader should only be interested in
				test: /\.js$|\.jsx$/,
				// Exclude folders or files we don't want this loader to run
				exclude: /node_modules/,
				// Define loader plugins
				query: {
					presets: ["es2015", "react"]
				}
			},
			{
				// css-loader loads styles into the JavaScript file
				// style-loader adds those styles into the DOM
				// ! means pipe
				// Loader executing order: sass-loader -> css-loader -> style-loader
				loader: "style-loader!css-loader!sass-loader",
				test: /\.css$|\.scss$/,
			}
		]
	},

	// Webpack plugins
	plugins: [
		// Minify scripts
		new webpack.DefinePlugin({
			"process.env": {
				"NODE_ENV": JSON.stringify("production")
			}
		}),

		// Make jQuery accessible to every React component
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	]
};
