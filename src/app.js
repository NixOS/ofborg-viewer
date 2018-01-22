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
		this.log("→ logger starting", null, {tag: "ofborg"});
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
			logger: (msg) => this.log(msg, null, {tag: "ofborg"}),
			fn: (msg) => this.from_listener(msg),
		});
	}

	from_listener(message) {
		const {output, attempt_id, line_number} = message;

		if (Object.keys(this.gui.logs).indexOf(attempt_id) === -1) {
			const log = this.gui.addLog(attempt_id);
		}

		return this.log(output, attempt_id, {
			tag: "stdout",
			title: `#${line_number}`,
		});
	}

	/**
	 * Logs to the console.
	 *
	 * This can receive a class for some more styling.
	 */
	log(msg, log, {tag, title} = {}) {
		this.gui.log({
			msg,
			log,
			tag,
			title,
		});
	}
}

export default App;
