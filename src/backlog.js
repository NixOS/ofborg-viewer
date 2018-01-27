class Backlog {
	static get(routing, id) {
		return fetch(`${window.WELL_KNOWN}/${routing}/${id}`, {mode: "cors"})
			.then((response) => response.text())
		;
	}
}


export default Backlog;
