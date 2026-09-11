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

let map;
let markerLayer;
let userMarker;

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
    <div class="map__frame">
      <div id="leaflet-map" class="map__canvas"></div>
      <div class="map__credit" id="map-credit">
        <span class="map__credit-icon" aria-hidden="true">${icon("globe")}</span>
        <span id="map-credit-label">NearImpact Nigeria</span>
      </div>
    </div>
  `;
}

// ③ MAP INITIALIZATION:
// Must run AFTER renderMapBody()'s markup is in the live DOM (called from main.js).
export function initMap() {
  const container = document.getElementById("leaflet-map");
  if (!container) return;

  map = L.map(container, { scrollWheelZoom: false }).setView(NIGERIA_CENTER, DEFAULT_ZOOM);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);

  // Scroll-zoom is off by default so the map doesn't trap the page scroll
  container.addEventListener("click", () => map.scrollWheelZoom.enable());
  container.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());

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

// ④ MARKER ICONS:
function buildIcon(project, isSelected) {
  const iconKey = getTypeMeta(project.types[0]).icon;
  return L.divIcon({
    className: `map__pin ${isSelected ? "map__pin--selected" : ""}`,
    html: `<span>${icon(iconKey)}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
}

// ⑤ RENDER FROM STORE:
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


  Class names follow BEM where "map" is the block. One modifier pair
  shows up: .map__pin / .map__pin--selected, since a selected marker
  is a genuine style variant of the same pin, not a different thing.
  Leaflet's OWN built-in classes (leaflet-popup-content-wrapper,
  leaflet-control-zoom, etc.) are left completely alone in map.css;
  those are the library's internal styling hooks, not ours to rename.


  BLOCKS DEFINITIONS:
  ① MAP SETUP             — shared constants (default center/zoom)
                            and the module-level Leaflet instance
                            references (map, markerLayer, userMarker).
  ② RENDERING              — renderMapHeader() and renderMapBody()
                            return the section's markup; the actual
                            #leaflet-map div stays empty until
                            initMap() fills it in.
  ③ MAP INITIALIZATION     — stands up the Leaflet map, tile layer,
                            scroll-zoom toggle, and the click handler
                            that writes to the store. Ends by
                            subscribing to the store and doing one
                            initial render.
  ④ MARKER ICONS           — buildIcon() builds the custom divIcon
                            used for every project marker, colored/
                            shaped per the project's type.
  ⑤ RENDER FROM STORE      — render() is the one function that
                            actually redraws markers whenever the
                            store changes; the three helpers below it
                            each own one narrow piece of that redraw
                            (the "you are here" marker, which view/
                            zoom to show, and the credit badge text).

  CLASS NAME GLOSSARY:
  .map__header-section  The "Impact Around You" heading section.
  .map__header-wrap     Width-constrained wrapper inside it.
  .map__header          The flex row holding the heading + intro text.
  .map__frame           Positioning wrapper around the actual map
                        canvas — lets the credit badge sit absolutely
                        positioned on top of it.
  .map__canvas          The Leaflet map's own container div. Also has
                        id="leaflet-map"here 
  .map__credit          The "NearImpact Map" badge overlaid on the
                        map's bottom-right corner.
  .map__credit-icon     The small globe icon inside that badge.
  .map__pin             A project marker's custom icon shape.
  .map__pin--selected   Modifier applied when that marker's project
                        is the one currently selected (bigger, filled).
  .map__user-marker     The dot marking the person's own location or
                        map click.

  Classes you'll see in map.css that are NOT part of this glossary:
  .explore and .explore__wrap are built in main.js (they wrap this
  file's renderMapBody() output together with location-filter.js's
  renderLocationFilter() output into one shared card) 
  
*/