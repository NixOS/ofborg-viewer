const infra = "ofborg.org";

const WELL_KNOWN = `https://logs.${infra}/logs`;
const SOCK = `wss://messages.ofborg.org:15673/ws/`;
const SOCK_VHOST = `ofborg`;
const AUTH = "ofborg-logviewer";
const MAX_LINES = 25000;

export {SOCK, SOCK_VHOST, AUTH, MAX_LINES, WELL_KNOWN};
