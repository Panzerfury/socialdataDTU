		var w = 600;
		var h = 600;
		var path = d3.geo.path();
		var color = d3.scale.quantize().range(["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
               "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63", 
               "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"]);
		var svg, projection;
			
		d3.json("Data/sfpddistricts.json", function(json) {
			
			//Create SVG element for scatter 1
			svg = d3.select('#plot1')
				.append("svg")
				.attr("width", w)
				.attr("height", h);
				
			var scale  = 1;
			var offset = [w/2, h/2];
			projection = d3.geo.albers()
								   .scale(1)
								   .translate([0,0]);

			// create the path
			var path = d3.geo.path().projection(projection);
            
			var b  = path.bounds(json);
			var	s = 1 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
			var	t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

			projection.scale(s).translate(t);
			
			var path = d3.geo.path().projection(projection);
			
			svg.append("text")
				.text("K-Means: 2")
				.attr("id", "kNum")
				.attr("x", 150)
				.attr("y", 20)
				.attr("dominant-baseline", "central")
				.attr("transform", "rotate(15, 150, 20)")
				.attr("text-anchor", "middle")
				.attr("font-family", "sans-serif")
				.attr("font-size", "18px")
				.style("font-weight", "bold")
				.attr("fill", "#ffe4c4");

			svg.selectAll("path")
			   .data(json.features)
			   .enter()
			   .append("g")
			   .append("path")
			   .attr("d", path)
			   .attr("fill", '#66B2FF')
			   .attr('stroke',"black")
			   .attr('stroke-width', "2");
			   
			//Create labels
			svg.selectAll("text")
				.data(json.features)
				.enter()
				.append("text")
				.text(function(d) {
					return d['properties']['DISTRICT'];
				})
				.attr("x", function(d) {
					if (d['properties']['DISTRICT'] != 'SOUTHERN') {
						return path.centroid(d)[0];
					} else {
						return 421.80;
					}
				})
				.attr("y", function(d) {
					if (d['properties']['DISTRICT'] != 'SOUTHERN') {
						return path.centroid(d)[1];
					} else {
						return 240.87;
					}
				})
				.attr("dominant-baseline", "central")
				.attr("transform", function(d) {
					if (d['properties']['DISTRICT'] != 'SOUTHERN') {
						var x1 = path.centroid(d)[0];
						var y1 = path.centroid(d)[1];
					} else {
						var x1 = 421.80;
						var y1 = 240.87;					
					}
					return "rotate(15," + x1 + ", " + y1 + ")";
				})
				.attr("text-anchor", "middle")
				.attr("font-family", "sans-serif")
				.attr("font-size", "14px")
				.style("font-weight", "bold")
				.attr("fill", "#eee9e9");
		});
		
		d3.csv("Data/kMeansData.csv", function(data) {
				var kNum = 2;
				
				dataset = data.map(function(d) {
					return [+d["Y"], +d["X"], +d["k_means_" + kNum], +d["centerX_"+kNum], +d["centerY_"+kNum]];
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
				
				color.domain([
					d3.min(dataset, function(d) { return d[2]; }),
					d3.max(dataset, function(d) { return d[2]; })
				]);			

				svg.append("g")
				   .selectAll("circle")
				   .data(dataset)
				   .enter()
				   .append("circle")
				   .attr("cx", function(d) {
						   return projection([d[1], d[0]])[0];
				   })
				   .attr("cy", function(d) {
						   return projection([d[1], d[0]])[1];
				   })
				   .attr("r", 2.5)
				   .style("fill", function(d) { return color(d[2]); })
				   .style("opacity", "0.75");
				   
				
				svg.append("g")
				   .attr("id", "startCircles")
				   .selectAll("p")
				   .data(diffRows)
				   .enter()
				   .append("circle")
				   .attr("cx", function(d) {
						   return projection([d[4], d[3]])[0];
				   })
				   .attr("cy", function(d) {
						   return projection([d[4], d[3]])[1];
				   })
				   .attr("r", 8)
				   .style("stroke", "black")
				   .style("stroke-width", "3")
				   .style("fill", function(d) { return color(d[2]); });
				
				//On click, update with new data
				d3.select("#plot1").on("click", function() {
					
					svg.selectAll("#startCircles").remove();
					svg.selectAll("#newCircles").remove();
					diffRows = [];
					
					if (kNum < 10) {
						kNum++;
					} else {
						kNum = 2;
					}
					
					dataset = data.map(function(d) {
						return [+d["Y"], +d["X"], +d["k_means_" + kNum], +d["centerX_"+kNum], +d["centerY_"+kNum]];
					});
					
					for (i = 0; i < kNum; i++) {
						for (j = 0; j < dataset.length; j++) {
							if (dataset[j][2] == i){
								diffRows.push(dataset[j]);
								break;
							}
						}
					}
					
					svg.select("#kNum")
					   .text("K-Means: " + kNum);
					
					color.domain([
						d3.min(dataset, function(d) { return d[2]; }),
						d3.max(dataset, function(d) { return d[2]; })
					]);
					
					svg.selectAll("p")
					   .data(diffRows)
					   .enter()
					   .append("circle")
					   .attr("id", "newCircles")
					   .attr("cx", function(d) {
							   return projection([d[4], d[3]])[0];
					   })
					   .attr("cy", function(d) {
							   return projection([d[4], d[3]])[1];
					   })
					   .attr("r", 8)
					   .style("stroke", "black")
					   .style("stroke-width", "3")
					   .style("fill", function(d) { return color(d[2]); });
					   
					svg.selectAll("circle")
					   .data(dataset)
					   .style("fill", function(d) { return color(d[2]); });
				});
		});