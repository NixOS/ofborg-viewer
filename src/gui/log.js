import html from "../lib/html";
import eventable from "../mixins/eventable";

const SEP = " ╱ ";
const MAX_LINES = 25000;

/**
 * The line-oriented GUI for the application.
 *
 * It presents a (1) node that should be added by the owner to the DOM.
 */
class Log {
	constructor(name, metadata = null, {label = null} = {}) {
		eventable(this);
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

		if (metadata) {
			const {attempt_id, identity, system} = metadata;
			const txt = [];
			txt.push(`id: ${identity}`);
			txt.push(`system: ${system}`);
			this.$identity.innerText = " " + txt.join(SEP) + SEP;
			this.$identity.title = JSON.stringify(metadata, null, "  ");
			$label.title = txt.concat([`attempt_id: ${attempt_id}`]).join(SEP);
		}

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
		this.sendEvent("select", this);
	}

	unselect() {
		this.$node.classList.remove("selected");
		this.$tab.classList.remove("selected");
		this.sendEvent("unselect");
	}

	backlog(lines, log_url = null) {
		this.$backlog.classList.remove("loading");
		// Empties backlog...
		const start = Math.max(lines.length - MAX_LINES, 0);
		const length = Math.min(lines.length, MAX_LINES);
		let line_no = start + 1;
		const fragment = document.createDocumentFragment(length);
		this.$backlog.innerText = `(Rendering backlog, ${length} lines long...)**`;
		lines.slice(start, lines.length)
			.forEach((text) => {
				const el = document.createElement("div");
				el.title = `#${line_no}`;
				line_no += 1;
				el.innerText = text;
				fragment.appendChild(el);
			});
		const $link = html(`<a class="truncated">Log has been truncated... (${length} lines shown out of ${lines.length}.)</a>`)[0];
		if (log_url) {
			$link.href = log_url;
		}
		if (length < lines.length) {
			this.$backlog.innerText = `(Rendering backlog, ${length} lines out of ${lines.length}...)`;
		}
		else {
			this.$backlog.innerText = `(Rendering backlog, ${length} lines long...)`;
		}

		// Delays appendChild to allow reflow for previous message.
		window.setTimeout(() => {
			this.$backlog.innerText = "";
			if (length < lines.length) {
				this.$backlog.appendChild($link);
			}
			this.$backlog.appendChild(fragment);
			this.sendEvent("backlog", this);
		}, 10);
	}

	backlog_error(err) {
		this.$backlog.classList.remove("loading");
		this.$backlog.innerText = `An error happened fetching the backlog...\n${err}`;
	}

	backlog_loading() {
		this.$backlog.classList.add("loading");
		this.$backlog.innerText = `Fetching the backlog...`;
	}
}

export default Log;
