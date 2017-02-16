	// Creating radio buttons
			var shapeDataKNN = ["5", "10", "30"], j = 0;  // Choose K=2 as default

			// Create the shape selectors
			var formKNN = d3.select("#svg5").append("form");

			labels = formKNN.selectAll("label")
						 .data(shapeDataKNN)
						 .enter()
						 .append("label")
						 .text(function(d) {return "KNN: " + d;})
						 .insert("input")
						 .attr({
							 type: "checkbox",
							 class: "shape",
							 name: "KNN",
							 onclick: function(d,i ) { return "changeN("+(d)+")"; }
						 })
						 .property("checked", function(d, i) {return i===j;});
		
			//Width and height
			var width = 600;
			var height = 600;
			
			// Setting color domains(intervals of values) for our map
			var colorKNN = ["#ff0000", "#00ff00", "#0000ff"]           
			
			
			//Create SVG element
			var svg5 = d3.select("#svg5").append("svg")
					.attr("width", width)
					.attr("height", height)
					.style("margin", "10px auto")
					.style("background-color", "#66B2FF");
			
			var projectionKNN = d3.geo.mercator()
						   .center([-73.9762, 40.705])
						   .scale(61500)
						   .translate([width/2, height/2]);
		
			var pathKNN = d3.geo.path().projection(projectionKNN);
			
			//Reading map file and data
			queue()
				.defer(d3.json, "Data/Project/nycZipCode.geojson")
				.defer(d3.csv, "Data/Project/KNNDataXS.csv")
				.await(ready);	
			
			//Start of Choropleth drawing
			function ready(error, map, data) {
				var neighbors = 5;
				
				dataset = data.map(function(d) {
					return [+d["lon"], +d["lat"], +d["color" + neighbors]];
				});
			
				//Drawing Regions
				svg5.append("g")
				   .attr("class", "region")
				   .selectAll("path")
				   .data(map.features)
				   .enter().append("path")
				   .attr("d", pathKNN)
				   .attr("fill", '#008000')
				   .attr('stroke',"black")
				   .attr('stroke-width', "2");
				
				// Drawing Cluster Points
				svg5.append("g")
				   .selectAll("circle")
				   .data(dataset)
				   .enter()
				   .append("circle")
				   .attr("cx", function(d) {
						   return projectionKNN([d[0], d[1]])[0];
				   })
				   .attr("cy", function(d) {
						   return projectionKNN([d[0], d[1]])[1];
				   })
				   .attr("r", 2.5)
				   .style("fill", function(d) { return colorKNN[d[2]]; })
				   .style("opacity", "0.75");
				
				// Drawing KNN Neighbor Text
				svg5.append("g").attr("class", "KNNText")
					.append("text")
					.text("KNN: 5")
					.attr("id", "neighbors")
					.attr("x", 100)
					.attr("y", 120)
					.attr("dominant-baseline", "central")
					.attr("text-anchor", "middle")
					.attr("font-family", "sans-serif")
					.attr("font-size", "28px")
					.style("font-weight", "bold")
					.style("background-color", "rgba(0,0,0,0.1)")
					.attr("fill", "#ffe4c4");
				
			};
			
			function changeN(val) {
								
				d3.csv("Data/Project/KNNDataXS.csv", function(data) {			
					dataset = data.map(function(d) {
						return [+d["color" + val]];
					});
					
					svg5.select("#neighbors")
					   .text("KNN: " + val);
					   
					console.log(val);
					console.log(dataset);
					svg5.selectAll("circle")
					   .data(dataset)
					   .transition()
					   .duration(3000)
					   .style("fill", function(d) { return colorKNN[d]; });
				});
			}