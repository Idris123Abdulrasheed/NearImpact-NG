import "./styles/testimonials.css";
// Native horizontal scroll-snap, if our choice seems 
// unexplained, check the DEVELOPERS NOTE at the bottom.

// ① STORIES DATA:
const STORIES = [
  {
    quote: "NearImpact helped us find volunteers within our own community and grow our clean-up campaign faster than we expected.",
    initials: "AY",
    name: "Amina Yusuf",
    role: "NGO Coordinator, Lagos",
    avatarClass: "",
    featured: true,
  },
  {
    quote: "I found my first sustainability internship through a local project listed on the platform.",
    initials: "DO",
    name: "David Okafor",
    role: "Student Volunteer, Yaba",
    avatarClass: "orange",
  },
  {
    quote: "The SDG mapping made it easier for our team to show partners where our work fits.",
    initials: "KA",
    name: "Kemi Adewale",
    role: "Social Founder, Lekki",
    avatarClass: "blue",
  },
  {
    quote: "Listing our program on NearImpact brought in more consistent volunteers than any social post we've run.",
    initials: "TB",
    name: "Tunde Bello",
    role: "Program Lead, Ibadan",
    avatarClass: "clay",
  },
  {
    quote: "As a first-time applicant, the fellowship listings were clear enough that I actually finished the application.",
    initials: "CN",
    name: "Chiamaka Nwosu",
    role: "Fellowship Applicant, Enugu",
    avatarClass: "plum",
  },
  {
    quote: "We used the SDG tags to report our impact to funders — saved us a full week of manual mapping.",
    initials: "HS",
    name: "Halima Suleiman",
    role: "M&E Officer, Kano",
    avatarClass: "rose",
  },
];

// ② RENDERING:
export function renderTestimonials() {
  return `
    <section class="testimonials" id="stories">
      <div class="testimonials__wrap">

        <div class="testimonials__header">
          <h2>Our Testimonials</h2>
        </div>

        <div class="testimonials__carousel">
          <div class="testimonials__track" id="story-track" role="region" aria-label="User testimonials">
            ${STORIES.map(
              (s) => `
              <article class="testimonials__card${s.featured ? " testimonials__card--featured" : ""}">
                <div class="testimonials__quote-mark">"</div>
                <p>${s.quote}</p>
                <div class="testimonials__person">
                  <div class="testimonials__avatar${s.avatarClass ? " testimonials__avatar--" + s.avatarClass : ""}">${s.initials}</div>
                  <div>
                    <strong>${s.name}</strong>
                    <span>${s.role}</span>
                  </div>
                </div>
              </article>
            `
            ).join("")}
          </div>

          <div class="testimonials__nav">
            <button class="testimonials__nav-btn" id="stories-prev" aria-label="Previous testimonials">‹</button>
            <button class="testimonials__nav-btn" id="stories-next" aria-label="Next testimonials">›</button>
          </div>
        </div>

      </div>
    </section>
  `;
}

// ③ CAROUSEL CONTROL:
export function initTestimonials() {
  const track = document.getElementById("story-track");
  const prevBtn = document.getElementById("stories-prev");
  const nextBtn = document.getElementById("stories-next");
  if (!track || !prevBtn || !nextBtn) return;

  const scrollByCard = (direction) => {
    const card = track.querySelector(".testimonials__card");
    const step = card ? card.getBoundingClientRect().width + 22 : 300; // card width + gap
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  };

  prevBtn.addEventListener("click", () => scrollByCard(-1));
  nextBtn.addEventListener("click", () => scrollByCard(1));
  track.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);

  updateButtons();
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The testimonials carousel: a horizontal scroll-snap track, same
  pattern as the Community carousel (native browser scroll, not a
  JS-transform-based track). 

  The STORIES array is the single source of truth, so adding or 
  removing a testimonial is a one-line change, not editing many blocks.

  
 
  BLOCKS DEFINITIONS:
  ① STORIES DATA      — the actual testimonial records: quote,
                        initials, name, role, which avatar color
                        modifier to use, and whether this one's the
                        featured card.
  ② RENDERING          — builds the full carousel: header, the
                        scrollable track of cards, and the prev/next
                        nav buttons.
  ③ CAROUSEL CONTROL   — wires up prev/next scrolling (by exactly one
                        card-width + gap at a time)

  Class names follow BEM: the block is "testimonials". 

  CLASS NAME GLOSSARY:
  .testimonials                The whole section.
  .testimonials__wrap          Width-constrained inner wrapper.
  .testimonials__header        The "Our Testimonials" heading block.
  .testimonials__carousel      Positioning wrapper around the track +
                                nav buttons.
  .testimonials__track         The horizontally-scrolling row of cards.
  .testimonials__card          One testimonial card.
  .testimonials__card--featured  Modifier — the one card with a
                                distinct gradient background.
  .testimonials__quote-mark    The large decorative quotation mark.
  .testimonials__person        Row holding the avatar + name/role.
  .testimonials__avatar        The initials circle.
  .testimonials__avatar--*     Modifier setting that circle's
                                background color (orange/blue/clay/
                                plum/rose); value comes straight from
                                each entry's avatarClass field.
  .testimonials__nav           Wrapper around the two nav buttons.
  .testimonials__nav-btn       One prev/next button.

  
*/