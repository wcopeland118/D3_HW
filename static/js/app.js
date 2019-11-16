// set svg lets
let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("/static/data/data.csv").then(function(data) {
  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });

  let xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, d => d.poverty) * 0.9,
      d3.max(data, d => d.poverty) * 1.1
    ])
    .range([0, width]);

  let yLinearScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare) * 1.1])
    .range([height, 0]);

  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .style("font-size", "16px")
    .call(bottomAxis);

  chartGroup
    .append("g")
    .style("font-size", "16px")
    .call(leftAxis);

  chartGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 12)
    .attr("fill", "green")
    .attr("opacity", ".7");

  chartGroup
    .selectAll("text.text-circles")
    .data(data)
    .enter()
    .append("text")
    .classed("text-circles", true)
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "white");

  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 30 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Lacks Healthcare (%)");

  chartGroup
    .append("text")
    .attr("y", height + margin.bottom / 2 - 10)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .classed("aText", true)
    .text("In Poverty (%)");
});
