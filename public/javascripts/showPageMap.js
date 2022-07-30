mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});

new mapboxgl.Marker()
    .setLngLat(campgrounds.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                '<h3>' + campgrounds.title + '</h3>' + '<p>' + campgrounds.location + '</p>'
            )
    )
    .addTo(map)
