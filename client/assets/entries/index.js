// Import bootstrap.
// Make sure that node_modules/bootstrap is not excluded,
// because we want webpack to run test on bootstrap source file,
// which lives in node_modules folder.
import "bootstrap/dist/css/bootstrap.min.css";

// Import custom CSS for this module.
import "stylesheets/sass/style.scss";

$(document).ready(function() {
    const message = "Hello World!";
    console.log(message);
});


