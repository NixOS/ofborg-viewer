import each from "lodash/each";
import pull from "lodash/pull";

/**
 * Adds functions looking like the EventTarget ones on `this`.
 *
 * This is NOT compatible, as they are not using Event.
 * They cannot preventDefault.
 * They cannot stop propagation.
 * There is no propagation.
 */
const eventable = (self) => {
  each(
    // Functions to mix in.
    {
      addEventListener(type, listener) {
        if (!this[`_${type}_listeners`]) {
          this[`_${type}_listeners`] = [];
        }
        const table = this[`_${type}_listeners`];

        table.push(listener);
      },
      removeEventListener(type, listener) {
        if (!this[`_${type}_listeners`]) {
          this[`_${type}_listeners`] = {};
        }
        const table = this[`_${type}_listeners`];

        pull(table, listener);
      },
      sendEvent(type, ...params) {
        if (!this[`_${type}_listeners`]) {
          this[`_${type}_listeners`] = [];
        }
        const table = this[`_${type}_listeners`];

        table.forEach((fn) => fn(...params));
      },
    },
    // Mixing in all those.
    (fn, name) => {
      self[name] = fn.bind(self);
    },
  );
};

export default eventable;
