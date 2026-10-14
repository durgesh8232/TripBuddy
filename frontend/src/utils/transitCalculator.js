// Calculate approximate distance between two GPS coordinates in km (Haversine formula)
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(1, Math.round(R * c * 10) / 10); // Return minimum 1 km rounded to 1 decimal
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Typical baseline Indian domestic rates
export function estimateFareInr(distanceKm) {
  const km = Math.max(1, Number(distanceKm) || 2);
  
  // Local Auto-rickshaw: ₹25-30 base (first 1.5-2km), ₹14-16/km thereafter
  const autoFareMin = Math.round(25 + Math.max(0, km - 1.5) * 14);
  const autoFareMax = Math.round(35 + Math.max(0, km - 1.5) * 17);

  // App Cab (UberGo / Ola Mini): ₹60-80 base, ₹18-22/km + booking fees
  const cabFareMin = Math.round(65 + km * 18);
  const cabFareMax = Math.round(90 + km * 23);

  return {
    distanceKm: km,
    auto: `₹${autoFareMin} - ₹${autoFareMax}`,
    cab: `₹${cabFareMin} - ₹${cabFareMax}`,
  };
}