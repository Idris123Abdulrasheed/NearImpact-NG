import "leaflet/dist/leaflet.css";
import "./styles/map.css";
import L from "leaflet";
import { getFilteredSortedProjects } from "./data/projects-query.js";
import { STATE_CENTROIDS } from "./data/geo.js";
import { getState, setState, subscribe } from "./state/map-store.js";
import { getTypeMeta } from "./data/type-meta.js";
import { icon } from "./data/icons.js";
// If any part of the code below feels unfamiliar, the DEVELOPERS NOTE
// at the bottom explains how map and list stay in sync without knowing about each other.
// ① MAP SETUP:
const NIGERIA_CENTER = [9.082, 8.6753];
const DEFAULT_ZOOM = 6;
const GESTURE_HINT_MS = 1400;
let map;
let markerLayer;
let userMarker;
let isFullscreen = false;
let hintTimer;
// "pointer: coarse" = the main input is a finger, not a mouse
const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;
// ② RENDERING:
export function renderMapHeader() {
  return `
    <section class="map__header-section" id="map">
      <div class="map__header-wrap">
        <div class="map__header">
          <div>
            <h2>Impact Around You</h2>
            <p>Select your state, or use your current location, to discover nearby projects and opportunities.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}
export function renderMapBody() {
  return `
    <div class="map__frame" id="map-frame">
      <div class="map__stage" id="map-stage">
        <div id="leaflet-map" class="map__canvas"></div>
        <button
          type="button"
          class="map__fullscreen-btn"
          id="map-fullscreen-btn"
          aria-label="Open full screen map"
          aria-pressed="false"
        >${icon("expand")}</button>
        <div class="map__gesture-hint" id="map-gesture-hint" aria-hidden="true">
          Use two fingers to move the map
        </div>
        <div class="map__credit" id="map-credit">
          <span class="map__credit-icon" aria-hidden="true">${icon("globe")}</span>
          <span id="map-credit-label">NearImpact Nigeria</span>
        </div>
      </div>
    </div>
  `;
}
// ③ INTERACTION MODE:
// One place decides how the map may be moved, so inline vs full screen
// can't drift apart. Inline on a phone: one finger scrolls the PAGE and
// two fingers move the map. Full screen, or a mouse: map moves freely.
function applyInteractionMode() {
  if (isFullscreen || !isTouchDevice()) map.dragging.enable();
  else map.dragging.disable();
  if (isFullscreen) map.scrollWheelZoom.enable();
  else map.scrollWheelZoom.disable();
}
function showGestureHint() {
  const hint = document.getElementById("map-gesture-hint");
  if (!hint) return;
  hint.classList.add("is-visible");
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => hint.classList.remove("is-visible"), GESTURE_HINT_MS);
}
// ④ FULL SCREEN:
// Pure CSS full screen (position: fixed), not the browser Fullscreen API:
// it opens instantly, works the same on iPhones, and keeps our own close
// button. See DEVELOPERS NOTE for the stacking/height details.
function setFullscreen(next) {
  const frame = document.getElementById("map-frame");
  const btn = document.getElementById("map-fullscreen-btn");
  if (!frame || !btn || next === isFullscreen) return;
  isFullscreen = next;
  // Pin the frame's height BEFORE the stage leaves the page flow, so the
  // content below doesn't jump up (and back) while full screen is on.
  frame.style.height = next ? `${frame.offsetHeight}px` : "";
  frame.classList.toggle("is-fullscreen", next);
  document.body.classList.toggle("no-scroll", next);
  btn.innerHTML = icon(next ? "collapse" : "expand");
  btn.setAttribute("aria-label", next ? "Exit full screen map" : "Open full screen map");
  btn.setAttribute("aria-pressed", String(next));
  applyInteractionMode();
  map.invalidateSize({ animate: false }); // tell Leaflet its box just changed size
}
// ⑤ MAP INITIALIZATION:
// Must run AFTER renderMapBody()'s markup is in the live DOM (called from main.js).
export function initMap() {
  const container = document.getElementById("leaflet-map");
  if (!container) return;
  map = L.map(container, {
    scrollWheelZoom: false,
    dragging: !isTouchDevice() // phones start with one-finger drag off
  }).setView(NIGERIA_CENTER, DEFAULT_ZOOM);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18
  }).addTo(map);
  markerLayer = L.layerGroup().addTo(map);
  // Scroll-zoom is off by default so the map doesn't trap the page scroll
  container.addEventListener("click", () => map.scrollWheelZoom.enable());
  container.addEventListener("mouseleave", () => {
    if (!isFullscreen) map.scrollWheelZoom.disable();
  });
  // One finger on the inline map on a phone: let the page scroll
  // (passive, never preventDefault) and show the hint instead.
  container.addEventListener(
    "touchmove",
    (e) => {
      if (isFullscreen || !isTouchDevice() || e.touches.length !== 1) return;
      showGestureHint();
    },
    { passive: true }
  );
  document.getElementById("map-fullscreen-btn")?.addEventListener("click", () => {
    setFullscreen(!isFullscreen);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isFullscreen) setFullscreen(false);
  });
  map.on("click", (e) => {
    setState({
      selectedCoords: { lat: e.latlng.lat, lng: e.latlng.lng },
      selectedState: null,
      selectedLga: null
    });
  });
  subscribe((storeState) => render(storeState));
  render(getState());
}
// ⑥ MARKER ICONS:
// The pointer under each pin is drawn in CSS (map.css), not here.
function buildIcon(project, isSelected) {
  const iconKey = getTypeMeta(project.types[0]).icon;
  return L.divIcon({
    className: `map__pin ${isSelected ? "map__pin--selected" : ""}`,
    html: `<span>${icon(iconKey)}</span>`,
    iconSize: [36, 44],
    iconAnchor: [18, 44], // bottom-centre = the pointer tip
    popupAnchor: [0, -42]
  });
}
// ⑦ RENDER FROM STORE:
function render(storeState) {
  if (!map) return;
  const results = getFilteredSortedProjects(storeState);
  markerLayer.clearLayers();
  const markers = {};
  results.forEach((project) => {
    const marker = L.marker([project.lat, project.lng], {
      icon: buildIcon(project, project.id === storeState.selectedProjectId)
    }).addTo(markerLayer);
    marker.bindPopup(`<strong>${project.name}</strong><br>${project.orgName}`);
    marker.on("click", () => setState({ selectedProjectId: project.id }));
    markers[project.id] = marker;
  });
  updateUserMarker(storeState);
  updateView(storeState, markers);
  updateCredit(storeState);
}
function updateUserMarker(storeState) {
  if (userMarker) {
    map.removeLayer(userMarker);
    userMarker = null;
  }
  if (storeState.selectedCoords) {
    userMarker = L.circleMarker(
      [storeState.selectedCoords.lat, storeState.selectedCoords.lng],
      { radius: 8, className: "map__user-marker" }
    ).addTo(map);
  }
}
function updateView(storeState, markers) {
  // Prioritise following the selected project's marker over the general
  // location context, since that's the more specific user intent.
  if (storeState.selectedProjectId && markers[storeState.selectedProjectId]) {
    const marker = markers[storeState.selectedProjectId];
    map.panTo(marker.getLatLng());
    marker.openPopup();
    return;
  }
  if (storeState.selectedCoords) {
    map.setView([storeState.selectedCoords.lat, storeState.selectedCoords.lng], 12);
  } else if (storeState.selectedState && STATE_CENTROIDS[storeState.selectedState]) {
    const c = STATE_CENTROIDS[storeState.selectedState];
    map.setView([c.lat, c.lng], 9);
  } else {
    map.setView(NIGERIA_CENTER, DEFAULT_ZOOM);
  }
}
function updateCredit(storeState) {
  const label = document.getElementById("map-credit-label");
  if (!label) return;
  label.textContent = storeState.selectedState
    ? `NearImpact Map ● ${storeState.selectedState}`
    : "NearImpact Map ● Nigeria";
}
/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ARCHITECTURE OVERVIEW:
  The Leaflet map, showing project markers that react to whatever
  filters/location are currently active. Same rendering split as
  everywhere else.
  This file imports the QUERY layer (projects-query.js) and the
  STORE (map-store.js), and deliberately never imports project-list.js
  (the list module) directly, that's the same architectural rule
  map-store.js documents.
  FULL SCREEN: done in CSS (.map__frame.is-fullscreen makes .map__stage
  position: fixed), not with the browser Fullscreen API. That's why it
  opens instantly and behaves the same on iPhones. Three details matter:
    1. .map__frame normally has z-index: 0 (keeps Leaflet's high
       z-indexes under the nav). In full screen map.css sets it to auto,
       otherwise the fixed stage would stay trapped under the nav bar.
    2. setFullscreen() pins the frame's height before the stage leaves
       the page, so the sections below don't jump.
    3. Leaflet only measures its box once, so map.invalidateSize() must
       run after every size change (it's the last line of setFullscreen).
  Full screen is UI-only state (like visibleCount in project-list.js),
  so it lives in this file, NOT in map-store.js.
  TWO-FINGER MOVE: on touch devices the inline map starts with one-finger
  dragging off, so the page scrolls normally; pinch/two-finger gestures
  still go to Leaflet's touchZoom handler, which also pans. A one-finger
  touchmove just shows the hint. Full screen turns dragging back on.
  applyInteractionMode() is the single place that decides this.
  Class names follow BEM where "map" is the block. One modifier pair
  shows up: .map__pin / .map__pin--selected, since a selected marker
  is a genuine style variant of the same pin, not a different thing.
  Leaflet's OWN built-in classes (leaflet-popup-content-wrapper,
  leaflet-control-zoom, etc.) are left completely alone in map.css;
  those are the library's internal styling hooks, not ours to rename.
  BLOCKS DEFINITIONS:
  ① MAP SETUP             — shared constants (default center/zoom,
                            hint duration), module-level state (map,
                            markerLayer, userMarker, isFullscreen) and
                            the isTouchDevice() check.
  ② RENDERING              — renderMapHeader() and renderMapBody()
                            return the section's markup; the actual
                            #leaflet-map div stays empty until
                            initMap() fills it in.
  ③ INTERACTION MODE       — applyInteractionMode() decides whether
                            one-finger drag / wheel zoom are on;
                            showGestureHint() flashes the two-finger
                            message.
  ④ FULL SCREEN            — setFullscreen() opens/closes the
                            full-screen view and keeps the button,
                            body scroll lock and Leaflet size in sync.
  ⑤ MAP INITIALIZATION     — stands up the Leaflet map, tile layer,
                            scroll-zoom toggle, touch hint, full-screen
                            button + Escape key, and the click handler
                            that writes to the store. Ends by
                            subscribing to the store and doing one
                            initial render.
  ⑥ MARKER ICONS           — buildIcon() builds the custom divIcon
                            used for every project marker, with the
                            icon matching the project's type.
  ⑦ RENDER FROM STORE      — render() is the one function that
                            actually redraws markers whenever the
                            store changes; the three helpers below it
                            each own one narrow piece of that redraw
                            (the "you are here" marker, which view/
                            zoom to show, and the credit badge text).
  CLASS NAME GLOSSARY:
  .map__header-section  The "Impact Around You" heading section.
  .map__header-wrap     Width-constrained wrapper inside it.
  .map__header          The flex row holding the heading + intro text.
  .map__frame           In-flow wrapper that keeps the map's place in
                        the page (its height is pinned in full screen).
  .map__stage           The part that becomes position: fixed in full
                        screen; holds the canvas, buttons and badge.
  .map__canvas          The Leaflet map's own container div. Also has
                        id="leaflet-map"here
  .map__fullscreen-btn  The open/close full screen button, top right.
  .map__gesture-hint    The "Use two fingers to move the map" overlay.
  .map__credit          The "NearImpact Map" badge overlaid on the
                        map's bottom-right corner.
  .map__credit-icon     The small globe icon inside that badge.
  .map__pin             A project marker's custom icon shape.
  .map__pin--selected   Modifier applied when that marker's project
                        is the one currently selected (bigger, filled).
  .map__user-marker     The dot marking the person's own location or
                        map click.
  State classes "is-fullscreen" (on .map__frame) and "is-visible" (on
  .map__gesture-hint) are deliberately not BEM-ified: they're flags this
  file flips, not permanent names.
  Classes you'll see in map.css that are NOT part of this glossary:
  .explore and .explore__wrap are built in main.js (they wrap this
  file's renderMapBody() output together with location-filter.js's
  renderLocationFilter() output into one shared card)
 
*/