mapboxgl.accessToken = 'pk.eyJ1IjoibmVvc2NvbnN1bHRpbmciLCJhIjoiY2szcHpqdnBkMDU0bjNtcDZkaWU5ZXpnZiJ9.xtFDeoIlaNf2OJnwU_asng';

var urlParams = new URLSearchParams(window.location.search);
var coordinate = urlParams.get('coordinate');
var zoommappa = urlParams.get('zoom');

var latLng = coordinate.split(",");
var lat = parseFloat(latLng[0]);
var lng = parseFloat(latLng[1]);
var description = "";

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lat, lng],
    zoom: zoommappa,
});

map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

colors = ['#ffffff', '#E73D18'];

map.on('load', function () {
    map.loadImage("/img/mapbox-icon.png", function (error, image) {
        if (error) throw error;
        map.addImage("mapbox-icon", image);
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
            'layout': {
                'icon-image': 'mapbox-icon',
                "icon-size": 1,
                "icon-allow-overlap": true
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
        // Force the popup closed.
        //e.layer.closePopup();
        var content = "";
        var features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] });
        var ct = 0;
       // console.log(features);
        var arraylog = JSON.stringify(features);
        // console.log(arraylog);
        //alert(features);
        for (i = 0; i < features.length; i++) {
            ct++;
            // console.log(features[i].values);
        }
        if (ct > 1)
        {
        content += '<div><strong> Sono presenti ' + ct + ' progetti: </strong> </div>';
        }
        else
        {
            content += "<div><strong> E' presente 1 progetto: </strong> </div>";
        }
        for (i = 0; i < features.length; i++) {
            description = features[i].properties.description;
            // var description = features[i].properties.description;

            content += '<div>' + description + '</div>';
        }
        // alert(content);
        info.innerHTML = content;
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('clienti').getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err)
                return;

            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
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


    empty();

    function empty() {
        // alert("ASD");
        info.innerHTML = '<div><strong></strong></div>';
    }

    document.getElementById('fly').addEventListener('click', function () {
        empty();
        // Fly to a random location by offsetting the point -74.50, 40
        // by up to 5 degrees.
        map.flyTo({
            center: [34.496366, 27.902782],
            zoom: 1.6
        });
    });

});