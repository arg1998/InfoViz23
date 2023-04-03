google.charts.load("current", { packages: ["sankey"] });
var sankey_loaded = false;
var sankey_chart = null;
google.charts.setOnLoadCallback(function () {
  sankey_loaded = true;
  sankey_chart = new google.visualization.Sankey(
    document.getElementById("sankey")
  );
  console.log("Sankey chart loaded");
});

const MAX_SHAPE_SELECTION = 5;
//selected shapes on the map
var shapes_selected = new Set();
// we send these tokenized municipality names to the server
var selected_municipalities = new Set();
var num_shape_selected = 0;
var selected_year = "2017";
var selected_factors = new Set();

const default_feature_style = {
  fillColor: "#ff7800",
  color: "#ff7800",
  weight: 1,
  fillOpacity: 0.3,
};

var mun_colors = ["#D81B1B", "#1ECEE5", "#FFC107", "#00334D", "#EC00FF"];
var factor_colors = [
  "#a6cee3",
  "#b2df8a",
  "#fb9a99",
  "#fdbf6f",
  "#cab2d6",
  "#ffff99",
  "#1f78b4",
  "#33a02c",
];

function shapeClicked(shape_prop, shape_color) {
  if (shapes_selected.has(shape_prop)) {
    // remove shape from selected shapes
    shape_prop["mun_color"] = undefined;
    shapes_selected.delete(shape_prop);
    updatePlot();
    mun_colors.push(shape_color);
    num_shape_selected--;
    return default_feature_style;
  } else if (num_shape_selected < MAX_SHAPE_SELECTION) {
    // add shape to selected shapes
    num_shape_selected++;
    var _color = mun_colors.pop();
    shape_prop["mun_color"] = _color;
    shapes_selected.add(shape_prop);
    updatePlot();
    return {
      fillColor: _color,
      color: _color,
      weight: 2,
      fillOpacity: 0.95,
    };
  } else {
    alertMaximumShapeSelected();
  }
  return null;
}

function handleYearChange(year) {
  selected_year = year.value;
  updatePlot();
}

function alertMaximumShapeSelected() {
  alert("You can only select up to " + MAX_SHAPE_SELECTION + " municipalities");
}

function updatePlot() {
  // convert selected shape properties to mun_tokens
  selected_municipalities.clear();
  shapes_selected.forEach((shape) => {
    selected_municipalities.add(shape.mun_token);
  });

  // console.log(
  //   "Year: " +
  //     selected_year +
  //     ", mun_tokens: " +
  //     Array.from(selected_municipalities) +
  //     ", factors: " +
  //     Array.from(selected_factors)
  // );

  if (selected_municipalities.size == 0 || selected_factors.size == 0) {
    clearPlot();
    console.log("clearing plot");
    return;
  }

  var settings = {
    url: "http://127.0.0.1:8000/getAccidents",
    method: "POST",
    timeout: 0,
    xhrFields: {
      withCredentials: false,
    },
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      year: selected_year,
      mun_tokens: Array.from(selected_municipalities),
      factors: Array.from(selected_factors),
    }),
  };

  console.log("POST >>> " + settings);
  $.ajax(settings).done(function (response) {
    if (response["status"] == 200) {
      // console.log("RESPONSE <<< " + JSON.stringify(response, undefined, 2));
      updateSankeyChart(response["res"]);
    }
  });
}

function calculateNodeColors() {
  // this method calculates the colors of the nodes in the sankey chart
  var _node_colors = [];
  var num_factors = Array.from(selected_factors).length;
  var _shapes_selected = Array.from(shapes_selected);
  var num_municipalities = _shapes_selected.length;

  //adding the first municipality node
  var _mun_color = _shapes_selected[0].mun_color;
  _node_colors.push(_mun_color);

  //adding all the factor nodes
  for (var j = 0; j < num_factors; j++) {
    var _factor_color = factor_colors[j];
    _node_colors.push(_factor_color);
  }

  //adding the rest of the municipality nodes
  for (var i = 1; i < num_municipalities; i++) {
    _mun_color = _shapes_selected[i].mun_color;
    _node_colors.push(_mun_color);
  }
  return _node_colors;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function splitAndCapitalize(string) {
  var _string = string.split("_");
  var output = [];
  _string.forEach((word) => {
    output.push(capitalizeFirstLetter(word));
  });
  return output.join(" ");
}

function transformDataForSnakey(data) {
  // output structure [municipality, contributing factor, number of accidents, html tooltip]
  var output = [];
  var df = data["data"];

  for (var mun in df) {
    for (var factor in df[mun]["factors"]) {
      singleRow = [];
      singleRow.push(splitAndCapitalize(mun) + " (" + df[mun]["total_accidents"] +")"); // municipality name
      singleRow.push(splitAndCapitalize(factor)+ " (" + data["all_factors"][factor] +")"); // factor name
      singleRow.push(df[mun]["factors"][factor]); // number of accidents
      var mun_percent =
        (df[mun]["factors"][factor] / df[mun]["total_accidents"]) * 100;

      var factor_percent = (df[mun]["factors"][factor] / data["all_factors"][factor]) * 100;
      var tooltip = `<div class="snakeyToolTip">
      
      <div>
      <h4> Municipality </h4> <hr>
       <b> `+ mun_percent.toFixed(2)+ `% </b> of all accidents (` + df[mun]["total_accidents"] + `) in <b>` + splitAndCapitalize(mun) + `</b> are caused by <b>` + splitAndCapitalize(factor) + `</b>
      </div>
      <div class="verticalSeparator"></div>
      <div>
      <h4> Contributing Factor </h4> <hr>
      <b>`+ factor_percent.toFixed(2)+ `%</b> of all accidents  (` + data["all_factors"][factor] + `) caused by <b>` + splitAndCapitalize(factor) + `</b> are reported in <b>` + splitAndCapitalize(mun) + `</b>
      </div>
    </div>`;
      singleRow.push(tooltip); // tooltip
      output.push(singleRow);
    }
  }
  return output;
}

function updateSankeyChart(data) {
  if (!sankey_loaded) {
    return;
  }

  clearPlot();

  var rows = transformDataForSnakey(data);
  // console.log(JSON.stringify(rows, undefined, 2));

  var df = new google.visualization.DataTable();
  df.addColumn("string", "Municipality");
  df.addColumn("string", "Contributing Factor");
  df.addColumn("number", "Number of Accidents");
  df.addColumn({ type: "string", role: "tooltip", p: { html: true } });
  df.addRows(rows);

  var options = {
    height: 600,
    tooltip: { isHtml: true },
    sankey: {
      node: {
        interactivity: true,
        colors: calculateNodeColors(),
        nodePadding: 15,
        width: 20,
        label: {
          fontSize: 16,
          italic: true,
          fontName: "Roboto",
        },
      },
      link: {
        colorMode: "gradient",
      },
    },
  };

  sankey_chart.draw(df, options);
  var total_accidents = 0;
  for (var mun in data["data"]) {
   total_accidents += data["data"][mun]["total_accidents"]
  }
  document.getElementById("sankeyBottomStat").innerHTML = '<p class="prompts">Total number of accidents: ' + total_accidents + "</p>";
}

function clearPlot() {
  if (!sankey_loaded) {
    return;
  }
  sankey_chart.clearChart();
  document.getElementById("sankeyBottomStat").innerHTML = "";
}


function handleCheckboxClick(checkbox) {
 
  if (selected_factors.has(checkbox.value)) {
    selected_factors.delete(checkbox.value);
  } else {
    selected_factors.add(checkbox.value);
  }
  updatePlot();
}