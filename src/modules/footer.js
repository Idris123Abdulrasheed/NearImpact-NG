import "./styles/footer.css";
import logo from "../assets/brand/logo.png";
// Static section, no interactivity, see DEVELOPERS NOTE below.

// ① RENDERING:
export function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer__wrap">

        <div class="footer__grid">

          <!-- brand + newsletter signup -->
          <div class="footer__brand">
            <div class="footer__logo">
              <img src="${logo}" alt="NearImpact Nigeria logo" />

            </div>

            <p>
              Connecting people, organisations and communities to sustainable impact near them.
            </p>

            <form class="footer__newsletter">
              <input type="email" placeholder="Enter your email" />
              <button type="button">Subscribe</button>
            </form>
          </div>

          <!-- quick links column -->
          <div class="footer__col footer__col--quicklinks">
            <h3>Quick Links</h3>
            <a href="#">Home</a>
            <a href="#discover">Projects</a>
            <a href="#opportunities">Opportunities</a>
            <a href="#sdgs">SDGs</a>
            <a href="#community">Community</a>
          </div>
 
          <!-- resources column -->
          <div class="footer__col footer__col--resources">
            <h3>Resources</h3>
            <a href="#faq">FAQ</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>

          <!-- contact column + socials -->
          <div class="footer__col footer__col--contact">
            <h3>Contact Us</h3>

            <div class="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 21s-7-6.5-7-11.5A7 7 0 0 1 19 9.5C19 14.5 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              <span>Opposite Small Market, Oboroke Ihima, Kogi State.</span>
            </div>

            <div class="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 1-2Z" />
              </svg>
              <span>+234901 746 2002, +234816 913 8868</span>
            </div>

            <div class="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 6 8 6 8-6" />
              </svg>
              <span>idrisadeizaabdulrasheed@gmail.com</span>
            </div>

            <div class="footer__socials">

              <a href="#" aria-label="YouTube">
                <img src="/socials/youtube.png" alt="YouTube">
              </a>

              <a href="#" aria-label="LinkedIn">
                <img src="/socials/linkedin.png" alt="LinkedIn">
              </a>

              <a href="#" aria-label="Facebook">
                <img src="/socials/facebook.png" alt="Facebook">
              </a>

              <a href="#" aria-label="Instagram">
                <img src="/socials/instagram.jpg" alt="Instagram">
              </a>

              <a href="#" aria-label="Whatsapp">
                <img src="/socials/whatsapp.jpeg" alt="Whatsapp">
              </a>

              <!--<a href="#" class="whatsapp-icon" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.7.8-.9 1c-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3c0 1.3 1 2.6 1.1 2.8.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3Z" />
                </svg>
              </a>-->

            </div>
          </div>

        </div>

        <div class="footer__bottom">
          <p>© 2026 NearImpact Nigeria. All rights reserved.</p>
          <p>Built for local action and global goals.</p>
        </div>

      </div>
    </footer>
  `;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The site footer containig brand block, three link/contact columns, and a bottom copyright bar. 
  Fully static, no initFooter() needed since nothing here reacts to state or user 
  interaction beyond plain HTML form/link behavior.

  Class names follow BEM where "footer" is the block. The three columns
  (Quick Links, Resources, Contact) all share a common footer__col
  base class plus a modifier (--quicklinks/--resources/--contact),
  since each one is the exact same structural element.

  We have a chunk of COMMENTED-OUT code (an
  alternate inline-SVG WhatsApp icon, currently unused in favor of the
  .png version above it). Note the name does not follow BEM yet..


  BLOCKS DEFINITIONS:
  ① RENDERING  — the whole footer in one function, broken into
                brand+newsletter, quicklinks, resources, contact+socials


  CLASS NAME GLOSSARY:
  .footer                    The whole footer element.
  .footer__wrap              Width-constrained inner wrapper.
  .footer__grid              The top grid: brand column + the three
                              link/contact columns.
  .footer__brand              The brand/logo/newsletter column.
  .footer__logo               Just the logo image wrapper.
  .footer__newsletter          The email signup form.
  .footer__col                 Shared base for the three link/contact
                              columns.
  .footer__col--quicklinks     Modifier — the Quick Links column.
  .footer__col--resources      Modifier — the Resources column.
  .footer__col--contact        Modifier — the Contact Us column.
  .footer__contact-item        One row inside the contact column
                              (address, phone, email — each with its
                              own icon).
  .footer__socials              Row of social platform icon links.
  .footer__bottom               The copyright bar at the very bottom.


*/