import bsod from "./lib/bsod";
import Stomp from "@stomp/stompjs";

const SOCK = "wss://events.nix.gsc.io:15671/ws"
const AUTH = "logstream";

function toHex(str) {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i).toString(16);
	}
	return hex;
}


/**
 * "Fake listener interface".
 *
 * This is while waiting for actual data.
 */
class Listener {
	constructor(logger, fn) {
		this.fn = fn;
		this.logger = logger;
		this.logger("Socket created...", "ofborg")
		this.client = Stomp.client(SOCK);
		this.client.debug = (str) => this.debug_callback(str);
		this.connect();
	}

	/**
	 * Catches stomp.js debug log.
	 * window.DEBUG can be set to true to help debug issues.
	 */
	debug_callback(str) {
		if (window.DEBUG) {
			const cleaned = str.replace(/[\x00\s]+$/g, "").trim();
			this.logger(cleaned, "stomp")
		}
	}

	connect() {
		this.client.connect(
			AUTH, AUTH,
			() => this.connected(),
			() => bsod("Couldn't connect to websocket.")
		);
	}

	disconnect() {
		this.logger("Disconnecting...", "ofborg")
		this.client.disconnect(
			() => this.logger("Disconnected.", "ofborg")
		)
	}

	connected() {
		this.logger("Connected...", "ofborg")
	}

	receive(msg) {
		if (this.fn) {
			return this.fn(msg);
		}
	}
}

export default Listener;
