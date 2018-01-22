import App from "./app";

/**
 * Entry-point of the application.
 *
 * If any polyfilling is needed, do it here.
 * Then, start the app.
 */

// Fetch compat.
{
	const FETCH_MISSING = "fetch is required for this app to work properly.";

	/**
	 * Acts mostly like a promise.
	 */
	const pseudo_promise = function() {
		return {
			then: () => pseudo_promise(),
			catch: (fn) => fn(new Error(FETCH_MISSING)),
		};
	};

	/**
	 * Replaces fetch when fetch is missing.
	 */
	const pseudo_fetch = function() { // eslint-disable-line
		return pseudo_promise();
	};

	// Ensures calls to `fetch` don't crash the app.
	if (!window.fetch) {
		console.warn(FETCH_MISSING); // eslint-disable-line
		window.fetch = pseudo_fetch; // eslint-disable-line
	}
}

// Starts the app.
window.APP = new App();
