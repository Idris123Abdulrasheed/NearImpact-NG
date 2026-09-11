import "./styles/location-filter.css";
import { STATE_LGAS } from "./data/projects.js";
import { setState, subscribe, resetLocationFilter } from "./state/map-store.js";  
import { icon } from "./data/icons.js";
// This component only ever talks to the store and never to map.js or
// project-list.js directly the DEVELOPERS NOTE explains why.

// ① RENDERING:
export function renderLocationFilter() {
  const stateOptions = Object.keys(STATE_LGAS)
    .map((s) => `<option value="${s}">${s}</option>`)
    .join("");

  return `
    <section class="location-filter" id="find-impact">
      <div class="location-filter__wrap">

        <div class="location-filter__panel" id="location-filter">

          <div class="location-filter__row">

            <div class="location-filter__field">
              <label for="state-select"><span class="location-filter__field-icon" aria-hidden="true">${icon("mapOutline")}</span> State</label>
              <select id="state-select">
                <option value="">Select state</option>
                ${stateOptions}
              </select>
            </div>

            <span class="location-filter__divider" aria-hidden="true"></span>

            <div class="location-filter__field location-filter__field--lga">
              <label for="lga-select"><span class="location-filter__field-icon" aria-hidden="true">${icon("pin")}</span> LGA / Area</label>
              <select id="lga-select" disabled>
                <option value="">Pick state first</option>
              </select>
            </div>

          </div>

          <div class="location-filter__actions">
            <button type="button" id="use-location-btn" class="location-filter__locate-btn">
              <span aria-hidden="true">${icon("location")}</span> Use current location
            </button>

            <button type="button" id="clear-filter-btn" class="location-filter__clear-btn" hidden>
              <span aria-hidden="true">${icon("refresh")}</span> Clear
            </button>
          </div>

          <p class="location-filter__status" id="location-status" aria-live="polite">
            Showing popular projects across Nigeria
          </p>

        </div>

      </div>
    </section>
  `;
}

const LOCATE_LABEL = `<span aria-hidden="true">${icon("locate")}</span> Use current location`;

// ② EVENT WIRING:
export function initLocationFilter() {
  const stateSelect = document.getElementById("state-select");
  const lgaSelect = document.getElementById("lga-select");
  const useLocationBtn = document.getElementById("use-location-btn");
  const clearBtn = document.getElementById("clear-filter-btn");
  const status = document.getElementById("location-status");

  if (!stateSelect) return; // component not mounted on this page, bail safely

  // state select
  stateSelect.addEventListener("change", () => {
    const state = stateSelect.value || null;

    if (!state) {
      resetLocationFilter();
      return;
    }

    // Populate LGA options for the chosen state
    const lgas = STATE_LGAS[state] || [];
    lgaSelect.innerHTML =
      `<option value="">All of ${state}</option>` +
      lgas.map((l) => `<option value="${l}">${l}</option>`).join("");
    lgaSelect.disabled = false;

    // Selecting a state clears any previously selected LGA/coords —
    // avoids a stale LGA from a different state lingering in the store.
    setState({ selectedState: state, selectedLga: null, selectedCoords: null });
  });

  // lga select
  lgaSelect.addEventListener("change", () => {
    setState({ selectedLga: lgaSelect.value || null });
  });

  // geolocation button
  useLocationBtn.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      status.textContent = "Location isn't supported on this browser. Try selecting a state instead.";
      return;
    }

    useLocationBtn.disabled = true;
    useLocationBtn.innerHTML = "Locating…";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          selectedCoords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          selectedState: null,
          selectedLga: null
        });
        useLocationBtn.disabled = false;
        useLocationBtn.innerHTML = LOCATE_LABEL;
      },
      () => {
        // Denied or failed; fail visibly, never silently
        status.textContent = "Couldn't access your location. You can select a state instead.";
        useLocationBtn.disabled = false;
        useLocationBtn.innerHTML = LOCATE_LABEL;
      },
      { timeout: 8000 }
    );
  });

  // clear button
  clearBtn.addEventListener("click", () => {
    stateSelect.value = "";
    lgaSelect.innerHTML = `<option value="">Select state first</option>`;
    lgaSelect.disabled = true;
    resetLocationFilter();
  });

  // store subscription ????????
  subscribe((state) => {
    const hasFilter = state.selectedState || state.selectedCoords;
    clearBtn.hidden = !hasFilter;

    // a map click clears selectedState, without this the <select> would still show the old value.
    if (!state.selectedState && stateSelect.value !== "") {
      stateSelect.value = "";
      lgaSelect.innerHTML = `<option value="">Select state first</option>`;
      lgaSelect.disabled = true;
    }

    if (state.selectedCoords) {
      status.textContent = "Showing projects near your current location";
    } else if (state.selectedState && state.selectedLga) {
      status.textContent = `Showing projects in ${state.selectedLga}, ${state.selectedState}`;
    } else if (state.selectedState) {
      status.textContent = `Showing projects across ${state.selectedState}`;
    } else {
      status.textContent = "Showing popular projects across Nigeria";
    }
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The state/LGA dropdowns + "Use current location" control. This
  component NEVER imports map.js or project-list.js it only uses the
  store (map-store.js). It only ever writes to the store; map.js and
  project-list.js are the ones that read from it and react.


  Class names follow BEM where "location-filter" is the block. 
  One modifier shows up: .location-filter__field--lga,
  since the LGA field is styled identically to the State field except
  for a wider flex-basis 

  Note:   button's initial render calls icon("location"), but icons.js 
  only defines a "locate" icon key which makes it silently falls back to 
  the default pin icon (ICONS.pin for any unrecognized key) on the first render. 

  BLOCKS DEFINITIONS:
  ① RENDERING     — builds the whole component's markup: state
                    select, LGA select (disabled until a state's
                    picked), the locate/clear buttons, and the status
                    line.
  ② EVENT WIRING  — everything that makes the component interactive:
                    picking a state populates and enables the LGA
                    dropdown and clears any stale LGA/coords; picking
                    an LGA just writes it to the store; the locate
                    button calls the browser's geolocation API and
                    writes real coordinates on success (or fails
                    visibly, never silently, on denial/timeout); the
                    clear button resets everything back to the
                    "popular nationwide" default. The store
                    subscription at the end is the single place that
                    reacts to ANY state change, including ones
                    triggered by other components (e.g. a map click)
                    keeping the dropdowns and status text honest even
                    when this component wasn't what caused the change.


  CLASS NAME GLOSSARY:
  .location-filter               The whole section, top to bottom.
  .location-filter__wrap         Width-constrained wrapper.
  .location-filter__panel        The actual card containing the
                                  controls (has its own id, "location-
                                  filter")
  .location-filter__row          Flex row holding the State + LGA
                                  fields side by side.
  .location-filter__divider      The thin vertical line between the
                                  two fields.
  .location-filter__field        One labeled dropdown field (State,
                                  or LGA/Area).
  .location-filter__field--lga   Modifier on the LGA field specifically
                                  gives it a larger share of the row
                                  since its placeholder text is longer.
  .location-filter__field-icon   The small icon shown next to a field's
                                  label.
  .location-filter__actions      Row holding the locate + clear buttons.
  .location-filter__locate-btn   The "Use current location" button.
  .location-filter__clear-btn    The "Clear" button always hidden until a
                                  filter is actually active.
  .location-filter__status       The line of text describing what's
                                  currently being shown (e.g. "Showing
                                  projects across Lagos").


*/