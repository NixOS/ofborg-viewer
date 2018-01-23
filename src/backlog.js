const WELL_KNOWN = "https://logs.nix.gsc.io/logs";

class Backlog {
	static get(routing, id) {
		return fetch(`${WELL_KNOWN}/${routing}/${id}`, {mode: "cors"})
			.then((response) => response.text())
		;
	}
}


export default Backlog;
