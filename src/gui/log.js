import html from "../lib/html";

/**
 * The line-oriented GUI for the application.
 *
 * It presents a (1) node that should be added by the owner to the DOM.
 */
class Log {
	constructor(name) {
		this.name = name;
		this.$node = html(`<div class="logger"></div>`)[0];
		this.$node.classList.add(`name__${name.replace(/[^a-zA-Z]/g, "_")}`);

		this.$backlog = html(`<div class="backlog logger-log"></div>`)[0];
		this.$log = html(`<div class="newlog logger-log"></div>`)[0];
		// Empties app...
		this.$node.innerHTML = "";

		// Appends the "app parts"
		this.$node.appendChild(this.$backlog);
		this.$node.appendChild(this.$log);

		// The tab used for navigation.
		this.$tab = html(`<li><a href="#"></a></li>`)[0];
		const a = this.$tab.children[0];
		a.innerText = name;
		a.onclick = (e) => {
			e.preventDefault();
			this.select();
		};
	}

	/**
	 * Logs to the console.
	 *
	 * This can receive a class for some more styling.
	 */
	log(text, tag) {
		const el = html(`<div></div>`)[0];
		if (tag) {
			el.classList.add(tag);
		}
		// The replace regex allows more intelligent splitting.
		// It will prefer splitting words, this way.
		// .replace(/([,-=/])/g, "\u200B$1\u200B");
		// It breaks search, until a solution is found we'll manage with crappy
		// line breaks.
		el.innerText = text;
		this.$log.appendChild(el);
	}

	select() {
		this.$node.classList.add("selected");
		this.$tab.classList.add("selected");
		if (this.on_select) {
			this.on_select(this);
		}
	}

	unselect() {
		this.$node.classList.remove("selected");
		this.$tab.classList.remove("selected");
		if (this.on_unselect) {
			this.on_unselect();
		}
	}
}

export default Log;
