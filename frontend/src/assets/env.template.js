(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["apiUrl"] = "${API_URL}/api";
  window["env"]["mapboxToken"] = "${MAPBOX_TOKEN}";
})(this);