import html from "./lib/html";
import ready from "./lib/ready";
import bsod from "./lib/bsod";

let $app = null;
let $log = null;

/**
 * Logs to the console.
 *
 * This can receive a class for some more styling.
 */
const log = function(text, cls = "") {
	const el = html(`<div class="${cls}"></div>`)[0];
	el.innerText = text;
	$log.appendChild(el);
}

// Initializes the app.
ready(function() {
	window.document.title = "Log viewer starting...";
	$app = window.document.querySelectorAll("#ofborg-logviewer .app")[0];
	if (!$app) {
		return bsod("Couldn't hook app.");
	}
	console.log("Creating log interface....");
	$log = html(`<div class="logger"></div>`)[0];
	log("→ logger starting", "ofborg");
	// Empties app...
	$app.innerHTML = "";
	// Appends our logging target.
	$app.appendChild($log);
	console.log("... log interface created.")
})
