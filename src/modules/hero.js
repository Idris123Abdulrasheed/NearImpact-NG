// If the slideshow timing/autoplay logic below seems confusing, the
// DEVELOPERS NOTE at the bottom walks through why it's built this way.

import "./styles/hero.css";
import heroBg1 from "../assets/hero/hero-1.jpg";
import heroBg2 from "../assets/hero/hero-2.jpg";
import heroBg3 from "../assets/hero/hero-3.jpg";
import heroBg4 from "../assets/hero/hero-4.jpg";
import heroBg5 from "../assets/hero/hero-5.jpg";
import heroBg6 from "../assets/hero/hero-6.jpg";
import heroBg7 from "../assets/hero/hero-7.jpg";

// ① IMAGE ASSETS:
const heroImages = [heroBg1, heroBg2, heroBg3, heroBg4, heroBg5, heroBg6, heroBg7];

// ② RENDERING:
export function renderHero() {
  // background layers — one per image, first one starts active
  const layers = heroImages
    .map(
      (src, i) => `
      <div class="hero__bg-layer${i === 0 ? " active" : ""}"
           style="background-image: url(${src});"
           data-index="${i}"></div>`
    )
    .join("");

  // nav dots — one per image, mirrors the layers above
  const dots = heroImages
    .map(
      (_, i) => `
      <button class="hero__dot${i === 0 ? " active" : ""}"
              data-index="${i}"
              aria-label="Show slide ${i + 1}"
              aria-current="${i === 0 ? "true" : "false"}"></button>`
    )
    .join("");

  return `
    <section class="hero" aria-roledescription="carousel" aria-label="Featured impact photos">
      <div class="hero__bg-stack" aria-hidden="true">${layers}</div>
      <div class="hero__gradient" aria-hidden="true"></div>

      <button class="hero__arrow hero__arrow--prev" aria-label="Previous slide">&#8249;</button>
      <button class="hero__arrow hero__arrow--next" aria-label="Next slide">&#8250;</button>

      <div class="hero__overlay">
        <div class="hero__content">
          <h1>
            <span class="hero__line-one">Your <em>Impact</em></span>
            <span class="hero__line-two">Starts Nearby..</span>
          </h1>

          <p>
            Find sustainability projects and opportunities around you,
            connect with impactmakers, and explore SDG-aligned projects
            across Nigeria.
          </p>

          <div class="hero__actions">
            <a href="/all-opportunities.html" class="hero__cta--primary">Explore Opportunities</a>
            <a href="/become-impactmaker.html" class="hero__cta--secondary">Join NearImpact</a>
          </div>
        </div>
      </div>

      <div class="hero__dots" role="tablist" aria-label="Slide navigation">${dots}</div>
    </section>
  `;
}

// ③ SLIDESHOW CONTROL:
// Must run AFTER renderHero()'s markup is in the live DOM (called from main.js).
export function initHeroSlideshow({ intervalMs = 4000 } = {}) {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const layers = [...hero.querySelectorAll(".hero__bg-layer")];
  const dots = [...hero.querySelectorAll(".hero__dot")];
  const prevBtn = hero.querySelector(".hero__arrow--prev");
  const nextBtn = hero.querySelector(".hero__arrow--next");
  if (layers.length < 2) return; // nothing to rotate

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const state = { current: 0, timer: null };

  // core transition — swaps the active layer/dot pair
  function goToSlide(index) {
    const next = ((index % layers.length) + layers.length) % layers.length;
    layers[state.current].classList.remove("active");
    dots[state.current].classList.remove("active");
    dots[state.current].setAttribute("aria-current", "false");

    layers[next].classList.add("active");
    dots[next].classList.add("active");
    dots[next].setAttribute("aria-current", "true");

    state.current = next;
  }

  function nextSlide() {
    goToSlide(state.current + 1);
  }

  function prevSlide() {
    goToSlide(state.current - 1);
  }

  // autoplay
  function startAutoplay() {
    if (prefersReducedMotion || state.timer) return;
    state.timer = setInterval(nextSlide, intervalMs);
  }

  function stopAutoplay() {
    clearInterval(state.timer);
    state.timer = null;
  }

  // any deliberate interaction resets the autoplay clock
  function manualGoTo(index) {
    stopAutoplay();
    goToSlide(index);
    startAutoplay();
  }

  // event wiring
  nextBtn.addEventListener("click", () => manualGoTo(state.current + 1));
  prevBtn.addEventListener("click", () => manualGoTo(state.current - 1));

  hero.querySelector(".hero__dots").addEventListener("click", (e) => {
    const dot = e.target.closest(".hero__dot");
    if (!dot) return;
    manualGoTo(Number(dot.dataset.index));
  });

  hero.addEventListener("mouseenter", stopAutoplay);
  hero.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The homepage hero: a crossfading background slideshow behind a
  fixed text panel. Same split as every other component here:
  renderHero() returns markup as a string, main.js drops it on the
  page, then initHeroSlideshow() is called afterward to wire up the
  interactive parts.

  Slides are just DOM elements with an "active" class toggled on/off, 
  and CSS handles the actual crossfade via opacity transitions (see hero.css). 
  Class names follow BEM:
  "hero" is the block, and hero__something is a piece that only
  exists as part of it. 

  BLOCKS DEFINITIONS:
  ① IMAGE ASSETS       — the imported background photos, in slide
                         order.
  ② RENDERING          — builds the hero's full markup: background
                         layers, gradient overlay, arrows, the fixed
                         text panel, and the nav dots.
  ③ SLIDESHOW CONTROL  — everything that makes the slideshow actually
                         move: goToSlide() is the one function that
                         touches the DOM to swap slides, next/prev are
                         thin wrappers around it, autoplay starts/stops
                         a timer, manualGoTo() is what runs on any
                         deliberate click (arrow, dot) which stops
                         then restarts autoplay so a manual click
                         doesn't get instantly overridden by the timer.
                         Respects prefers-reduced-motion by simply
                         never starting the timer if it's set.

  CLASS NAME GLOSSARY:
  .hero               The whole hero section.
  .hero__bg-stack     Container holding all the background image
                       layers, stacked on top of each other.
  .hero__bg-layer     One full-bleed background image layer. Only
                       the one with "active" is visible at a time.
  .hero__gradient     The fade overlay that keeps the text panel
                       readable against the photo behind it.
  .hero__arrow        Prev/next slideshow buttons.
  .hero__arrow--prev  Positions the arrow on the left.
  .hero__arrow--next  Positions the arrow on the right.
  .hero__overlay      Wrapper that centers and constrains the text
                       panel's width.
  .hero__content      The actual text panel: heading, paragraph,
                       buttons.
  .hero__line-one     First line of the heading ("Your Impact").
  .hero__line-two     Second line ("Starts Nearby..").
  .hero__actions      Row holding the two call-to-action buttons.
  .hero__cta--primary   The filled/high-emphasis button ("Explore
                         Opportunities").
  .hero__cta--secondary The outlined/low-emphasis button ("Join
                         NearImpact").
  .hero__dots         Row of slide-indicator dots.
  .hero__dot          One dot. Only the one matching the current
                       slide has "active".

  State classes — "active" (on both .hero__bg-layer and .hero__dot)
  is deliberately not BEM-ified. It's the one thing initHeroSlideshow()
  moves around on every transition, so it's a flag for "currently
  showing," not a permanent structural name.
*/