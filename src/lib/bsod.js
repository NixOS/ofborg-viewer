/**
 * Borg screen of death.
 *
 * Replaces the whole body with an error message.
 */
const bsod = function(msg = "Something happened.") {
	const body = window.document.body;
	body.innerText =
`Hmmm, this is embarassing...

-> ${msg}
`;
	body.className = "bsod";
};

export default bsod;
