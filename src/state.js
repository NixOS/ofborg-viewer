import queryString from "query-string";
import isEqual from "lodash/isEqual";

/**
 * Maps the state of the application to the history API.
 * This is used to make the current view linkable.
 * In the URL, the hash part is **reserved for line numbers**.
 * (line number links are not implemented yet.)
 */
class State {
  /**
   * Loads the state from URL.
   *
   * Prepares event listeners.
   */
  constructor() {
    const params = queryString.parse(location.search);
    const { history } = window;
    // Loads from params in URL, then history in order of importance.
    this.params = Object.assign({}, params, history.state);

    window.onpopstate = (e) => this.handle_popstate(e);
  }

  handle_popstate(e) {
    console.log(e);
    const { state } = e;
    if (state) {
      this.set_state(state, { push: false });
      if (this.on_state_change) {
        this.on_state_change(state);
      }
    }
  }

  set_state(new_state, { push } = { push: true }) {
    const { history } = window;
    const params = Object.assign({}, this.params, new_state);
    Object.keys(params).forEach((k) => {
      if (!params[k]) {
        Reflect.deleteProperty(params, k);
      }
    });

    if (isEqual(params, this.params)) {
      // set_state won't fire on "identity" change.
      return;
    }

    this.params = params;

    if (push) {
      history.pushState(this.params, "", `?${queryString.stringify(params)}`);
    }
  }
}

export default State;
