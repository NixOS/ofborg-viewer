class Backlog {
	static get_url(routing, id) {
		return `${window.WELL_KNOWN}/${routing}/${id}`;
	}
}

export default Backlog;
