
var settings = {
    url: "http://127.0.0.1:8000/getHeatmapData",
    method: "POST",
    timeout: 0,
    xhrFields: {
        withCredentials: true,
    },
    headers: {
        "Content-Type": "application/json",
    },
    data: JSON.stringify({
        year: 123,
        mun_tokens: [1,7,7],
        factors: "TIHS",
    }),
};

console.log("POST >>> " + settings);
$.ajax(settings).done(function (response) {
    console.log(response)
});


// var margin = { top: 30, right: 30, bottom: 30, left: 30 },
//     width = 1000 - margin.left - margin.right,
//     height = 600 - margin.top - margin.bottom;


// var svg = d3.select(".calviz")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");


// // Labels of row and columns
// var myVars = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
// var myGroups = ["2017", "2018", "2019", "2020", "2021"]

// // Build X scales and axis:
// var x = d3.scaleBand()
//     .range([0, width])
//     .domain(myVars)
//     .padding(0.1)

// svg.append("g")
//     .attr("transform", "translate(0," + 0 + ")")
//     .style("font", "14px times")
//     .call(d3.axisTop(x).tickSizeInner(0))
//     .call(g => g.select(".domain").remove())




// // Build X scales and axis:
// var y = d3.scaleBand()
//     .range([height, 0])
//     .domain(myGroups)
//     .padding(0.25);
// svg.append("g")
//     .call(d3.axisLeft(y))
//     .call(d3.axisLeft(y).tickSizeInner(0))

//     .call(g => g.select(".domain").remove());




// ;
// function getMinMax() {
//     return d3.csv("../Data/xlsx/heatmap.csv").then(function (data) {
//         var minVal = d3.min(data, function (d) { return d.value; });
//         var maxVal = d3.max(data, function (d) { return d.value; });
//         return [minVal, maxVal]
//     })
// }

// var minMaxVals = await getMinMax()
// // Build color scale
// var myColor = d3.scaleLinear()
//     .range(["#d4e8fa", "#0384ff"])
//     .domain([0, minMaxVals[1]])


// d3.csv("../Data/xlsx/heatmap.csv").then(function (data) {

//     svg.selectAll()
//         .data(data, function (d) { return d.year + ':' + d.month; })
//         .join("rect")
//         .attr("rx", 10)
//         .attr("x", function (d) { return x(d.month) })
//         .attr("y", function (d) { return y(d.year) })
//         .attr("width", x.bandwidth())
//         .attr("height", y.bandwidth())
//         .style("fill", function (d) { return myColor(d.value) })
// })



// //Legend Stuff



// var svg_legend = d3.select(".calviz_legend")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + 0 + "," + margin.top + ")");

// const defs = svg_legend.append("defs")

// const linearGradient = defs.append("linearGradient")
//     .attr("id", "linear-gradient");

// linearGradient
//     .attr("x1", "0%")
//     .attr("y1", "0%")
//     .attr("x2", "100%")
//     .attr("y2", "0%");


// linearGradient.selectAll("stop")
//     .data([
//         { offset: "0%", color: "#d4e8fa" },
//         { offset: "25%", color: "#a8d6ff" },
//         { offset: "50%", color: "#73bdff" },
//         { offset: "75%", color: "#3fa3fc" },
//         { offset: "100%", color: "#0087ff" }
//     ])
//     .enter().append("stop")
//     .attr("offset", function (d) {
//         return d.offset;
//     })
//     .attr("stop-color", function (d) {
//         return d.color;
//     });

// // append title
// svg_legend.append("text")
//     .attr("class", "legendTitle")
//     .attr("x", 90)
//     .attr("y", 20)
//     .text("Accidents Caused Due To Snow/Ice");

// svg_legend.append("text")
//     .attr("class", "legnedLeft")
//     .attr("x", 10)
//     .attr("y", 75)
//     .style("text-anchor", "left")
//     .text("less");

// svg_legend.append("text")
//     .attr("class", "legnedLeft")
//     .attr("x", 385)
//     .attr("y", 75)
//     .text("more");
// // draw the rectangle and fill with gradient
// svg_legend.append("rect")
//     .attr("x", 10)
//     .attr("y", 40)
//     .attr("width", 400)
//     .attr("height", 15)
//     .style("fill", "url(#linear-gradient)");

// //create tick marks
// // var xLeg = d3.scaleLinear()
// //     .domain([0, 100])
// //     .range([10, 400]);

// // var axisLeg = d3.axisBottom(xLeg)
// //     .tickValues(myColor.domain())

// svg_legend
//     .attr("class", "axis")
//     .append("g")
//     .attr("transform", "translate(0, 40)")
//   //  .call(axisLeg);