import queryString from "query-string";
import html from "./lib/html";
import ready from "./lib/ready";
import bsod from "./lib/bsod";
import Listener from "./listener";

/**
 * The logger app.
 */
class App {
	constructor() {
		this.$app = null;
		this.$log = null;

		// Only "boot" the app when the DOM is ready.
		ready(() => this.boot())
	}

	boot() {
		this.setFollowing(true);

		window.document.title = "Log viewer starting...";
		this.$app = window.document.querySelectorAll("#ofborg-logviewer .app")[0];
		if (!this.$app) {
			return bsod("Couldn't hook app.");
		}
		console.log("Creating log interface....");
		this.$log = html(`<div class="logger"></div>`)[0];
		this.log("→ logger starting", "ofborg");
		// Empties app...
		this.$app.innerHTML = "";
		// Appends our logging target.
		this.$app.appendChild(this.$log);
		console.log("... log interface created.")
		window.document.title = "Log viewer started...";

		// Hooks on scroll
		window.addEventListener("scroll", () => this.watchScroll())

		// Loading parameters
		const params = queryString.parse(location.search);
		if (!params["key"]) {
			this.log("!! No key parameter... stopping now.", "ofborg");
			return;
		}

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

	setFollowing(following) {
		if (following !== this.following) {
			this.following = following;

			const body = window.document.body;
			if (following) {
				body.classList.add("following");
				body.classList.remove("not-following");
			}
			else {
				body.classList.add("not-following");
				body.classList.remove("following");
			}
		}
	}

	/**
	 * Logs to the console.
	 *
	 * This can receive a class for some more styling.
	 */
	log(text, cls = "") {
		const el = html(`<div class="${cls}"></div>`)[0];
		el.innerText = text;
		this.$log.appendChild(el);

		const body = window.document.body;

		if (this.following) {
			body.scrollTop = body.scrollHeight;
		}
	}

	/**
	 * Marks the window as auto-scrollable or not.
	 */
	watchScroll() {
		const body = window.document.body;
		const scroll_bottom = Math.round(body.scrollTop) + Math.round(window.innerHeight);
		const total_height = body.scrollHeight;

		// Some fudging around because of higher and fractional DPI issues.
		// On 1.5 DPI chrome, it is possible to get the scroll to bottom
		// not matching with the total height *some* times.
		this.setFollowing(Math.abs(total_height - scroll_bottom) < 5);
	}
}

// Starts the app.
window.APP = new App();
