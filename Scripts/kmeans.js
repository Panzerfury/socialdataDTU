// Creating radio buttons
			var shapeData = ["2", "3", "4", "5", "6", "7"], j = 0;  // Choose K=2 as default

			// Create the shape selectors
			var form = d3.select("#svg3").append("form");

			labels = form.selectAll("label")
						 .data(shapeData)
						 .enter()
						 .append("label")
						 .text(function(d) {return "K-Means: " + d;})
						 .insert("input")
						 .attr({
							 type: "checkbox",
							 class: "shape",
							 name: "kMeans",
							 onclick: function(d,i ) {return "changeK("+(i+2)+")"; }
						 })
						 .property("checked", function(d, i) {return i===j;});
		
			//Width and height
			var width = 600;
			var height = 600;
			
			// Setting color domains(intervals of values) for our map
			var color = ["#0000FF", "#FFFF00", "#FF0000", "#FF00FF", "#00FF00", "#FFA500", "#FFFFFF"]           
			
			
			//Create SVG element
			var svg3 = d3.select("#svg3").append("svg")
					.attr("width", width)
					.attr("height", height)
					.style("margin", "10px auto")
					.style("background-color", "#66B2FF");
			
			var projectionKMeans = d3.geo.mercator()
						   .center([-73.985, 40.742])
						   .scale(220000)
						   .translate([width/2, height/2]);
		
			var pathKMeans = d3.geo.path().projection(projectionKMeans);
			
			//Reading map file and data
			queue()
				.defer(d3.json, "Data/Project/nycZipCode.geojson")
				.defer(d3.csv, "Data/Project/kMeansData.csv")
				.await(ready);	
			
			//Start of Choropleth drawing
			function ready(error, map, data) {
				var kNum = 2;
				
				dataset = data.map(function(d) {
					return [+d["lon"], +d["lat"], +d["k_means_" + kNum], +d["centerX_" + kNum], +d["centerY_" + kNum]];
				});
				
				var diffRows = [];
				
				for (i = 0; i < kNum; i++) {
					for (j = 0; j < dataset.length; j++) {
						if (dataset[j][2] == i){
							diffRows.push(dataset[j]);
							break;
						}
					}
				}
			
				//Drawing Regions
				svg3.append("g")
				   .attr("class", "region")
				   .selectAll("path")
				   .data(map.features)
				   .enter().append("path")
				   .attr("d", pathKMeans)
				   .attr("fill", '#008000')
				   .attr('stroke',"black")
				   .attr('stroke-width', "2");
				
				//Drawing Zip Code Text
				svg3.append("g").attr("class", "zipCodes")
					.selectAll("text")
					.data(map.features)
					.enter()
					.append("text")
					.text(function(d) { return d.properties.postalCode; })
					.attr("x", function(d) { return pathKMeans.centroid(d)[0]; })
					.attr("y", function(d) { return pathKMeans.centroid(d)[1]; })
					.attr("dominant-baseline", "central")
					.attr("text-anchor", "middle")
					.attr("font-family", "sans-serif")
					.attr("font-size", "3px")
					.style("font-weight", "bold")
					.style("cursor", "default")
					.attr("fill", "#eee9e9");
			
				// Drawing K-Means Num Text
				svg3.append("g").attr("class", "kNumText")
					.append("text")
					.text("K-Means: 2")
					.attr("id", "kNum")
					.attr("x", 100)
					.attr("y", 120)
					.attr("dominant-baseline", "central")
					.attr("text-anchor", "middle")
					.attr("font-family", "sans-serif")
					.attr("font-size", "28px")
					.style("font-weight", "bold")
					.attr("fill", "#ffe4c4");
				
				// Drawing Cluster Points
				svg3.append("g")
				   .selectAll("circle")
				   .data(dataset)
				   .enter()
				   .append("circle")
				   .attr("cx", function(d) {
						   return projectionKMeans([d[0], d[1]])[0];
				   })
				   .attr("cy", function(d) {
						   return projectionKMeans([d[0], d[1]])[1];
				   })
				   .attr("r", 2.5)
				   .style("fill", function(d) { return color[d[2]]; })
				   .style("opacity", "0.75");
			
				svg3.append("g")
				   .attr("id", "startCircles")
				   .selectAll("p")
				   .data(diffRows)
				   .enter()
				   .append("circle")
				   .attr("cx", function(d) {
							console.log(d[4], d[3]);
						   return projectionKMeans([d[4], d[3]])[0];
				   })
				   .attr("cy", function(d) {
						   return projectionKMeans([d[4], d[3]])[1];
				   })
				   .attr("r", 8)
				   .style("stroke", "black")
				   .style("stroke-width", "3")
				   .style("fill", function(d) { return color[d[2]]; });
				
			};
			
			function changeK(val) {
				svg3.selectAll("#startCircles").remove();
				svg3.selectAll("#newCircles").remove();
				diffRows = [];
				
				d3.csv("Data/Project/kMeansData.csv", function(data) {			
					dataset = data.map(function(d) {
						return [+d["Y"], +d["X"], +d["k_means_" + val], +d["centerX_" + val], +d["centerY_" + val]];
					});
							
					for (i = 0; i < val; i++) {
						for (j = 0; j < dataset.length; j++) {
							if (dataset[j][2] == i){
								diffRows.push(dataset[j]);
								break;
							}
						}
					}
							
					svg3.select("#kNum")
					   .text("K-Means: " + val);
							
					svg3.selectAll("p")
					   .data(diffRows)
					   .enter()
					   .append("circle")
					   .attr("id", "newCircles")
					   .attr("cx", function(d) {
							   return projectionKMeans([d[4], d[3]])[0];
					   })
					   .attr("cy", function(d) {
							   return projectionKMeans([d[4], d[3]])[1];
					   })
					   .attr("r", 8)
					   .style("stroke", "black")
					   .style("stroke-width", "3")
					   .style("fill", function(d) { return color[d[2]]; });
					   
					svg3.selectAll("circle")
					   .data(dataset)
					   .style("fill", function(d) { return color[d[2]]; });
				});
			}