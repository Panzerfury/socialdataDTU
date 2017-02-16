d3.csv("Data/Project/PredictTimeData.csv", function(data) {
		
			dataset2 = data.map(function(d) {
				return [d["CONTRIBUTINGFACTORVEHICLE1"], d["BOROUGH"]];
			});
			
			var key = d3.select("#prediction2")
					    .selectAll("select")
					    .data([[0],[1]])
					    .enter()
						.append("label")
						.attr("class", "dropdown")
					    .append("select")
						.attr("class", function (d){ return "selectTime" + d;})
						.attr("id", function (d){ return "selector" + d;});
			
			console.log(dataset2);
			
			d3.select(".selectTime0").selectAll("option")
				.data(d3.map(data, function(d){return d.CONTRIBUTINGFACTORVEHICLE1;}).keys())
				.enter()
				.append("option")
				.text(function(d){return d;})
				.attr("value",function(d){return d;});
			
			d3.select(".selectTime1").selectAll("option")
				.data(d3.map(data, function(d){return d.BOROUGH;}).keys())
				.enter()
				.append("option")
				.text(function(d){return d;})
				.attr("value", function(d){return d;});
			
			var button = d3.select("#prediction2")
						   .append("button")
						   .attr("class", "button")
						   .attr("onclick", "getPredictionTime()")
						   .text("Predict Time!");
		});
		
		var resultField2 = d3.select("#prediction2")
							.append("input")
							.attr("type", "text")
							.attr("id", "resultBorough")
							.attr("readonly", "readonly")
							.attr("value", "Placeholder")
							.style("float", "right");
		
		var getPredictionTime = function(){
			var option1 = document.getElementById('selector0').value;
			var option2 = document.getElementById('selector1').value;
			
			d3.csv("Data/Project/PredictTimeData.csv", function(data) {
				
				console.log(option1);
				console.log(option2);
				dataset2 = data.filter(function(d) {
						console.log(d);
						return (d["BOROUGH"] == option2 && d["CONTRIBUTINGFACTORVEHICLE1"] == option1);
				});
				
				console.log(dataset2);
				
				resultField2.style('opacity', 0)
						   .transition()
						   .duration(700)
						   .style('opacity', 1)
						   .attr('value', dataset2[0].TIME_PREDICTION + ":00");
			});
		};	
			
		d3.csv("Data/Project/PredictBoroughData.csv", function(data) {
		
			dataset = data.map(function(d) {
				return [d["CONTRIBUTINGFACTORVEHICLE1"], +d["TIME"]];
			});
			
			var key = d3.select("#prediction")
					    .selectAll("select")
					    .data([[0],[1]])
					    .enter()
						.append("label")
						.attr("class", "dropdown")
					    .append("select")
						.attr("class", function (d){ return "selectBorough" + d;})
						.attr("id", function (d){ return "select" + d;});
			
			d3.select(".selectBorough0").selectAll("option")
				.data(d3.map(data, function(d){return d.CONTRIBUTINGFACTORVEHICLE1;}).keys())
				.enter()
				.append("option")
				.text(function(d){return d;})
				.attr("value",function(d){return d;});
			
			d3.select(".selectBorough1").selectAll("option")
				.data(data.sort(function(a,b) {return +a.TIME - +b.TIME;}))
				.data(d3.map(data, function(d){return d.TIME;}).keys())
				.enter()
				.append("option")
				.text(function(d){return d + ":00";})
				.attr("value",function(d){return d;});
			
			var button = d3.select("#prediction")
						   .append("button")
						   .attr("class", "button")
						   .attr("onclick", "getPredictionBorough()")
						   .text("Predict Borough!");
		});
		
		var resultField = d3.select("#prediction")
							.append("input")
							.attr("type", "text")
							.attr("id", "resultBorough")
							.attr("readonly", "readonly")
							.attr("value", "Placeholder")
							.style("float", "right");
		
		var getPredictionBorough = function(){
			var option1 = document.getElementById('select0').value;
			var option2 = document.getElementById('select1').value;
			
			d3.csv("Data/Project/PredictBoroughData.csv", function(data) {
				
				dataset = data.filter(function(d) {
						return (+d["TIME"] == option2 && d["CONTRIBUTINGFACTORVEHICLE1"] == option1);
				});
				
				
				resultField.style('opacity', 0)
						   .transition()
						   .duration(700)
						   .style('opacity', 1).attr('value', dataset[0].PREDICTION);
			});
		};	