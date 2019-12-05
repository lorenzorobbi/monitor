// JavaScript source code
mapboxgl.accessToken = 'pk.eyJ1IjoibmVvc2NvbnN1bHRpbmciLCJhIjoiY2szcHpqdnBkMDU0bjNtcDZkaWU5ZXpnZiJ9.xtFDeoIlaNf2OJnwU_asng';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [34.496366, 27.902782],
    zoom: 1.6,
    interactive: false
});

map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

colors = ['#ffffff', '#E73D18'];


map.on('load', function () {

    map.loadImage('img/mapbox-icon.png', function (error, image) {
        if (error) throw error;
        map.addImage('mapbox-icon', image);
        // Add a new source from our GeoJSON data and set the
        // 'cluster' option to true. GL-JS will add the point_count property to your source data.
        map.addSource("clienti", {
            type: "geojson",
            "data": "http://localhost:8080/js/mappa.json",
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
            id: "clusters",
            type: "circle",
            source: "clienti",
            filter: ["has", "point_count"],
            paint: {
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    colors[0],
                    100,
                    colors[0],
                    750,
                    colors[0]
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    20,
                    100,
                    30,
                    750,
                    40
                ],
                'circle-stroke-color': colors[1],
                'circle-stroke-width': 5

            }
        });

        map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "clienti",
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 14,
            },
            'paint': {
                'text-color': colors[1]
            }
        });

        map.addLayer({
            id: "unclustered-point",
            type: "symbol",
            source: "clienti",
            filter: ["!", ["has", "point_count"]],

            "layout": {
                "icon-image": "mapbox-icon",
                "icon-size": 1
            }
            /*
            'paint': {
                'circle-color': colors[0],
                'circle-stroke-color': colors[1],
                'circle-stroke-width': 3,
                'circle-radius': 13
            }
            */
        });

    });
    map.on('click', 'unclustered-point', function (e) {
       RestaMappa();
        var features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('clienti').getClusterExpansionZoom(clusterId, function (err, zoom) {
            var coordinate = features[0].geometry.coordinates;
            // alert(coordinate);

            window.open("mappa?coordinate=" + coordinate + "&zoom=9");
            
        });
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
        RestaMappa();
        var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('clienti').getClusterExpansionZoom(clusterId, function (err, zoom) {
            var coordinate = features[0].geometry.coordinates;
            window.open("mappa?coordinate=" + coordinate + "&zoom=" + zoom);
        }); 
    });

    // Cursor Pointer Su Cluster
    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });


    // Cursor Pointer su unclustered-point
    map.on('mouseenter', 'unclustered-point', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', function () {
        map.getCanvas().style.cursor = '';
    });



});
