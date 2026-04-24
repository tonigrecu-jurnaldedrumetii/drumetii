// JDD Waymarked Trails Widget v1.0
(function() {
  function parseGpx(xml) {
    var pts = xml.getElementsByTagName('trkpt');
    if (!pts.length) pts = xml.getElementsByTagName('rtept');
    var latlngs = [];
    for (var i = 0; i < pts.length; i++) {
      latlngs.push([
        parseFloat(pts[i].getAttribute('lat')),
        parseFloat(pts[i].getAttribute('lon'))
      ]);
    }
    return latlngs;
  }

  function initWidget(el) {
    var name     = el.dataset.name || 'Traseu';
    var distance = el.dataset.distance || '—';
    var deniv    = el.dataset.denivelare || '—';
    var durata   = el.dataset.durata || '—';
    var gpxUrl   = el.dataset.gpx || '';
    var lat      = parseFloat(el.dataset.lat) || 45.9;
    var lng      = parseFloat(el.dataset.lng) || 25.0;
    var zoom     = parseInt(el.dataset.zoom) || 11;

    var mapId = 'jdd-map-' + Math.random().toString(36).slice(2);
    el.innerHTML = [
      '<div class="jdd-map-header">',
      '  <span class="trail-icon"></span>',
      '  <span>' + name + '</span>',
      '</div>',
      '<div id="' + mapId + '" class="jdd-map-canvas"></div>',
      '<div class="jdd-map-info">',
      '  <div class="jdd-map-stat"><span class="label">Distanta</span><span class="value orange">' + distance + '</span></div>',
      '  <div class="jdd-map-stat"><span class="label">Denivelare</span><span class="value">' + deniv + '</span></div>',
      '  <div class="jdd-map-stat"><span class="label">Durata</span><span class="value">' + durata + '</span></div>',
      '  <div class="jdd-map-stat"><span class="label">Marcaje OSM</span><span class="value">Waymarked Trails</span></div>',
      '</div>'
    ].join('');

    var map = L.map(mapId, { zoomControl: true, scrollWheelZoom: false })
               .setView([lat, lng], zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.tileLayer('https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {
      maxZoom: 18,
      opacity: 0.85,
      attribution: 'Trasee: <a href="https://hiking.waymarkedtrails.org">Waymarked Trails</a>'
    }).addTo(map);

    if (gpxUrl) {
      fetch(gpxUrl)
        .then(function(r) { return r.text(); })
        .then(function(txt) {
          var xml = (new DOMParser()).parseFromString(txt, 'text/xml');
          var latlngs = parseGpx(xml);
          if (latlngs.length > 0) {
            var poly = L.polyline(latlngs, {
              color: '#c8551e',
              weight: 3.5,
              opacity: 0.9
            }).addTo(map);
            map.fitBounds(poly.getBounds(), { padding: [30, 30] });
          }
        })
        .catch(function() {});
    }
  }

  function init() {
    var widgets = document.querySelectorAll('.jdd-wmt-map');
    widgets.forEach(initWidget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
