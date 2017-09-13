// These shorthand import paths work because we have already resolved our paths in webpack config.
import React from "react";
import ReactDOM from "react-dom";

import Component from "scripts/react-components/component";

// Import stylesheets.
import "stylesheets/css/app";

class App extends React.Component {
	render() {
		return (
			<div>
				<h1>React App</h1>
				<Component />
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
