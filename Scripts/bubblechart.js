var diameter = 0,
		colorBubble = d3.scale.category20b(); //color category
		
		var csvFile = "ReasonForBubble.csv"
		
		var count = "RCOUNT";
		var factor = "CONTRIBUTINGFACTORVEHICLE1";
		var textToDisplay;
		
		var width = 400;
		var height = 500;

		var bubbleLayout;

		var svg4 = d3.select("#svg4")
			.append("svg")
			.attr("class", "bubbleLayout")
			.attr("width", 400)
			.attr("height", 500);
			
		var divTooltipBubble = d3.select("body").append("div")   
			.attr("class", "tooltipBubble")               
			.style("opacity", 0);
		
		
		var datasetPicker = function(InputCsvFile, num){
		
			if(InputCsvFile == "ReasonForBubble.csv") {
				csvFile = InputCsvFile;
				textToDisplay = "Reason";
				count = "RCOUNT";
				factor = "CONTRIBUTINGFACTORVEHICLE1";
				diameter = 500;
				bubbleLayout = d3.layout.pack()
								 .sort(function(a, b) {
								 	 return (a.value - b.value);
								 })
								 .size([diameter, diameter])
								 .value(function(d) {return d[count];})
								 .padding(50);
			} else {
				csvFile = InputCsvFile;
				textToDisplay = "Type";
				count = "VCOUNT"
				factor = "VEHICLETYPECODE1"
				diameter = 300;
				bubbleLayout = d3.layout.pack()
								 .sort(function(a, b) {
									 return (b.value);
								 })
								 .size([diameter, diameter])
								 .value(function(d) {return d[count];})
								 .padding(50);
			}
			
			var radios = document.getElementsByName('borough');
			
			for (var i = 0, length = radios.length; i < length; i++) {
				if (radios[i].checked) {
					boroughPicker(radios[i].value, num);
					break;
				}
			}
		};
		
		var boroughPicker = function(borough, num) {
		
			console.log(num);
		
			d3.csv("Data/Project/"+csvFile, function(d) { d.Count = parseFloat(d[count]); return d; },
			
				function(error, data) {

					data = data.filter(function(row) {
						return row["BID"] == borough && row[factor] != "Unspecified";
					});
					
					data = data.map(function(d){ d.value = +d.Count; return d; });
					
					var nodes = bubbleLayout.nodes({children:data}).filter(function(d) {return !d.children; });
					
					console.log(nodes.length);
					
					console.log();
					
					var rScale = d3.scale.linear()
								   .domain([1, d3.max(data, function(d) {return d.r; })])
								   .range([15, 50]);

					var vis = svg4.selectAll("circle")
								 .data(nodes, function(d) { return d[factor]; });
						
					var duration = 500;
					var delay, marginWidth, marginHeight = 0;
					
					if (count == "RCOUNT") {
						marginWidth = 50;
						marginHeight = 0;
						svg4.attr("width", 400).attr("height", 500);
					} else {
						marginWidth = 0;
						marginHeight = 0;
						svg4.attr("width", 300).attr("height", 300);
					}
					
					vis.transition()
						.duration(duration)
						.delay(function(d, i) {delay = i * 7; return delay;}) 
						.attr('transform', function(d) { return 'translate(' + (d.x - marginWidth) + ',' + (d.y - marginHeight) + ')'; })
						.attr('r', function(d) { return rScale(d.r); })
						.style('opacity', 1); // force to 1, so they don't get stuck below 1 at enter()
							
					vis.enter()
						.append('circle')
						.on("mouseover", function(d) {
							d3.select(this).transition().duration(300).style("opacity", 1);
							
							divTooltipBubble.transition().duration(300)
							   .style("opacity", 1)
							
							divTooltipBubble.html(textToDisplay + ": " + d[factor] + "<br> Count: " + d[count])
							   .style("left", (d3.event.pageX) + "px")
							   .style("top", (d3.event.pageY -30) + "px");
						})
						
						.on("mouseout", function() {
							d3.select(this)
							.transition().duration(300)
							.style("opacity", 0.8);
							
							divTooltipBubble.transition().duration(300)
							.style("opacity", 0);
						})
						.attr('transform', function(d) { return 'translate(' + (d.x - marginWidth) + ',' + (d.y - marginHeight) + ')'; })
						.attr('r', function(d) { return 0; })
						.attr('class', "bUnit")
						.transition()
						.duration(duration * 1.2)
						.attr('transform', function(d) { return 'translate(' + (d.x - marginWidth) + ',' + (d.y - marginHeight) + ')'; })
						.attr('r', function(d) { return rScale(d.r); })
						.style('opacity', 1)
						.style("fill", function(d) { return colorBubble(d.Count); });
					
					vis.exit()
						.transition()
						.duration(duration)
						.attr('transform', function(d) { 
							var dy = d.y - diameter/2;
							var dx = d.x - diameter/2;
							var theta = Math.atan2(dy,dx);
							var destX = diameter * (1 + Math.cos(theta) )/ 2;
							var destY = diameter * (1 + Math.sin(theta) )/ 2; 
							console.log(destX, destY);
							return 'translate(' + destX + ',' + destY + ')'; })
						.attr('r', function(d) { return 0; })
						.remove();
						
					if (num != 0) {
						svg4.selectAll("text")
						   .transition()
						   .duration(500)
						   .style('opacity', 0).remove()
					}
					
					nodes.forEach(function (d) {
						svg4.append("text")
							.style('opacity', 0)
							.transition()
							.duration(700)
							.style('opacity', 1)
							.attr("x", d["x"] - marginWidth)
							.attr("y", d["y"] + 5 - marginHeight)
							.attr("text-anchor", "middle")
							.text(d["Count"])
							.style({
								"fill":"white", 
								"font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
								"font-size": "12px"
							});
					});
			}); 
		};
		
		datasetPicker("ReasonForBubble.csv", 0);