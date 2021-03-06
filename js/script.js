// Skapar kartan och centrerar på Sjöbo
const map = L.map('map').setView([55.6113, 13.6890], 13);

// Kartlager
// OpenStreetMap bakgrundskarta
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);
// Busshållplatser som oranga pluttar
let busIcon = L.icon({
    iconUrl: 'css/images/dot32.png',
    iconSize: [32, 32],
});
// Editerbart lager från ArcGIS Online
const busBus = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/yWkBPqDRh3zjV90Q/arcgis/rest/services/BussHpl/FeatureServer/0',
    pointToLayer: function (geojson, latlng) {
        return L.marker(latlng, {
          icon: busIcon
        });
      }
}).addTo(map);


marker = L.marker([55.6113, 13.6890]).addTo(map);

// Start/Stop tracking av position
function toggle_tracker(){
  currentvalue = document.getElementById('onoff').value;
  if(currentvalue == "Track"){
    get_location();
    document.getElementById("onoff").value="No track";
  }else{
    document.getElementById("onoff").value="Track";
    navigator.geolocation.clearWatch(id);
  }
};

// Geolocation, zoomar till position och visar en ikon
function get_location() {
  if (Modernizr.geolocation) {
      id = navigator.geolocation.watchPosition(show_map, handle_error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000,
      });
  } else {
      // no native support
  }
};
function show_map(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  marker.setLatLng([latitude, longitude]).update();
  map.setView([latitude, longitude], 16);
};
function handle_error(error) {
    // Display error based on the error code.
    const { code } = error;
    switch (code) {
      case GeolocationPositionError.TIMEOUT:
        // Handle timeout.
        break;
      case GeolocationPositionError.PERMISSION_DENIED:
        // User denied the request.
        break;
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        // Position not available.
        break;
    }
};

// Loggar position
function log_position() {
  let feat = L.marker([latitude, longitude]).toGeoJSON();
  busBus.addFeature(feat, function (err, response) {
      if (err) {
          return;
      }

      console.log(response);
  });
};

// Lägg till objekt om man klickar på kartan
map.on('click', function (e) {
  let feat = L.marker(e.latlng).toGeoJSON();
  busBus.addFeature(feat, function (err, response) {
      if (err) {
          return;
      }

      console.log(response);
  });
});


// Ta bort kartobjekt om de klickas på
busBus.on('click', function (e) {
  busBus.deleteFeature(e.layer.feature.id, function (err, response) {
    if (err) {
      return;
    }

    console.log(response);
  });

// make sure map click event isn't fired.
L.DomEvent.stopPropagation(e);
});
