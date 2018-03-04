const infra = "nix.ci";

const WELL_KNOWN = `https://logs.${infra}/logs`;
const SOCK = `wss://events.${infra}:15671/ws`;
const SOCK_VHOST = `ofborg`;
const AUTH = "logstream";
const MAX_LINES = 25000;

export {SOCK, SOCK_VHOST, AUTH, MAX_LINES, WELL_KNOWN};
