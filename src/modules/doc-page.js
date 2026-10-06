import "./styles/doc-page.css";
// Renders a long-form text page (About, Privacy, Terms) from plain
// data. DEVELOPERS NOTE at the bottom has the details.

// ① RENDERING — SECTION:
function renderSection({ id, heading, paragraphs = [], items = [] }) {
  return `
    <section class="doc-page__section" id="${id}">
      <h2>${heading}</h2>
      ${paragraphs.map((p) => `<p>${p}</p>`).join("")}
      ${items.length ? `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
    </section>
  `;
}

// ② RENDERING — PAGE:
export function renderDocPage({ title, intro, updated, sections }) {
  return `
    <main class="doc-page">
      <div class="doc-page__wrap">

        <header class="doc-page__header">
          <h1>${title}</h1>
          <p class="doc-page__intro">${intro}</p>
          ${updated ? `<p class="doc-page__updated">Last updated: ${updated}</p>` : ""}
        </header>

        <nav class="doc-page__toc" aria-label="On this page">
          <h2>On this page</h2>
          <ul>
            ${sections.map((s) => `<li><a href="#${s.id}">${s.heading}</a></li>`).join("")}
          </ul>
        </nav>

        ${sections.map(renderSection).join("")}

      </div>
    </main>
  `;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  One renderer for every text-heavy page. A page is just data:
    { title, intro, updated?, sections: [{ id, heading, paragraphs?, items? }] }
  so About, Privacy and Terms share one layout and one stylesheet,
  and adding a new page means writing content, not markup. No init
  function: the page is static, and the "On this page" links are
  plain in-page anchors.

  Strings in paragraphs/items are trusted HTML written in our own
  source files (so they can contain links). Never feed user input
  into this function.

  Class names follow BEM where "doc-page" is the block.

  BLOCKS DEFINITIONS:
  ① RENDERING — SECTION  — one heading + paragraphs + optional bullet list.
  ② RENDERING — PAGE     — title block, "On this page" list, all sections.

  CLASS NAME GLOSSARY:
  .doc-page            The <main> element.
  .doc-page__wrap      Reading-width wrapper.
  .doc-page__header    Title, intro, last-updated line.
  .doc-page__intro     The lead paragraph under the title.
  .doc-page__updated   The "Last updated" line.
  .doc-page__toc       The "On this page" link list.
  .doc-page__section   One titled block of content.
*/
