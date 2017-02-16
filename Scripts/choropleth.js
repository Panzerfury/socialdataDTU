//Width and height
		var width = 760;
		var height = 600;
		
		// Setting color domains(intervals of values) for our map
		var color_domain = [50, 150, 350, 750, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5500, 6000]
		var ext_color_domain = [0, 50, 150, 350, 750, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5500, 6000]
		var legend_labels = ["< 50", "50+", "150+", "350+", "750+", "1500+", "2000+", "2500+", "3000+", "3500+", "4000+", "4500+", "5500+", " > 6000"]              
		var colorChoro = d3.scale.threshold()
					  .domain(color_domain)
					  .range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300", "#e51100", "#cc0f00", "#b20d00", "#990b00", "#660700", "#330300", "#190100", "#000000"]);
		
		var divTooltip = d3.select("body").append("div")   
						   .attr("class", "tooltip")               
						   .style("opacity", 0);
		
		//Create SVG element
		var svg = d3.select("#svg2").append("svg")
					.attr("width", width)
					.attr("height", height)
					.style("margin", "10px auto");
		
		var projection = d3.geo.mercator()
						   .center([-73.93, 40.70])
						   .scale(60000)
						   .translate([width/2, height/2]);
		
		var path = d3.geo.path().projection(projection);
		 
		 
		//Reading map file and data
		queue()
			.defer(d3.json, "Data/Project/nycZipCode.geojson")
			.defer(d3.csv, "Data/Project/ChoroData.csv")
			.await(ready);
				
		//Start of Choropleth drawing
		function ready(error, map, data) {
			var rateById = {};
		    var nameById = {};
			var poNameById = {};
			
			data.forEach(function(d) {
				rateById[d['ZIPCODE']] = +d.COUNT;
				nameById[d['ZIPCODE']] = d['ZIPCODE'];
			});
			
			map.features.forEach(function(d) {
				poNameById[d['properties']['postalCode']] = d['properties']['PO_NAME'];
			});
			
			//Drawing Choropleth
			svg.append("g")
			   .attr("class", "region")
			   .selectAll("path")
			   .data(map.features)
			   .enter().append("path")
			   .attr("class", "choroPath")
			   .attr("d", path)
			   .style("fill", function(d) {
					return colorChoro(rateById[d.properties.postalCode]); 
			   })
			   .style("opacity", 0.8)
			
			//Adding mouseevents
			.on("mouseover", function(d) {
				d3.select(this).transition().duration(300).style("opacity", 1);
				
				divTooltip.transition().duration(300)
				   .style("opacity", 1)
				
				divTooltip.html("Post Office : " + poNameById[d.properties.postalCode] + "<br/>" + "Zip Code : " + d.properties.postalCode + "<br/>" + "Incident Count : " + rateById[d.properties.postalCode])
				   .style("left", (d3.event.pageX) + "px")
				   .style("top", (d3.event.pageY - 80) + "px");
			})
			
			.on("mouseout", function() {
				d3.select(this)
				.transition().duration(300)
				.style("opacity", 0.8);
				
				divTooltip.transition().duration(300)
				.style("opacity", 0);
			})
		}; // <-- End of Choropleth drawing
		
		//Adding legend for our Choropleth

		var legend = svg.selectAll("g.legend")
						.data(ext_color_domain)
						.enter().append("g")
						.attr("class", "legend");

		var ls_w = 20, ls_h = 20;
		var x_position = 40;
		var y_position = 80;
		
		legend.append("rect")
			  .attr("x", x_position)
			  .attr("y", function(d, i){ return ((i*ls_h) - 2*ls_h) + y_position;})
			  .attr("width", ls_w)
			  .attr("height", ls_h)
			  .style("fill", function(d, i) { return colorChoro(d); })
			  .style("opacity", 0.8);

		legend.append("text")
			  .attr("x", x_position + 30)
			  .attr("y", function(d, i){ return ((i*ls_h) - ls_h - 4) + y_position;})
			  .text(function(d, i){ return legend_labels[i]; });