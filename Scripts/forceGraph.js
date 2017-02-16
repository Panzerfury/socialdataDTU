	var marginForce = {top: 20, right: 120, bottom: 20, left: 120},
		widthForce = 960 - marginForce.right - marginForce.left,
		heightForce = 800 - marginForce.top - marginForce.bottom;

	var i = 0,
		duration = 750,
		root;

	var treeForce = d3.layout.tree()
		.size([heightForce, widthForce]);

	var diagonalForce = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

	var svg6 = d3.select("#svg6").append("svg")
		.attr("width", widthForce + marginForce.right + marginForce.left)
		.attr("height", heightForce + marginForce.top + marginForce.bottom)
		.append("g")
		.attr("transform", "translate(" + marginForce.left + "," + marginForce.top + ")");

	d3.json("Data/Project/ForceGraphData.json", function(error, flare) {
		  if (error) throw error;

		  root = flare;
		  root.x0 = heightForce / 2;
		  root.y0 = 0;

		  function collapse(d) {
			if (d.children) {
			  d._children = d.children;
			  d._children.forEach(collapse);
			  d.children = null;
			}
		  }

		  root.children.forEach(collapse);
		  console.log(root);
		  update(root);
	});

	d3.select(self.frameElement).style("height", "800px");

	function update(source) {

	  // Compute the new tree layout.
	  var nodesForce = treeForce.nodes(root).reverse(), 
					   links = treeForce.links(nodesForce);
					   
	  // Normalize for fixed-depth.
	  nodesForce.forEach(function(d) { d.y = d.depth * 180; });

	  // Update the nodes…
	  var node = svg6.selectAll("g.node")
		  .data(nodesForce, function(d) { return (d.id = ++i); });

	  // Enter any new nodes at the parent's previous position.
	  var nodeEnter = node.enter().append("g")
		  .attr("class", "node")
		  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		  .on("click", click);

	  nodeEnter.append("circle")
		  .attr("r", 1e-6)
		  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeEnter.append("text")
		  .attr("y", function(d) { 
				return d.children || d._children ? -12 : 12; })
		  .attr("dy", ".35em")
		  .attr("text-anchor", "middle")
		  .text(function(d) { return d.name; })
		  .style("fill-opacity", 1e-6);

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
		  .duration(duration)
		  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	  nodeUpdate.select("circle")
		  .attr("r", 4.5)
		  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeUpdate.select("text")
		  .style("fill-opacity", 1);

	  // Transition exiting nodes to the parent's new position.
	  var nodeExit = node.exit().transition()
		  .duration(duration)
		  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		  .remove();

	  nodeExit.select("circle")
		  .attr("r", 1e-6);

	  nodeExit.select("text")
		  .style("fill-opacity", 1e-6);

	  // Update the links…
	  var link = svg6.selectAll("path.link")
		  .data(links, function(d) { return d.target.id; });

	  // Enter any new links at the parent's previous position.
	  link.enter().insert("path", "g")
		  .attr("class", "link")
		  .attr("d", function(d) {
			var o = {x: source.x0, y: source.y0};
			return diagonalForce({source: o, target: o});
		  });

	  // Transition links to their new position.
	  link.transition()
		  .duration(duration)
		  .attr("d", diagonalForce);

	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
		  .duration(duration)
		  .attr("d", function(d) {
			var o = {x: source.x, y: source.y};
			return diagonalForce({source: o, target: o});
		  })
		  .remove();

	  // Stash the old positions for transition.
	  nodesForce.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	  });
	}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
	console.log(d._children);
  } else {
    d.children = d._children;
    d._children = null;
	console.log(d.children);
  }
  update(d);
}