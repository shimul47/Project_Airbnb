mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: [77.209,28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 6
});
console.log(coordinates);
const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map)