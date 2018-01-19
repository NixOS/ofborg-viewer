/**
 * "Fake listener interface".
 *
 * This is while waiting for actual data.
 */
class Listener {
	constructor() {
		this.fn = null;
		window.setInterval(() => this.receive("Totally legit line from the log."), 200);
	}

	receive(msg) {
		if (this.fn) {
			return this.fn(msg);
		}
	}

	setFunction(fn) {
		this.fn = fn;
	}
}

export default Listener;
