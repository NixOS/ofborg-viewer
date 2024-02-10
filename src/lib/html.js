/**
 * Uses the DOM to parse HTML.
 */
const html = function (str) {
  const tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;

  return tmp.body.children;
};

export default html;
