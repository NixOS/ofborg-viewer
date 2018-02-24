const infra = "nix.gsc.io";

const WELL_KNOWN = `https://logs.${infra}/logs`;
const SOCK = `wss://events.${infra}:15671/ws`;
const AUTH = "logstream";
const MAX_LINES = 25000;

export {SOCK, AUTH, MAX_LINES, WELL_KNOWN};
