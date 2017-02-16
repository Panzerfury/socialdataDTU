var dataset2 = [];
var w2 = 700;
var h2 = 200;
var barPadding = 1;
var maxY = 0;
var graphValue = 0;

d3.csv("Data/timedata.csv", function(data) {
    dataset2 = data.map(function(d) {
        return [d["Category"], +d["Time"], +d["Amount"], +d["CatID"]];
    });

    var curData = []

    dataset2.forEach(function(dataArray) {
        if (dataArray[3] == 0) {
            if (maxY < dataArray[2]) {
                maxY = dataArray[2];
            }
            curData.push(dataArray);
        }
    });

    var xScale = d3.scale.ordinal()
        .domain(d3.range(curData.length))
        .rangeRoundBands([0, w2], 0.05);

    var yScale = d3.scale.linear()
        .domain([0, maxY])
        .range([0, h2 - 20]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    //Create SVG element
    var svg2 = d3.select("#scatter2")
        .append("svg")
        .attr("width", w2)
        .attr("height", h2 + 50);

    //Create bars
    svg2.selectAll("rect")
        .data(curData)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(d[1]);
        })
        .attr("y", function(d) {
            return h2 - yScale(d[2]);
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d) {
            return yScale(d[2]);
        })
        .attr("fill", function(d) {
            return "rgb(0, 0, " + (Math.floor(yScale(d[2]))) + ")";
        });

    //Create labels
    svg2.selectAll("text")
        .data(curData)
        .enter()
        .append("text")
        .text(function(d) {
            return d[2];
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return xScale(d[1]) + xScale.rangeBand() / 2;
        })
        .attr("y", function(d) {
            return h2 - yScale(d[2]) - 7;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "red");

    svg2.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + (h2 + 5) + ")")
        .call(xAxis);

    //On click, update with new data			
    d3.select("#scatter2").on("click", function() {

        graphValue = (graphValue + 1) % 14;

        var curData = []
        maxY = 0;

        dataset2.forEach(function(dataArray) {
            if (dataArray[3] == graphValue) {
                if (maxY < dataArray[2]) {
                    maxY = dataArray[2];
                }
                curData.push(dataArray);
            }
        });

        document.getElementById("categoryTitle").innerHTML = curData[0][0];

        var yScale = d3.scale.linear()
            .domain([0, maxY])
            .range([0, h2 - 20]);

        //Update all rects
        svg2.selectAll("rect")
            .data(curData)
            .transition()
            .delay(function(d, i) {
                return i / curData.length * 1000;
            })
            .duration(500)
            .attr("y", function(d) {
                return h2 - yScale(d[2]);
            })
            .attr("height", function(d) {
                return yScale(d[2]);
            })
            .attr("fill", function(d) {
                return "rgb(0, 0, " + (Math.floor(yScale(d[2]))) + ")";
            });

        //Update all labels
        svg2.selectAll("text")
            .data(curData)
            .transition()
            .delay(function(d, i) {
                return i / curData.length * 1000;
            })
            .duration(500)
            .text(function(d) {
                return d[2];
            })
            .attr("x", function(d, i) {
                return xScale(d[1]) + xScale.rangeBand() / 2;
            })
            .attr("y", function(d) {
                return h2 - yScale(d[2]) - 7;
            });
    });
});