import bsod from "./lib/bsod";
import { Client } from "@stomp/stompjs";
import { SOCK, AUTH, SOCK_VHOST } from "./config";

/**
 * Listener interface; subscribes to the queue and uses the given callback.
 */
class Listener {
  constructor({ key, logger, fn }) {
    this.subscription = null;
    this.key = key;
    this.fn = fn;
    this.logger = logger;
    this.logger("Socket created...", "ofborg");
    this.client = new Client({
      brokerURL: SOCK,
      connectHeaders: {
        login: AUTH,
        passcode: AUTH,
        host: SOCK_VHOST,
      },
      onStompError: (err) => {
        this.handle_failure(err);
      },
      onWebSocketError: (err) => {
        this.handle_failure(err);
      },
      onConnect: () => {
        this.connected();
      },
    });

    this.client.debug = (str) => this.debug_callback(str);
  }

  /**
   * Catches stomp.js debug log.
   * window.DEBUG can be set (using param debug=true) to help debug issues.
   */
  debug_callback(str) {
    if (window.DEBUG) {
      /* eslint-disable no-control-regex */
      const cleaned = str.replace(/[\x00\s]+$/g, "").trim();
      /* eslint-enable */
      this.logger(cleaned, "stomp");
    }
  }

  disconnect() {
    this.logger("Disconnecting...", "ofborg");
    this.client.disconnect(() => this.logger("Disconnected.", "ofborg"));
  }

  connected() {
    this.succesfully_connected = true;
    this.logger("Connected...", "ofborg");
    this.logger(`Subscribing to "${this.key}"...`, "ofborg");
    this.subscription = this.client.subscribe(
      `/exchange/logs/${encodeURIComponent(this.key)}`,
      (m) => this.handle_message(JSON.parse(m.body), m),
    );
  }

  handle_failure(err) {
    console.error("STOMP error...");
    console.error(err);
    if (this.succesfully_connected) {
      this.logger(
        "Uhhh, we lost the websocket connection... refresh to fix this issue.",
        "stderr",
      );
    } else {
      bsod(
        "Couldn't connect to websocket.\n\nMake sure content blockers (noscript, µblock) are not blocking websockets.",
      );
    }
  }

  /**
   * Handler for messages.
   */
  handle_message(msg, raw) {
    // Get the routing key, which will be used to fetch the backlogs.
    const destination = raw.headers["destination"].split("/");
    const routing = decodeURIComponent(destination[destination.length - 1]);
    this.receive(msg, routing);
  }

  /**
   * Conditionally calls the callback registered.
   */
  receive(...args) {
    if (this.fn) {
      return this.fn(...args);
    }
  }
}

export default Listener;
