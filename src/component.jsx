import React from "react";
import ReactDOM from "react-dom";

class Component extends React.Component {
	render() {
		return (
			<div>
				<h1>I am a React component!</h1>
			</div>
		)
	}
}

ReactDOM.render(<Component />, document.getElementById("component"));

export default Component;
