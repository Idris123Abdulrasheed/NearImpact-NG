// Just data + one distance formula in here. If the comments below 
// seems thin, the DEVELOPERS NOTE at the bottom has the full version.


// ① STATE CENTROIDS:
// Rough approximations, not for anything precision (not "your exact 
// distance") but good enough for sorting a same-state list.
export const STATE_CENTROIDS = {
  Abia: { lat: 5.45, lng: 7.52 }, 
  Adamawa: { lat: 9.33, lng: 12.4 },
  "Akwa Ibom": { lat: 5.01, lng: 7.85 }, 
  Anambra: { lat: 6.21, lng: 7.07 },
  Bauchi: { lat: 10.31, lng: 9.84 }, 
  Bayelsa: { lat: 4.77, lng: 6.07 },
  Benue: { lat: 7.34, lng: 8.74 }, 
  Borno: { lat: 11.83, lng: 13.15 },
  "Cross River": { lat: 5.87, lng: 8.6 }, 
  Delta: { lat: 5.7, lng: 5.9 },
  Ebonyi: { lat: 6.26, lng: 8.01 }, 
  Edo: { lat: 6.34, lng: 5.63 },
  Ekiti: { lat: 7.72, lng: 5.31 }, 
  Enugu: { lat: 6.4413, lng: 7.4986 },
  FCT: { lat: 9.0765, lng: 7.3986 }, 
  Gombe: { lat: 10.29, lng: 11.17 },
  Imo: { lat: 5.49, lng: 7.03 }, 
  Jigawa: { lat: 12.23, lng: 9.56 },
  Kaduna: { lat: 10.52, lng: 7.44 }, 
  Kano: { lat: 12.0022, lng: 8.592 },
  Katsina: { lat: 12.99, lng: 7.6 }, 
  Kebbi: { lat: 12.45, lng: 4.2 },
  Kogi: { lat: 7.8, lng: 6.74 }, 
  Kwara: { lat: 8.5, lng: 4.55 },
  Lagos: { lat: 6.5244, lng: 3.3792 }, 
  Nasarawa: { lat: 8.54, lng: 8.52 },
  Niger: { lat: 9.6, lng: 6.55 }, 
  Ogun: { lat: 7.16, lng: 3.35 },
  Ondo: { lat: 7.25, lng: 5.2 }, 
  Osun: { lat: 7.77, lng: 4.56 },
  Oyo: { lat: 7.85, lng: 3.93 }, 
  Plateau: { lat: 9.22, lng: 9.52 },
  Rivers: { lat: 4.8156, lng: 7.0498 }, 
  Sokoto: { lat: 13.06, lng: 5.24 },
  Taraba: { lat: 8.89, lng: 11.37 }, 
  Yobe: { lat: 12.29, lng: 11.44 },
  Zamfara: { lat: 12.17, lng: 6.66 },
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