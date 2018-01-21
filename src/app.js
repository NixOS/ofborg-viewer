import queryString from "query-string";
import ready from "./lib/ready";
import Listener from "./listener";
import Gui from "./gui";

/**
 * The logger app.
 */
class App {
	constructor() {
		// Only "boot" the app when the DOM is ready.
		ready(() => this.boot());
	}

	/**
	 * Hooks and starts the app.
	 *
	 * This means:
	 *   * Starts the GUI.
	 *   * Reads parameters.
	 *   * Starts the Listener.
	 */
	boot() {
		window.document.title = "Log viewer starting...";
		this.gui = new Gui();
		this.log("→ logger starting", "ofborg");
		window.document.title = "Log viewer started...";

		// Loading parameters
		const params = queryString.parse(location.search);
		if (!params["key"]) {
			this.log("!! No key parameter... stopping now.", "ofborg");
			return;
		}

		// This will allow some app parts to log more information.
		if (params["debug"]) {
			window.DEBUG = true;
		}

		window.document.title = `Log viewer [${params["key"]}]`;

		// Starts the listener.
		this.listener = new Listener({
			key: params["key"],
			logger: (...args) => this.log(...args),
			fn: (msg) => this.log(msg, "stdout")
		});
	}

	/**
	 * Logs to the console.
	 *
	 * This can receive a class for some more styling.
	 */
	log(text, cls = "") {
		this.gui.log(text, cls);
	}
}

export default App;
