// Just data + one distance formula in here. If the comments below 
// seems thin, the DEVELOPERS NOTE at the bottom has the full version.


// ① STATE CENTROIDS:
// Rough approximations, not for anything precision (not "your exact 
// distance") but good enough for sorting a same-state list.
export const STATE_CENTROIDS = {
  Ondo: { lat: 7.2500, lng: 5.2000 },
  Lagos: { lat: 6.5244, lng: 3.3792 },
  FCT: { lat: 9.0765, lng: 7.3986 },
  Kano: { lat: 12.0022, lng: 8.5920 },
  Rivers: { lat: 4.8156, lng: 7.0498 },
  Enugu: { lat: 6.4413, lng: 7.4986 }
};

// ② DISTANCE CALCULATION:
// Standard great-circle distance formula. Returns kilometers.
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  A small geography utility file; no rendering, no state, just
  coordinate data and one distance formula. It exists so that
  projects-query.js has ONE sorting algorithm ("nearest first")
  regardless of whether the person used real geolocation or just
  picked a state from a dropdown.

  Why centroids exist at all: if someone picks "Kogi" from the state
  dropdown instead of sharing their real location, we still want
  "nearest first" sorting to mean something. Without their actual
  coordinates, the state's centroid (its rough geographic center)
  becomes useful "you are approximately here" point; good
  enough to rank a same-state list sensibly, not good enough to
  claim as anyone's precise distance.


  BLOCKS DEFINITIONS:
  ① STATE CENTROIDS       — one rough lat/lng per Nigerian state
                            currently supported, used as a fallback
                            "you are here" point when there's no real
                            geolocation to work with.
  ② DISTANCE CALCULATION  — haversineKm() is the actual great-circle
                            distance formula (returns kilometers);
                            toRad() is a small private helper it
                            leans on to convert degrees to radians.

  
*/