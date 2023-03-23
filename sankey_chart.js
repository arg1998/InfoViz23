const MAX_SHAPE_SELECTION = 5;
//selected shapes on the map
var shapes_selected = new Set();
// we send these tokenized municipality names to the server
var municipalities_selected = new Set();
var num_shape_selected = 0;
var selected_year = "2017";

const default_feature_style = {
  fillColor: "#ff7800",
  color: "#ff7800",
  weight: 1,
  fillOpacity: 0.3,
};

var colors = ["#D81B1B", "#1ECEE5", "#FFC107", "#00334D", "#EC00FF"];

function shapeClicked(shape_prop, shape_color) {
  if (shapes_selected.has(shape_prop)) {
    // remove shape from selected shapes
    shapes_selected.delete(shape_prop);
    colors.push(shape_color);
    num_shape_selected--;
    return default_feature_style;
  } else if (num_shape_selected < MAX_SHAPE_SELECTION) {
    // add shape to selected shapes
    shapes_selected.add(shape_prop);
    num_shape_selected++;
    var _color = colors.pop();
    return {
      fillColor: _color,
      color: _color,
      weight: 2,
      fillOpacity: 0.9,
    };
  } else {
    alertMaximumShapeSelected();
  }
  return null;
}

function handleYearChange(year) {
  selected_year = year.value;
}

function alertMaximumShapeSelected() {
  alert("You can only select up to " + MAX_SHAPE_SELECTION + " municipalities");
}
