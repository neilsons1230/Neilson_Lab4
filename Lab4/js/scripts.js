mapboxgl.accessToken = 'pk.eyJ1IjoibmVpbHNvbnMiLCJhIjoiY2xvaXluZXBnMDVqajJqcDhjNHQ2ejZjayJ9.ti3AShuCVZeeFzkHHp4WhQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/neilsons/clongdeev003n01r78yc8252y',
  center: [-119.4179, 37.5853],
  zoom: 5,
});

const countyNamesElement = document.getElementById('county-names');

map.on('load', function () {
  fetch('data/California_Counties.geojson')
    .then(response => response.json())
    .then(data => {
      map.addSource('counties', {
        type: 'geojson',
        data: data,
      });

      map.addLayer({
        id: 'counties-fill',
        type: 'fill',
        source: 'counties',
        paint: {
          'fill-color': 'pink',
          'fill-opacity': 0.5,
        },
      });

      map.addLayer({
        id: 'counties-outline',
        type: 'line',
        source: 'counties',
        layout: {},
        paint: {
          'line-color': 'hotpink',
          'line-width': 2,
        },
      });
      

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        className: 'custom-popup-class',
      });

      function highlightFeature(e) {
        map.setFilter('counties-fill-hover', ['==', 'NAME', e.features[0].properties.NAME]);

        const featureProperties = e.features[0].properties;
        const popupContent = '<h2>California Counties</h2><b>' + featureProperties.NAME + '</b>';
        
        popup.setHTML(popupContent)
          .setLngLat(e.lngLat)
          .addTo(map);
      }

      function resetHighlight() {
        map.setFilter('counties-fill-hover', ['==', 'NAME', '']);
        popup.remove();
      }

      map.on('mousemove', 'counties-fill', highlightFeature);
      map.on('mouseleave', 'counties-fill', resetHighlight);
    });
});
