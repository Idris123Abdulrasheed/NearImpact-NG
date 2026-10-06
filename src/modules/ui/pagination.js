import "../styles/pagination.css";
// Numbered page links, shared by any list page. DEVELOPERS NOTE at the bottom.

// ① PAGE NUMBERS:
// 1 … 4 5 6 … 19 style: first, last, and the current page +/- 1.
export function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const wanted = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const output = [];
  wanted.forEach((n, i) => {
    if (i > 0 && n - wanted[i - 1] > 1) output.push("…");
    output.push(n);
  });
  return output;
}

// ② RENDERING:
// hrefFor(n) returns the link for page n (the caller knows its own filters).
export function renderPagination(current, total, hrefFor) {
  return pageNumbers(current, total)
    .map((n) =>
      n === "…"
        ? `<span class="pagination__gap" aria-hidden="true">…</span>`
        : `<a class="pagination__page${n === current ? " is-current" : ""}"
              href="${hrefFor(n)}"
              ${n === current ? 'aria-current="page"' : ""}
              aria-label="Page ${n}">${n}</a>`
    )
    .join("");
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The numbered pagination from all-opportunities.js, made reusable. It
  only builds the links; the caller decides what a link looks like
  (hrefFor), so filters stay in the caller's URL logic. all-projects.js
  is the first user. all-opportunities.js still has its own copy; it can
  switch to this later by renaming its classes to pagination__*, which
  is optional cleanup, not required.

  BLOCKS DEFINITIONS:
  ① PAGE NUMBERS — pageNumbers() picks which numbers to show.
  ② RENDERING    — renderPagination() builds the links.

  CLASS NAME GLOSSARY:
  .pagination         The nav wrapper (the caller's own element can also
                      carry this class).
  .pagination__page   One page-number link.
  .pagination__gap    The "…" between numbers.
  State class "is-current" (active page) is deliberately not BEM'd.
*/
