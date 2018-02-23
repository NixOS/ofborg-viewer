import html from "../lib/html";

/**
 * The line-oriented GUI for the application.
 *
 * It presents a (1) node that should be added by the owner to the DOM.
 */
class Log {
	constructor(name, metadata = null, {label = null} = {}) {
		this.name = name;
		this.$node = html(`<div class="logger"></div>`)[0];
		this.$node.classList.add(`name__${name.replace(/[^a-zA-Z0-9]/g, "_")}`);

		let label_text = label;

		// Makes a default label...
		if (!label_text) {
			label_text = name;

			// For UUID-like labels
			// The chances of hitting both conditions on a custom-made string is
			// quite low.
			if (label_text.length === 36 && label_text.split("-").length === 5) {
				label_text = name
					.split("-")
					.splice(0, 2)
					.join("-");
			}
		}

		this.$backlog = html(`<div class="backlog logger-log"></div>`)[0];
		this.$log = html(`<div class="newlog logger-log"></div>`)[0];
		// Empties app...
		this.$node.innerHTML = "";

		if (metadata) {
			this.$identity = html(`<div class="identity"></div>`)[0];
			this.$node.appendChild(this.$identity);
			const {identity, system} = metadata;
			const txt = [];
			txt.push(`id: ${identity}`);
			txt.push(`system: ${system}`);
			txt.push(` `);
			this.$identity.innerText = " " + txt.join(" ╱ ");
		}

		// Appends the "app parts"
		this.$node.appendChild(this.$backlog);
		this.$node.appendChild(this.$log);

		// The tab used for navigation.
		this.$tab = html(`<li><label><input type="radio" name="selected_tab"><span></span></label></li>`)[0];
		const radio = this.$tab.querySelectorAll("input")[0];
		const $label = this.$tab.querySelectorAll("label > span")[0];
		$label.innerText = label_text;
		radio.value = name;
		radio.onclick = () => {
			this.select();
		};

		radio.onfocus = () => {
			this.$tab.classList.add("__focus");
		};
		radio.onblur = () => {
			this.$tab.classList.remove("__focus");
		};
	}

	/**
	 * Logs to the console.
	 *
	 * This can receive a class for some more styling.
	 */
	log(text, tag, {title}) {
		const el = html(`<div></div>`)[0];
		if (tag) {
			el.classList.add(tag);
		}
		if (title) {
			el.title = title;
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
		this.$tab.querySelectorAll("input")[0].checked = true;
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

	backlog(lines) {
		this.$backlog.classList.remove("loading");
		// Empties backlog...
		this.$backlog.innerText = "";
		let line_no = 1;
		lines.forEach((text) => {
			const el = html(`<div title="#${line_no}"></div>`)[0];
			line_no += 1;
			el.innerText = text;
			this.$backlog.appendChild(el);
		});
		if (this.on_backlog) {
			this.on_backlog();
		}
	}

	backlog_error(err) {
		this.$backlog.classList.remove("loading");
		this.$backlog.innerText = `An error happened fetching the backlog...\n${err}`;
	}

	backlog_loading() {
		this.$backlog.classList.add("loading");
	}
}

export default Log;
