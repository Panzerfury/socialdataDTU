			var dataset = [ 5, 10, 15, 20, 25 ];
			
			d3.select("#svg1")
				.selectAll("p")
				.data(dataset)
				.enter()
				.append("p")
				.text(function(d) {
					return "I can count up to " + d;
				})
				.style("color", function(d) {
					if (d > 15) {	//Threshold of 15
						return "red";
					} else {
						return "black";
					}
				});
				
			var svg = d3.select("#svg1")
						.append("svg")
						.attr("width", "50")
						.attr("height", "50");
			
			svg.append('circle')
				.attr("cx", "25")
				.attr("cy", "25")
				.attr("r", "22")
				.style("fill", "yellow")
				.style("stroke", "orange")
				.style("stroke-width", "5");