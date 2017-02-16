var dataset = [];
var w = 500;
var h = 500;
var padding = 50;
var idNum = 0;

d3.csv("Data/2003.csv", function(data) {
    dataset = data.map(function(d) {
        return [d["PdDistrict"], +d["PROSTITUTION"], +d["VEHICLE THEFT"]];
    });

    //Create SVG element for scatter 1
    var svg = d3.select('#scatter1')
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //Create scale functions
    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {
            return d[1];
        })])
        .range([padding, w - padding * 2]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {
            return d[2];
        })])
        .range([h - padding, padding]);

    var rScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {
            return d[1] + d[2];
        })])
        .range([1, 10]);

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d[1]);
        })
        .attr("cy", function(d) {
            return yScale(d[2]);
        })
        .attr("r", function(d) {
            return rScale(d[1] + d[2]);
        });

    //Create labels
    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d[0];
        })
        .attr("x", function(d) {
            return xScale(d[1]);
        })
        .attr("y", function(d) {
            return yScale(d[2]) - 8;
        })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "red");

    //Create X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "end")
        .attr("x", w / 2)
        .attr("y", h - 6)
        .text("Prostitution count");

    svg.append("text")
        .attr("class", "ylabel")
        .attr("text-anchor", "end")
        .attr("x", 0 - ((h - padding) / 2.1))
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Vehicle Theft count");

    //On click, update with new data
    d3.select("#scatter1").on("click", function() {

        if (idNum == 0) {
            dataId = "2015";
            idNum += 1;
        } else {

            dataId = "2003";
            idNum -= 1;
        }

        d3.csv("Data/" + dataId + ".csv", function(data) {
            //New values for dataset
            dataset = data.map(function(d) {
                return [d["PdDistrict"], +d["PROSTITUTION"], +d["VEHICLE THEFT"]];
            });

            //Update all circles
            svg.selectAll("circle")
                .data(dataset)
                .transition()
                .duration(1000)
                .attr("cx", function(d) {
                    return xScale(d[1]);
                })
                .attr("cy", function(d) {
                    return yScale(d[2]);
                })
                .attr("r", function(d) {
                    return rScale(d[1] + d[2]);
                });

            svg.selectAll("text")
                .data(dataset)
                .transition()
                .duration(1000)
                .attr("x", function(d) {
                    return xScale(d[1]);
                })
                .attr("y", function(d) {
                    return yScale(d[2]) - 8;
                });

            document.getElementById("idYear").innerHTML = dataId;
        });
    });
});