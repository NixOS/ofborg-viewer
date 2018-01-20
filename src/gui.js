import html from "./lib/html";
import bsod from "./lib/bsod";

/**
 * The line-oriented GUI for the application.
 *
 * The backlog can be filled with 
 */
class Gui {
	constructor() {
		console.log("Creating log interface...."); // eslint-disable-line
		this.$app = null;
		this.$log = null;
		this.$backlog = null;

		this.setFollowing(true);

		this.$app = window.document.querySelectorAll("#ofborg-logviewer .app")[0];
		if (!this.$app) {
			return bsod("Couldn't hook app.");
		}

		this.$backlog = html(`<div class="backlog logger"></div>`)[0];
		this.$log = html(`<div class="logger"></div>`)[0];
		// Empties app...
		this.$app.innerHTML = "";

		// Appends the "app parts"
		this.$app.appendChild(this.$backlog);
		this.$app.appendChild(this.$log);

		// Hooks on scroll
		window.addEventListener("scroll", () => this.watchScroll());
		console.log("... log interface created."); // eslint-disable-line
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
		// The replace regex allows more intelligent splitting.
		// It will prefer splitting words, this way.
		el.innerText = text.replace(/([,-=/])/g, "\u200B$1\u200B");
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

export default Gui;
