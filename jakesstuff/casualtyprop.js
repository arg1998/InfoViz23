const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;


const svg = d3.select(".casvspropviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


const plot_g = svg.append('g').classed('plot', true)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

svg.append("circle").attr("cx", 550).attr("cy", 30).attr("r", 6).style("fill", "green")
svg.append("circle").attr("cx", 550).attr("cy", 60).attr("r", 6).style("fill", "red")
svg.append("circle").attr("cx", 550).attr("cy", 90).attr("r", 6).style("fill", "blue")

svg.append("text").attr("x", 580).attr("y", 30).text("North").style("font-size", "15px").attr("alignment-baseline", "middle")
svg.append("text").attr("x", 580).attr("y", 60).text("South").style("font-size", "15px").attr("alignment-baseline", "middle")
svg.append("text").attr("x", 580).attr("y", 90).text("Middle").style("font-size", "15px").attr("alignment-baseline", "middle")


function handleTypeChange(type){

    file_location = ""
    if (type.value == 'property'){
        file_location = "../Data/xlsx/property.csv"
    }
    else{
        file_location = "../Data/xlsx/casualty.csv"
    }

    drawChart(file_location)
}


function drawChart(file_location){


   // d3.selectAll("svg > *").remove();


    // append the svg object to the body of the page
    d3.csv(file_location).then(function (data) {
        var sumstat = d3.group(data, d => d.location);
        // console.log(data[0])
        //console.log(data[0].crash_count)

        const x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return d.year; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("")));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 20000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        const color = d3.scaleOrdinal()
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])
        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return color(d[0]) })
            .attr("stroke-width", 2.5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(d.year); })
                    .y(function (d) { return y(parseInt(d.crash_count)); })
                    (d[1])
            })
    })
}
