var webpack = require("webpack");

module.exports = {

	// Define multiple entry points.
	entry: {
		main: "./src/main.js",
		app: "./src/app.jsx"
	},

	// Define output path.
	output: {
		// The absolute path to the folder to which we want to output.
		// It will automatically create this folder if not found.
		// Global variable __dirname prints the absolute path to the directory
		// in which the currently executing file is located.
		path: __dirname + "/dist",
		// Output file name
		filename: "[name]-bundle.min.js"
	},

	// Watch file changes,
	// so we don't have to run build every time file changes.
	watch: true,

	// Configure how modules are resolved.
	resolve: {
		// What extensions can be left off when importing.
		// Default: .js, .json
		extensions: [".js", ".json", ".jsx"],

		// What directories should be searched when resolving modules.
		// Default: node_modules
		modules: ["node_modules", __dirname + "/src"]
	},

	// Define plugins.
	module: {
		// loaders is an array of loader objects.
		loaders: [
			{
				// Loader name
				loader: "babel-loader",
				// We don't want this loader to run every single file.
				// test property specifies types of files this loader should only be interested in.
				test: /\.js$|\.jsx$/,
				// Exclude folders or files we don't want this loader to run.
				exclude: /node_modules/,
				// Define loader plugins.
				query: {
					// We can also create a .babelrc file and specify presets there.
					presets: ["es2015", "react"]
				}
			},
			{
				// css-loader loads styles into the JavaScript file.
				// style-loader adds those styles into the DOM.
				// ! means pipe.
				// Loader executing order: sass-loader -> css-loader -> style-loader
				loader: "style-loader!css-loader!sass-loader",
				test: /\.css$|\.scss$/,
			}
		]
	},

	// webpack-dev-server is a little Node.js Express server.
	// When we run "npm run start,"
	// webpack-dev-server will look for this settings.
	devServer: {
		// The webpack-dev-server will serve the files in the current directory, 
		// unless you configure a specific content base.
		// contentBase: __dirname + "...", 
		// True to enable inline mode: it will automatically refresh the page on change, no URL change required.
		// False to enable iframe mode: URL change required, http://localhost:8080/webpack-dev-server/index.html
		inline: true,
		port: 8080
	},

	// Webpack plugins
	plugins: [
		// Minify scripts.
		new webpack.optimize.UglifyJsPlugin({
			minimize: true
		}),

		// Serve minified react code.
		new webpack.DefinePlugin({
			"process.env": {
				"NODE_ENV": JSON.stringify("production")
			}
		}),

		// Make jQuery accessible to every React component.
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	]
};
