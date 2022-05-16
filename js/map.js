// Globala variabler
var myMap; // Objekt för kartan

// Initiering av programmet
function init() {
  initMap();
  
} // End init
window.addEventListener("load", init);

function initMap() {
  myMap = new google.maps.Map(document.getElementById("map"), {
    center: { lat: window.lat, lng:14.831  },
    zoom: 14,
    styles: [
      { featureType: "poi", stylers: [{ visibility: "off" }] }, // No points of interest.
      { featureType: "transit.station", stylers: [{ visibility: "off" }] }, // No bus stations, etc.
    ],
  });
} 

