var myMap; // Objekt för kartan
var myMarkers = []; // Array med markeringar
var userMarker; // Objekt för markering där användaren klickar
const markerData = [
  // Data för markeringar som hör till knapparna
  {
    position: { lat: 59.18078661933195, lng: 17.621362156198703 },
    title: "Silverstigen",
  },
  {
    position: { lat: 59.19482108197934, lng: 17.630566327363972 },
    title: "Barrollo",
  },
  {
    position: { lat: 59.202388837338866, lng: 17.609108712023428 },
    title: "Max hamburgare",
  },
  {
    position: { lat: 59.18966236245761, lng: 17.63592068018244 },
    title: "Sydpolen",
  },
  {
    position: { lat: 59.18328105201948, lng: 17.630275971669175 },
    title: "McDonald`s",
  },
];
var mapLocationElem; // Element för utskrift av koordinater
var myApiKey = "DIN-API-KEY"; // Ersätt DIN-API-KEY med din egen Flickr API key


// Initiering av programmet

window.addEventListener("load", init);

// -----------------------------------------------------------------------------------------

// Skapa en karta och markeringar
function initMap() {
  myMap = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 59.19796353674416, lng: 17.620253028308003 },
    zoom: 14,
    styles: [
      { featureType: "poi", stylers: [{ visibility: "off" }] }, // No points of interest.
      { featureType: "transit.station", stylers: [{ visibility: "off" }] }, // No bus stations, etc.
    ],
  });

} // End initMap

window.initMap = initmap;