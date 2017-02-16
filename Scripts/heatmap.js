// INITIAL VARIABLES USED FOR HEATMAP
		var margin = { top: 50, right: 0, bottom: 100, left: 60 }, 
			width1 = 950 - margin.left - margin.right,
			height1 = 430 - margin.top - margin.bottom,
			gridSize = 30,
			legendElementWidth = gridSize*2.5,
			colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],
			boroughs = ["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"],
			categories = ["Cyclist Injured", "Cyclist Killed", "Motorist Injured", "Motorist Killed", "Pedestrians Injured", "Pedestrians Killed", "Persons Injured", "Persons Killed"],
			times = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", 
			         "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"],
			datasets = ["heatmap1.csv", "heatmap2.csv"];

		// SVG INITIALIZE
        var svg1 = d3.select("#svg1").append("svg")
		            .attr("class", "heatmapSVG")
				    .attr("width", width1 + margin.left + margin.right + 50)
				    .attr("height", height1 + margin.top + margin.bottom - 150)
					.style("padding-top", 20);

		// TOOLTIP
		var divTooltipHeat = d3.select("body").append("div")   
						   .attr("class", "tooltipHeat")               
						   .style("opacity", 0);
					
		// TIME LABELS
	    var timeLabels = svg1.append("g").attr("class", "timeText").selectAll(".timeLabel")
			.data(times)
			.enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return (i * gridSize)+150; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(-16, -6)")
            .attr("class", "timeLabel");
		
		// BOROUGH LABELS
		var boroughLabel = svg1.append("g").attr("class", "boroughText").selectAll(".dayLabel")
							  .data(boroughs)
							  .enter().append("text")
							  .text(function (d) { return d; })
							  .attr("x", 150)
							  .attr("y", function (d, i) { return i * gridSize; })
							  .style("text-anchor", "end")
							  .attr("transform", "translate(-45," + gridSize / 1.5 + ")")
							  .attr("class", "dayLabel");
		
		var heatmapChart = function(csvFile, num) {
			
			if (csvFile == "heatmap1.csv") {
				var id = "BOROUGH";
				var time = "TIME";
				var value = "OccCount";
				var labelsLeft = boroughs;
				var svgHeight = 150;
				var marginLeft = 140;
				var visualBottom = 120;
				var visualBottomText = 107;
				var maxValue = 0;
				var colorText = 5000;
				document.getElementById("heatmaptTitle").innerHTML = "Incident count in a borough at a specific hour";
			} else {
				var id = "Category";
				var time = "Time";
				var value = "Count";	
				var labelsLeft = categories;
				var svgHeight = 130;
				var visualBottom = 30;
				var visualBottomText = 18;
				var marginLeft = 160;
				var maxValue = 2000;
				var colorText = 2400;
				document.getElementById("heatmaptTitle").innerHTML = "Incident count of a damage type at a specific hour";
			}
			
			d3.csv("Data/Project/"+csvFile, 
			function(d) {
				return { identifier: +d[id], hour: +d[time], count: +d[value] };			
			}, 
			function(error, data) {
				if (num == 0) {
					// SETUP COLOR SCALE FOR HEATMAP
					var colorScale = d3.scale.quantile()
										.domain([0, d3.max(data, function (d) { return d.count; }) - maxValue])
										.range(colors);

				
					// FILL VARIABLE WITH GRID BLOCKS FOR EACH ROW IN DATASET
					var gridBlocks = svg1.append("g").attr("class", "grid").selectAll(".hour")
										.data(data, function(d) {return d.identifier+' : '+d.hour;});

					// kan måske bruges til at lave tooltips ? 
					//gridBlocks.enter().append("title").text(function(d) { return d.count; });
					
					// GENERATING GRID BLOCKS AND THEIR ATTRIBUTES
					gridBlocks.enter().append("rect")
							  .attr("x", function(d) { return ((d.hour - 1) * gridSize)+150; })
							  .attr("y", function(d) { return (d.identifier - 1) * gridSize; })
							  .attr("rx", 4)
							  .attr("ry", 4)
							  .attr("width", gridSize)
							  .attr("height", gridSize)
							  .style("fill", colors[0])
							  .style("stroke", "black")
							  .style("stroke-width", "1px");
					
					// Transistion color shift
					gridBlocks.transition()
							  .duration(1000)
							  .style("fill", function(d) { return colorScale(d.count); });
				
					var indicatorsBelow = svg1.append("g").attr("class", "bottomVisual").selectAll(".indicatorsBelow")
											 .data([0].concat(colorScale.quantiles()), function(d) { return d; });

					indicatorsBelow.enter().append("g").attr("class", "indicatorsBelow")
								   .append("rect")
								   .attr("x", function(d, i) { return (legendElementWidth * i)+150; })
								   .attr("y", height1 - visualBottom)
								   .attr("width", legendElementWidth)
								   .attr("height", gridSize / 2)
								   .style("fill", function(d, i) { return colors[i]; })
								   .style("stroke", "black")
								   .style("stroke-width", "1px");

					indicatorsBelow.append("text")
								   .attr("class", "mono")
								   .text(function(d) { return "≥ " + Math.round(d); })
								   .attr("x", function(d, i) { return (legendElementWidth * i + 13)+150; })
								   .attr("y", height1 - visualBottomText)
								   .style("font-family", "Tahoma")
								   .style("font-size", "9pt")
								   .style("fill", function(d) {
										if (d < colorText) {
											return "black";
										} else {
											return "white";
										}
									});
									
					//Adding mouseevents
					gridBlocks.on("mouseover", function(d) {
						console.log(d);
						d3.select(this).transition().duration(300).style("opacity", 1);
						
						divTooltipHeat.transition().duration(300)
						   .style("opacity", 1)
						
						divTooltipHeat.html("Incident Count : " + d.count)
						   .style("left", (d3.event.pageX) + "px")
						   .style("top", (d3.event.pageY - 50) + "px");
					})
					
					gridBlocks.on("mouseout", function() {
						d3.select(this)
						.transition().duration(300)
						.style("opacity", 0.8);
						
						divTooltipHeat.transition().duration(300)
						.style("opacity", 0);
					})
				} else {
								
					//Update all Labels on the left
					svg1.select(".boroughText").remove();
					svg1.select(".grid").remove();;
					svg1.select(".bottomVisual").remove();;
					
					// SETUP COLOR SCALE FOR HEATMAP
					var colorScale = d3.scale.quantile()
						.domain([0, d3.max(data, function (d) { return d.count; })])
						.range(colors);
				
					// FILL VARIABLE WITH GRID BLOCKS FOR EACH ROW IN DATASET
					var gridBlocks = svg1.append("g").attr("class", "grid").selectAll(".hour")
										.data(data, function(d) {return d.identifier+' : '+d.hour;});

					// kan måske bruges til at lave tooltips ? 
					//gridBlocks.enter().append("title").text(function(d) { return d.count; });
					
					// GENERATING GRID BLOCKS AND THEIR ATTRIBUTES
					gridBlocks.enter().append("rect")
							  .attr("x", function(d) { return ((d.hour - 1) * gridSize)+150; })
							  .attr("y", function(d) { return (d.identifier - 1) * gridSize; })
							  .attr("rx", 4)
							  .attr("ry", 4)
							  .attr("width", gridSize)
							  .attr("height", gridSize)
							  .style("fill", colors[0])
							  .style("stroke", "black")
							  .style("stroke-width", "1px");
					
					// Transistion color shift
					gridBlocks.transition()
							  .duration(1000)
							  .style("fill", function(d) { return colorScale(d.count); });
				
					var indicatorsBelow = svg1.append("g").attr("class", "bottomVisual").selectAll(".indicatorsBelow")
											 .data([0].concat(colorScale.quantiles()), function(d) { return d; });

					indicatorsBelow.enter().append("g").attr("class", "indicatorsBelow")
								   .append("rect")
								   .attr("x", function(d, i) { return (legendElementWidth * i)+150; })
								   .attr("y", height1 - visualBottom)
								   .attr("width", legendElementWidth)
								   .attr("height", gridSize / 2)
								   .style("fill", function(d, i) { return colors[i]; })
								   .style("stroke", "black")
								   .style("stroke-width", "1px");

					indicatorsBelow.append("text")
								   .attr("class", "mono")
								   .text(function(d) { return "≥ " + Math.round(d); })
								   .attr("x", function(d, i) { return (legendElementWidth * i + 13)+150; })
								   .attr("y", height1 - visualBottomText)
								   .style("font-family", "Tahoma")
								   .style("font-size", "9pt")
								   .style("fill", function(d) {
										if (d < 5000) {
											return "black";
										} else {
											return "white";
										}
									});
								
					svg1.append("g").attr("class", "boroughText").selectAll(".dayLabel")
								   .data(labelsLeft)
								   .enter().append("text")
										   .text(function (d) { return d; })
										   .attr("x", 150)
										   .attr("y", function (d, i) { return i * gridSize; })
										   .style("text-anchor", "end")
										   .attr("transform", "translate(-45," + gridSize / 1.5 + ")")
										   .attr("class", "dayLabel");
					
					d3.select(".heatmapSVG")
					  .transition()
					  .duration(500)
					  .attr("width", width1 + margin.left + margin.right + 120)
					  .attr("height", height1 + margin.top + margin.bottom - svgHeight);
					
					//Update the rectangles inside the diagram
					svg1.selectAll(".hour rect")
					   .data(data)
					   .transition()
					   .duration(1000)
					   .attr("x", function(d) { return ((d.hour - 1) * gridSize)+150; })
					   .attr("y", function(d) { return (d.identifier - 1) * gridSize; })
					   .attr("rx", 4)
					   .attr("ry", 4)
					   .attr("class", "hour bordered")
					   .attr("width", gridSize)
					   .attr("height", gridSize)
					   .style("fill", colors[0])
					   .style("stroke", "black")
					   .style("stroke-width", "1px");
					   
					//Adding mouseevents
					gridBlocks.on("mouseover", function(d) {
						d3.select(this).transition().duration(300).style("opacity", 1);
						
						divTooltipHeat.transition().duration(300)
						   .style("opacity", 1)
						
						divTooltipHeat.html("Incident Count : " + d.count)
						   .style("left", (d3.event.pageX) + "px")
						   .style("top", (d3.event.pageY - 50) + "px");
					})
					
					gridBlocks.on("mouseout", function() {
						d3.select(this)
						.transition().duration(300)
						.style("opacity", 0.8);
						
						divTooltipHeat.transition().duration(300)
						.style("opacity", 0);
					})
				}
			});
		};
		
		heatmapChart("heatmap1.csv", 0);