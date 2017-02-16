// Creating radio buttons
		var shapeDataHist = ["BRONX", "BROOKLYN", "STATEN ISLAND", "MANHATTAN", "QUEENS"], j = 0;  // Choose K=2 as default
		var maxY = 0;

		// Create the shape selectors
		var formHist = d3.select("#hist2").append("form");
		labels = formHist.selectAll("label")
					 .data(shapeDataHist)
					 .enter()
					 .append("label")
					 .text(function(d) {return d;})
					 .insert("input")
					 .attr({
						 type: "checkbox",
						 class: "shape",
						 name: "Hist",
						 onclick: function(d,i ) { return "changeBorough("+i+",1)"; }
					 })
					 .property("checked", function(d, i) {return i===j;});
	
		//Margin, Width and height   
		var marginHistograms = {top: 20, right: 20, bottom: 30, left: 40},
			widthHistograms = 350 - marginHistograms.left - marginHistograms.right,
			heightHistograms = 200 - marginHistograms.top - marginHistograms.bottom;
		
		//Create SVG element
		var histSvg1 = d3.select("#hist1").append("svg")
						.attr("width", widthHistograms + marginHistograms.left + marginHistograms.right)
						.attr("height", heightHistograms + marginHistograms.top + marginHistograms.bottom)
						.append("g")
						.attr("transform", "translate(" + (marginHistograms.left+10) + "," + marginHistograms.top + ")");
		
		//Create SVG element
		var histSvg2 = d3.select("#hist2").append("svg")
				.attr("width", (widthHistograms + marginHistograms.left + marginHistograms.right) + 150)
				.attr("height", (heightHistograms + marginHistograms.top + marginHistograms.bottom) + 7)
				.style("border", "1px solid black")
				.style("margin-top", "15px")
				.append("g")
				.attr("transform", "translate(" + (marginHistograms.left+10) + "," + marginHistograms.top + ")");
				
		var x = d3.scale.ordinal()
				  .rangeRoundBands([0, widthHistograms], .1);
				  
		var x2 = d3.scale.ordinal()
				  .rangeRoundBands([0, widthHistograms + 150], .1);
				  
		var xAxis2 = d3.svg.axis()
			.scale(x2)
			.orient("bottom");	
			
		var y = d3.scale.linear()
				.range([heightHistograms, 0]);			
		
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
			
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(10);
				
		d3.csv("Data/Project/hist1.csv", function(data) {
			dataset = data.map(function(d) {
				return [+d["Year"], +d["Count"]];
			});
		
			x.domain(data.map(function(d) { return d["Year"]; }));
			y.domain([0, d3.max(data, function(d) { return d.Count; })]);
			
			histSvg1.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + heightHistograms + ")")
				  .call(xAxis);

			histSvg1.append("g")
				  .attr("class", "y axis")
				  .call(yAxis)
				  .append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text("Incidents");

			histSvg1.append("g")
				  .attr("class", "bars").selectAll(".bar")
				  .data(data)
				  .enter().append("rect")
				  .attr("class", "bar")
				  .attr("x", function(d) { return x(d["Year"]); })
				  .attr("width", x.rangeBand())
				  .attr("y", function(d) { return y(d.Count); })
				  .attr("height", function(d) { return heightHistograms - y(d.Count); });
				  
			//Create labels
			histSvg1.append("g")
				.attr("class", "valueText").selectAll(".label")
				.data(data)
				.enter()
				.append("text")
				.text(function(d) { return d.Count; })
				.attr("text-anchor", "middle")
				.attr("x", function(d, i) { return x(d["Year"]) + x.rangeBand() / 2; })
				.attr("y", function(d) { return y(d.Count) - 7; })
				.attr("font-family", "sans-serif")
				.attr("font-size", "11px")
				.attr("fill", "red");
			
		});
		
		function changeBorough(ix, num) {
			
			d3.csv("Data/Project/hist2.csv", function(data) {
					var datasetHist2 = data.map(function(d) { return [d["Borough"], +d["Year"], +d["Count"]]; } );

					var bName = shapeDataHist[ix];
					
					var dataHistograms = datasetHist2.filter(function(row) {
						return row[0] == bName;
					});
					
					console.log(dataHistograms);
					
					datasetHist2.forEach(function(dataArray) {
						if (maxY < dataArray[2]) {
							maxY = dataArray[2];
						}
					});
						
					x2.domain(dataHistograms.map(function(d) { return d[1]; }));
					y.domain([0, maxY]);
					
					if (num == 0) {			
						histSvg2.append("g")
							  .attr("class", "x axis")
							  .attr("transform", "translate(0," + heightHistograms + ")")
							  .call(xAxis2);

						histSvg2.append("g")
							  .attr("class", "y axis")
							  .call(yAxis)
							  .append("text")
							  .attr("transform", "rotate(-90)")
							  .attr("y", 6)
							  .attr("dy", ".71em")
							  .style("text-anchor", "end")
							  .text("Incidents");
					
						//Create bars
						histSvg2.selectAll("rect")
							.data(dataHistograms)
							.enter()
							.append("rect")
							.attr("x", function(d) { return x2(d[1]); })
							.attr("width", x2.rangeBand())
							.attr("y", function(d) { return y(d[2]); })
							.attr("height", function(d) { return heightHistograms - y(d[2]); })
							.attr("fill", function(d) {
								return "rgb(0, 0, " + (Math.floor(y(d[2]))) + ")";
							});

						//Create labels
						histSvg2.selectAll("text.labels")
							.data(dataHistograms)
							.enter()
							.append("text")
							.text(function(d) { return d[2]; })
							.attr("class", "valueLabel")
							.attr("text-anchor", "middle")
							.attr("x", function(d, i) { return x2(d[1]) + x2.rangeBand() / 2; })
							.attr("y", function(d) { return y(d[2]) - 7; })
							.attr("font-family", "sans-serif")
							.attr("font-size", "11px")
							.attr("fill", "red");							
					} else {
						
						console.log(dataHistograms);
						
						//Update all rects
						histSvg2.selectAll("rect")
							.data(dataHistograms)
							.transition()
							.delay(function(d, i) { return i / dataHistograms.length * 1000; })
							.duration(500)
							.attr("y", function(d) { return y(d[2]); })
							.attr("height", function(d) { return heightHistograms - y(d[2]); })
							.attr("fill", function(d) {
								return "rgb(0, 0, " + (Math.floor(y(d[2]))) + ")";
							});

						//Update all labels
						histSvg2.selectAll("text.valueLabel")
							.data(dataHistograms)
							.transition()
							.delay(function(d, i) { return i / dataHistograms.length * 1000; })
							.duration(500)
							.text(function(d) { return d[2]; })
							.attr("y", function(d) { return y(d[2]) - 7; });
					}							
			});
		};
		
		changeBorough(0,0);