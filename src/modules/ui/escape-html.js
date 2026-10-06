// Makes text safe to drop into innerHTML, in element content AND in
// quoted attributes. DEVELOPERS NOTE at the bottom.

// ① ESCAPING:
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Impactmaker profiles are now typed in by visitors, so every piece of
  text that comes back from the API and goes into a template string
  MUST pass through escapeHtml() first. Otherwise someone could submit
  a "name" containing a <script> tag and run it in every visitor's
  browser (cross-site scripting).

  search.js has its own DOM-based copy that escapes < and & but not
  quotes; this one also handles quotes, so it is safe inside
  attributes like alt="..." and href="...". Use this one for new code.

  BLOCKS DEFINITIONS:
  ① ESCAPING  — escapeHtml(), the only function in the file.
*/
