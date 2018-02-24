import {WELL_KNOWN} from "./config";
class Backlog {
	static get_url(routing, id) {
		return `${WELL_KNOWN}/${routing}/${id}`;
	}
}

export default Backlog;
