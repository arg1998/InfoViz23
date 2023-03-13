var map = L.map("mapbox").setView([54.517461284757104, -125.090299112331], 5);
L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}",
  {
    // attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    maxZoom: 11,
    minZoom: 5,
    ext: "png",
  }
).addTo(map);

map.setMaxBounds(map.getBounds());

// fetch data from json file using ajax
var municipalities = [];
$.ajax({
  url: "./Data/GeoJson/municpalities_espg4326_filtered.json",
  dataType: "json",
  success: function (data) {
    municipalities = data;
    console.log("fetched geojson data");
  },
  async: false,
});

function whenClicked(e) {
  var style = shapeClicked(e.target.feature.properties, e.target.options.color);
  if(style != null) {
    e.target.setStyle(style);
  }
}

function mouseOver(e) {
  this.unbindTooltip();
  if (!this.isPopupOpen())
    this.bindTooltip(
      "<div style='background:white; padding:1px 3px 1px 3px'><b>" +
        e.target.feature.properties.mun_name +
        "</b></div>",
      {
        direction: "left",
        permanent: false,
        sticky: true,
        offset: [10, 0],
        opacity: 0.75,
        className: "leaflet-tooltip-own",
      }
    ).openTooltip();
}

function onEachFeature(feature, layer) {
  layer.on({
    click: whenClicked,
    mouseover: mouseOver,
  });
}
var geojsonLayer = new L.GeoJSON(municipalities, {
  style: default_feature_style,
  onEachFeature: onEachFeature,
});
geojsonLayer.addTo(map);
