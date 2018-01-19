import html from "./lib/html";
import ready from "./lib/ready";
import bsod from "./lib/bsod";

/**
 * The logger app.
 */
class App {
	constructor() {
		this.$app = null;
		this.$log = null;

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

		// Hooks on scroll
		window.addEventListener("scroll", () => this.watchScroll())
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

		if (APP.following) {
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
		APP.setFollowing(Math.abs(total_height - scroll_bottom) < 5);
	}
}

// Starts the app.
window.APP = new App();
