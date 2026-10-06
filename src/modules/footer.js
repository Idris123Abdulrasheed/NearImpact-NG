import "./styles/footer.css";
import logo from "../assets/brand/logo.png";
import { QUICK_LINKS, RESOURCE_LINKS, CONTACT, SOCIALS } from "./data/footer-config.js";
// Footer markup + newsletter form wiring. Content lives in
// data/footer-config.js. DEVELOPERS NOTE at the bottom has the rest.

// ① HELPERS:
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ② RENDERING — PIECES:
function renderLinkColumn(title, links, modifier) {
  return `
    <nav class="footer__col footer__col--${modifier}" aria-label="${title}">
      <h3>${title}</h3>
      ${links.map((l) => `<a class="footer__link" href="${l.href}">${l.label}</a>`).join("")}
    </nav>
  `;
}

function renderNewsletter() {
  return `
    <form class="footer__newsletter" id="footer-newsletter" novalidate>
      <label class="footer__sr-only" for="footer-newsletter-email">Email address</label>
      <input
        type="email"
        id="footer-newsletter-email"
        name="email"
        placeholder="Enter your email"
        autocomplete="email"
        required
      />
      <button type="submit">Subscribe</button>
    </form>
    <p class="footer__newsletter-status" id="footer-newsletter-status" role="status" aria-live="polite"></p>
  `;
}

function renderContact() {
  const pinIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-6.5-7-11.5A7 7 0 0 1 19 9.5C19 14.5 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>`;
  const phoneIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 1-2Z" /></svg>`;
  const mailIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 6 8 6 8-6" /></svg>`;

  return `
    <div class="footer__col footer__col--contact">
      <h3>Contact Us</h3>

      <div class="footer__contact-item">
        ${pinIcon}
        <span>${CONTACT.address}</span>
      </div>

      <div class="footer__contact-item">
        ${phoneIcon}
        <span>
          <a class="footer__contact-link" href="${CONTACT.whatsapp.href}" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp: ${CONTACT.whatsapp.label}">${CONTACT.whatsapp.label} <small>WhatsApp</small></a>
          ${CONTACT.phones
            .map((p) => `<a class="footer__contact-link" href="${p.href}">${p.label}</a>`)
            .join("")}
        </span>
      </div>

      <div class="footer__contact-item">
        ${mailIcon}
        <a class="footer__contact-link" href="mailto:${CONTACT.email}">${CONTACT.email}</a>
      </div>
    </div>
  `;
}

function renderSocial({ name, href, img }) {
  const isReal = href !== "#";
  const external = isReal ? ' target="_blank" rel="noopener noreferrer"' : "";
  return `
    <a class="footer__social" href="${href}" aria-label="${name}"${external}>
      <img src="${img}" alt="" width="26" height="26" loading="lazy" />
    </a>
  `;
}

// ③ RENDERING — SHELL:
export function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer__wrap">

        <div class="footer__grid">

          <div class="footer__brand">
            <div class="footer__logo">
              <img src="${logo}" alt="NearImpact Nigeria logo" />
            </div>
            <p>
              Connecting people, organisations and communities to sustainable impact near them.
            </p>
            ${renderNewsletter()}
          </div>

          ${renderLinkColumn("Quick Links", QUICK_LINKS, "quicklinks")}
          ${renderLinkColumn("Resources", RESOURCE_LINKS, "resources")}
          ${renderContact()}

        </div>

        <div class="footer__socials" aria-label="Social media">
          ${SOCIALS.map(renderSocial).join("")}
        </div>

        <div class="footer__bottom">
          <p>© 2026 NearImpact Nigeria. All rights reserved.</p>
          <p>Built for local action and global goals.</p>
        </div>

      </div>
    </footer>
  `;
}

// ④ NEWSLETTER WIRING:
// Must run AFTER renderFooter()'s markup is in the live DOM (called from main.js).
export function initFooter() {
  const form = document.getElementById("footer-newsletter");
  const status = document.getElementById("footer-newsletter-status");
  if (!form || !status) return;

  const button = form.querySelector("button");

  function setStatus(message, kind = "") {
    status.textContent = message;
    status.classList.toggle("is-error", kind === "error");
    status.classList.toggle("is-success", kind === "success");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();

    if (!isValidEmail(email)) {
      setStatus("Enter a valid email address.", "error");
      return;
    }

    button.disabled = true;
    setStatus("Subscribing…");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || "Subscription failed. Try again.");

      form.reset();
      setStatus(data.message || "Thanks for subscribing!", "success");
    } catch (err) {
      setStatus(err.message || "Something went wrong. Try again.", "error");
    } finally {
      button.disabled = false;
    }
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The site footer: brand + newsletter, two link columns, contact
  details, a row of social icon buttons, and a copyright bar. Same
  render/init split as every other module: main.js drops
  renderFooter() on the page, then calls initFooter().

  What changed from the static version: all content now comes from
  data/footer-config.js; phone numbers and email are real tel:/mailto:
  links; socials are image buttons (public/socials/*.svg) in their own
  row below the grid; and the newsletter form is real. It posts to
  /api/newsletter and shows the result in an aria-live status line
  under the form instead of a toast, so screen readers announce it and
  nothing else needs importing.

  The form uses novalidate and checks the email itself, so the error
  message matches the rest of the site instead of the browser's
  default bubble. The server validates again; never trust the client.

  Class names follow BEM where "footer" is the block.

  BLOCKS DEFINITIONS:
  ① HELPERS              — isValidEmail(), same rule as the server.
  ② RENDERING — PIECES   — link column, newsletter form, contact
                           block, one social button.
  ③ RENDERING — SHELL    — renderFooter() assembles the pieces.
  ④ NEWSLETTER WIRING    — initFooter(): validate, POST, show status,
                           disable the button while the request runs.

  CLASS NAME GLOSSARY:
  .footer                        The whole footer.
  .footer__wrap                  Width-constrained inner wrapper.
  .footer__grid                  Brand column + three columns.
  .footer__brand                 Logo, tagline, newsletter.
  .footer__logo                  Logo wrapper.
  .footer__newsletter            The signup form.
  .footer__newsletter-status     Success/error line under the form.
  .footer__sr-only               Visually hidden, still read by screen
                                 readers (the email label).
  .footer__col                   Shared base for the three columns.
  .footer__col--quicklinks       Modifier — Quick Links.
  .footer__col--resources        Modifier — Resources.
  .footer__col--contact          Modifier — Contact Us.
  .footer__link                  One link in a link column.
  .footer__contact-item          One contact row (icon + text).
  .footer__contact-link          Clickable phone/email text.
  .footer__socials               Row of circular social buttons.
  .footer__social                One circular social button.
  .footer__bottom                Copyright bar.

  State classes is-error / is-success (on the status line) are flags
  this file flips, not BEM names.
*/
