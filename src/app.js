import ready from "./lib/ready";
import Listener from "./listener";
import Gui from "./gui";
import Backlog from "./backlog";
import State from "./state";

const MAN = `
ofborg-viewer(web)            ofborg web interface           ofborg-viewer(web)

NAME
    ofborg-viewer — Build logs web interface

DESCRIPTION
    ofborg-viewer is a web interface that aggregates  the currently in-progress
    build logs made by ofborg.

    New logs for the given build will  be added to  the discovered logs  at the
    top of the interface. Clicking them or activating them through the keyboard
    shortcuts of your browser will show them.

    The  log will  autoscroll  when  the logger  interface  is scrolled  at the
    bottom. Scrolling up will stop the autoscroll until scrolled back down.

`;

/**
 * The logger app.
 */
class App {
	constructor() {
		// Only "boot" the app when the DOM is ready.
		ready(() => this.boot());

		// To use as event listener targets.
		this.handle_select = this.handle_select.bind(this);
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

		this.gui.addEventListener("select", this.handle_select);

		this.log("$ man ofborg-viewer", null, {tag: "ofborg"});
		this.log(MAN, null, {tag: "man"});

		this.log("→ logger starting", null, {tag: "ofborg"});
		window.document.title = "Log viewer started...";

		this.state = new State();
		this.state.on_state_change = (s) => this.handle_state_change(s);
		this.handle_state_change(this.state.params);
	}

	handle_select(selected) {
		this.state.set_state({attempt_id: selected["name"]});
	}

	handle_state_change(new_state) {
		const {attempt_id, key} = new_state;
		const {logs} = this.gui;

		// Loading parameters
		if (!key) {
			this.log("!! No key parameter... stopping now.", "ofborg");
			return;
		}

		// This will allow some app parts to log more information.
		if (new_state["debug"]) {
			window.DEBUG = true;
		}

		window.document.title = `Log viewer [${key}]`;

		// This is set only once in the lifetime of the app and is expected
		// never to change.
		// FIXME : Allow key to change live.
		if (!this.key) {
			this.key = key;

			// Pings the logger API for existing logs.
			// Those logs can be either live or complete.
			this.load_logs(() => {
				// Selects the log if loaded async.
				if (logs[attempt_id]) {
					logs[attempt_id].select();
				}
			});
		}

		// Attempts to select the log.
		if (logs[attempt_id]) {
			logs[attempt_id].select();
		}

		if (!this.listener) {
			// Starts the listener.
			this.listener = new Listener({
				key: new_state["key"],
				logger: (msg, tag) => this.log(msg, null, {tag}),
				fn: (...msg) => this.from_listener(...msg),
			});
		}
	}

	load_logs(callback) {
		this.log(`→ fetching existing attempts for ${this.key}`, null, {tag: "ofborg"});
		return fetch(`${window.WELL_KNOWN}/${this.key}`, {mode: "cors"})
			.then((response) => response.json())
			.then(({attempts}) => Object.keys(attempts).forEach((attempt_id) => {
				this.log(`→ fetching log for ${attempt_id}`, null, {tag: "ofborg"});
				const attempt = attempts[attempt_id];
				const log = this.gui.addLog(attempt_id, attempt["metadata"]);
				const {log_url} = attempt;
				fetch(log_url, {mode: "cors"})
					.then((response) => response.text())
					.then((txt) => {
						const lines = txt.split("\n");
						log.backlog(lines);
						this.log(`→ added log for ${attempt_id}`, null, {tag: "ofborg"});
					})
				;
			}))
			.then(() => callback())
		;
	}

	from_listener(message, routing_key) {
		const {output, attempt_id, line_number} = message;

		// Probably a build-start message.
		if (!output) {
			this.gui.addLog(attempt_id, message);
			return;
		}

		// Opening a new log?
		// It should already have been created, but just in case.
		if (Object.keys(this.gui.logs).indexOf(attempt_id) === -1) {
			const log = this.gui.addLog(attempt_id);

			// Assumes if there was no log open for attempt, it needs to fetch backlog.
			if (line_number > 1) {
				// FIXME : Loop backlog fetching until all lines are found up to line_number.
				log.backlog_loading();
				Backlog.get(routing_key, attempt_id)
					.then((txt) => {
						const lines = txt.split("\n").slice(0, line_number - 1);
						log.backlog(lines);
					})
					.catch((err) => {
						log.backlog_error(err);
					})
				;
			}
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
