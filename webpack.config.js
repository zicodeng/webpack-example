// require is CommonJS whereas import is ES6 feature.
// Because webpack.config.js itself is not compiled by babel,
// so import statement cannot be used here.
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Define entries and their paths.
const entries = {
	index: "./client/assets/entries/index.js",
	app: "./client/assets/entries/app.jsx" 
};

// Create config for each entry.
var config = Object.keys(entries).map(function(entry) {
	return {
		// Define entry path.
		entry: entries[entry],
	
		// Define output path.
		output: {
			// The absolute path to the folder to which we want to output.
			// It will automatically create this folder if not found.
			// Global variable __dirname prints the absolute path to the directory
			// in which the currently executing file is located.
			path: __dirname + "/client/public/dist",
			// Output file name
			filename: entry + "-bundle.min.js"
		},
	
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
					// Because bootstrap css is not exported,
					// so we want webpack to run test on bootstrap source file,
					// which lives in node_modules folder.
					exclude: /node_modules\/(?!bootstrap\/).*/,
					// Loaders can be chained by passing multiple loaders.
					// The executing order is from right to left (last to first configured)
					use: ExtractTextPlugin.extract({
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
	
			// This plugin creates a separate source file (known as chunk),
			// consisting common modules shared between multiple entry points.
			// By splitting up our source code, our app will gain performance,
			// because the browser now doesn't have to load overlapped code multiple times.
			new webpack.optimize.CommonsChunkPlugin({
				name: "commons",
				filename: "commons.js"
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

			// Simplifies creation of HTML files to serve your webpack bundles. 
			// This is especially useful for webpack bundles 
			// that include a hash in the filename which changes every compilation. 
			// You can either let the plugin generate an HTML file for you, 
			// supply your own template using lodash templates or use your own loader.
			new HtmlWebpackPlugin({
				title: "Webpack Example",
				filename: entry + ".html",
				// Use custom template.
				template: "./client/assets/templates/" + entry + ".ejs",
				// Only include chunks that are relevant to this entry.
				// For example, our index.html file only relies on 
				// index-bundle.min.js and index-style.min.css,
				// so we don't want it to include app-bundle.min.js or app-style.min.css.
				chunks: ["commons", "main"]
			}),
	
			// Extract JS module into a separate file.
			new ExtractTextPlugin({
				filename: entry + "-style.min.css",
				disable: process.env.NODE_ENV === "development"
			})
		]
	};
});

module.exports = config;