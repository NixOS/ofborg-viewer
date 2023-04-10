const infra = "ofborg.org";

const WELL_KNOWN = `https://logs.${infra}/logs`;
const SOCK = `wss://devoted-teal-duck.rmq.cloudamqp.com/ws/`;
const SOCK_VHOST = `ofborg`;
const AUTH = "logviewer";
const MAX_LINES = 25000;

export {SOCK, SOCK_VHOST, AUTH, MAX_LINES, WELL_KNOWN};
