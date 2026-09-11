// If you're wondering why map.js and project-list.js never import
// each other directly, the DEVELOPERS NOTE at the bottom is the
// answer; read that before you go looking for a missing import.

// ① STATE SHAPE:
const state = {
  selectedState: null,      // string | null
  selectedLga: null,        // string | null
  selectedCoords: null,     // { lat, lng } | null  (from geolocation or map click)
  selectedProjectId: null,  // string | null
  sortBy: "nearest",        // "nearest" | "popular" | "rating" | "type"
  filterType: "all"         // "all" | "volunteer" | "internship" | "training" | "fellowship"
};

// ② SUBSCRIPTIONS:
const listeners = new Set();

function notify() {
  for (const fn of listeners) fn(state);
}

// ③ PUBLIC API:
export function getState() {
  return { ...state };
}

// Partial update — only pass the keys you're changing
export function setState(partial) {
  Object.assign(state, partial);
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn); // unsubscribe function, prevents memory leaks
}

// ④ LOCATION RESET:
export function resetLocationFilter() {
  setState({ selectedState: null, selectedLga: null, selectedCoords: null });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  This is the one shared source of truth that lets the map, the
  project list, and the location filter all react to the same
  underlying selection state without ever importing each other.
  Map and list are two independent RENDERERS of the same data. 
  
  Map writes selectedProjectId when a marker is clicked, list subscribes
  and highlights that project on its own; the location filter writes
  selectedState/selectedLga/selectedCoords, and both map and list read
  those independently. Neither map.js nor project-list.js has any idea the 
  other exists, they only ever import THIS file. Do you know what that avoids?


  BLOCKS DEFINITIONS:
  ① STATE SHAPE       — the actual state object and what each field
                        means/where it comes from.
  ② SUBSCRIPTIONS      — the listener set and the notify() function
                        that fires every subscriber whenever state
                        changes.
  ③ PUBLIC API         — getState() (returns a copy, not a live
                        reference, callers can't mutate state by accident), 
                        setState()  (the only way state
                        actually changes), and 
                        subscribe() (returns its own unsubscribe function, 
                        so nothing leaks listeners if a component is ever down).
  ④ LOCATION RESET      — a small convenience wrapper for clearing all
                        three location-related fields at once — used
                        by location-filter.js's "Clear" button.


*/