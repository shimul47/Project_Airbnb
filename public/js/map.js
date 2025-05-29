mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: coordinates,
  zoom: 9,
});

new mapboxgl.Marker()
  .setLngLat(coordinates)
  .addTo(map);