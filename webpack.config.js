// require is CommonJS whereas import is ES6 feature.
// Because webpack.config.js itself is not compiled by babel,
// so import statement cannot be used here.
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const extractSass = new ExtractTextPlugin({
	filename: "[name]-style.min.css",
	disable: process.env.NODE_ENV === "development"
});

module.exports = {

	// Define multiple entry points.
	entry: {
		index: "./client/assets/entries/index.js",
		app: "./client/assets/entries/app.jsx"
	},

	// Define output path.
	output: {
		// The absolute path to the folder to which we want to output.
		// It will automatically create this folder if not found.
		// Global variable __dirname prints the absolute path to the directory
		// in which the currently executing file is located.
		path: __dirname + "/client/public/dist",
		// Output file name
		filename: "[name]-bundle.min.js"
	},

	// Watch file changes,
	// so we don't have to run build every time file changes.
	watch: true,

	// Enable source map for debugging webpack's output.
    devtool: "source-map",

	// Configure how modules are resolved.
	resolve: {
		// What extensions can be left off when importing.
		// Default: .js, .json
		extensions: [".js", ".jsx", ".scss", ".css"],

		// What directories should be searched when resolving modules.
		// Default: node_modules
		modules: ["node_modules", "./client/assets"]
	},

	// Define plugins.
	module: {
		// Equivalent to loaders in old version webpack.
		rules: [
			{	
				// Check file types.
				// Different file types are applied with different loaders.
				test: /\.js$|\.jsx$/,
				// Exclude folders or files we don't want webpack to run test.
				// This will save webpack loading time.
				exclude: /node_modules/,
				// use takes an array of loaders.
				// These loaders will be used when the test is passed.
				use: [
					{
						// Loader name
						loader: "babel-loader",
						// Loader plugins.
						// For babel loader, defining presets and plugins in query is the same as in .babelrc.
						query: {
							// We can also create a .babelrc file and specify presets there.
							presets: ["es2015", "react"]
						}
					}
				]
			},
			{	
				test: /\.css$|\.scss$/,
				// Exclude everything in node_modules except bootstrap.
				exclude: /node_modules\/(?!bootstrap\/).*/,
				// Loaders can be chained by passing multiple loaders.
				// The executing order is from right to left (last to first configured)
				use: extractSass.extract({
					// Nested use.
					use: [
						{
							// css-loader translates CSS into the CommonJS.
							loader: "css-loader",
							options: {
								sourceMap: true,
								minimize: true
							}
						},
						{	
							// sass-loader compiles SASS to CSS.
							loader: "sass-loader",
							options: {
								// includePaths tells the sass-loader to include the specified paths
								// when using @import in our sass files.
								includePaths: [
									__dirname + "/client/assets/stylesheets/sass",
									__dirname + "/node_modules/compass-mixins/lib"
								],
								sourceMap: true
							}
						}
					],
					fallback: "style-loader"
				})
			}
		]
	},

	// webpack-dev-server is a little Node.js Express server.
	// When we run "npm run start,"
	// webpack-dev-server will look for this settings.
	devServer: {
		// The webpack-dev-server will serve the files in the current directory,
		// unless you configure a specific content base.
		contentBase: __dirname + "/client/public/dist",
		 
		// True to enable inline mode: it will automatically refresh the page on change, no URL change required.
		// False to enable iframe mode: URL change required, http://localhost:8080/webpack-dev-server/index.html
		inline: true,
		port: 8080
	},

	// Webpack plugins
	plugins: [
		// Minify scripts.
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			// Enable source map when uglifying code.
            sourceMap: true
		}),

		// Serve production build code.
		new webpack.DefinePlugin({
			"process.env": {
				"NODE_ENV": JSON.stringify("production")
			}
		}),

		// Make jQuery globally accessible.
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		}),

		// This is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles. 
		// This is especially useful for webpack bundles 
		// that include a hash in the filename which changes every compilation. 
		// You can either let the plugin generate an HTML file for you, 
		// supply your own template using lodash templates or use your own loader.
		new HtmlWebpackPlugin({
			title: "Index | Webpack Example",
			filename: "index.html",
			template: "./client/assets/templates/index.ejs", // Use custom template.
			// Only include chunks that are relevant to this html file.
			// For example, our index.html file only relies on utils.js and utils.css,
			// so we don't want it to includes app.js or app.css.
			chunks: ["index"]
		}),

		new HtmlWebpackPlugin({
			title: "App | Webpack Example",
			filename: "app.html",
			template: "./client/assets/templates/app.ejs",
			chunks: ["app"]
		}),

		// Extract JS module into a separate file.
		extractSass
	]
};
