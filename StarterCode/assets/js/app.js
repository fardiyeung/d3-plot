var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "noHealthInsurance";

// function used for updating x-scale var upon click on axis label
function xScale(caredata, chosenXAxis) {
  // create scales
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(caredata, d => d[chosenXAxis]) * 0.8,
      d3.max(caredata, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}
function yScale(caredata, chosenYAxis) {
  // create scales
  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(caredata, d => d[chosenYAxis]) * 0.8,
      d3.max(caredata, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderxAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis
    .transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderyAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis
    .transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to

function renderCircles(
  circlesGroup,
  newXScale,
  chosenXaxis,
  newYScale,
  chosenYAxis
) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  // if (chosenXAxis === "poverty") {
  //   var label = "poverty";
  // } else {
  //   var label = "age";
  // }
  // if (chosenYAxis === "noHealthInsurance") {
  //   var label = "noHealthInsurance";
  // }
  // else {
  //   var label = "smokes";
  // }

  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([50, -50])
    .html(function(d) {
      return `${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}
      <br>${chosenYAxis}: ${d[chosenYAxis]}`;
    });

  circlesGroup.call(toolTip);

  circlesGroup
    .on("mouseover", function(data) {
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
    });

  return circlesGroup; //no difference without this code
}

function renderBobbleText(
  caredata,
  chosenXAxis,
  chosenYAxis,
  xLinearScale,
  yLinearScale,
  remove = true
) {
  if (remove) {
    console.log("in remove");
    textlabelGroup
      .transition()
      .duration(1000)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]));
  } else {
    textlabelGroup = chartGroup
      .append("g")
      .selectAll("null")
      .data(caredata)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("text-anchor", "middle")
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(d => d.abbr)
      .attr("stroke", "white");
  }
  return textlabelGroup;
}

function renderChart(
  axis,
  value,
  caredata,
  xAxis,
  yAxis,
  circlesGroup,
  ageLabel,
  povertyLabel,
  noHealthlabel,
  smokelabel,
  incomeLabel,
  obeselabel
) {
  // if(axis =="x"){
  //   chosenXAxis = value;

  // }
  // else if(axis =="y"){
  //   chosenYAxis = value;

  // }

  var priorChosenXAxis;
  var priorChosenYAxis;
  if (axis == "x") {
    priorChosenXAxis = chosenXAxis;
    chosenXAxis = value;
    switch (chosenXAxis) {
      case "poverty":
        povertyLabel.classed("active", true).classed("inactive", false);
        break;
      case "age":
        ageLabel.classed("active", true).classed("inactive", false);
        break;
      case "income":
        incomeLabel.classed("active", true).classed("inactive", false);
        break;
    }
    switch (priorChosenXAxis) {
      case "poverty":
        povertyLabel.classed("active", false).classed("inactive", true);
        break;
      case "age":
        ageLabel.classed("active", false).classed("inactive", true);
        break;
      case "income":
        incomeLabel.classed("active", false).classed("inactive", false);
        break;
    }
  } else if (axis == "y") {
    priorChosenYAxis = chosenYAxis;
    chosenYAxis = value;
    switch (chosenYAxis) {
      case "smokes":
        smokelabel.classed("active", true).classed("inactive", false);
        break;
      case "noHealthInsurance":
        noHealthlabel.classed("active", true).classed("inactive", false);
        break;
      case "obesity":
        obeselabel.classed("active", true).classed("inactive", false);
        break;
    }
    switch (priorChosenYAxis) {
      case "smokes":
        smokelabel.classed("active", false).classed("inactive", true);
        break;
      case "noHealthInsurance":
        noHealthlabel.classed("active", false).classed("inactive", true);
        break;
      case "obesity":
        obeselabel.classed("active", false).classed("inactive", true);
        break;
    }
  }

  console.log(chosenXAxis);
  xLinearScale = xScale(caredata, chosenXAxis);
  yLinearScale = yScale(caredata, chosenYAxis);

  // updates x axis and y axis with transition
  xAxis = renderxAxes(xLinearScale, xAxis);
  yAxis = renderyAxes(yLinearScale, yAxis);

  // updates circles with new x and y values

  circlesGroup = renderCircles(
    circlesGroup,
    xLinearScale,
    chosenXAxis,
    yLinearScale,
    chosenYAxis
  );
  // renderCircles(circlesGroup, xLinearScale, chosenXAxis
  //   ,yLinearScale,chosenYAxis);

  // updates tooltips with new info
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  //update bobble text:
  textlabelGroup = renderBobbleText(
    caredata,
    chosenXAxis,
    chosenYAxis,
    xLinearScale,
    yLinearScale
  );
}

// }
// Retrieve data from the CSV file and execute everything below
d3.csv("../data/data.csv").then(function(caredata) {
  // parse data
  caredata.forEach(function(data) {
    data.noHealthInsurance = +data.noHealthInsurance;
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.state = data.state;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(caredata, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(caredata, chosenYAxis);
  //   d3.scaleLinear()
  //     .domain([0, d3.max(caredata, d => d[chosenYAxis])])
  //     .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup
    .append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  //
  var yAxis = chartGroup
    .append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(caredata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", "0.75");

  renderBobbleText(
    caredata,
    chosenXAxis,
    chosenYAxis,
    xLinearScale,
    yLinearScale,
    false
  );

  // Create group for  3 x- axis labels
  var labelsGroup = chartGroup
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var labelsYGroup = chartGroup.append("g");

  var povertyLabel = labelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In poverty");

  var ageLabel = labelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Medium)");

  var incomeLabel = labelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis
  var noHealthlabel = labelsYGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("value", "noHealthInsurance")
    .classed("active", true)
    .text("lack of Health Care Insurement");

  var smokelabel = labelsYGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

  var obeselabel = labelsYGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text").on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    // console.log("hi");
    // console.log(value);
    var axis = "x";
    renderChart(
      axis,
      value,
      caredata,
      xAxis,
      yAxis,
      circlesGroup,
      ageLabel,
      povertyLabel,
      noHealthlabel,
      smokelabel,
      incomeLabel,
      obeselabel
    );
  });
  labelsYGroup.selectAll("text").on("click", function() {
    // get value of selection
    var axis = "y";
    var value = d3.select(this).attr("value");
    console.log(value);
    // switch(value){
    //   case"noHealthInsurance": value = "poverty";
    //   break;
    //   case"smokes": value = "age";
    //   break;
    //   case"obesity": value = "income";
    //   break;
    // }
    // if(value=="smokes"){
    //   value = "age";
    // }
    // else if(value = "obesity"){
    //   value = "income";
    // }
    // else {
    //   value = "noHealthInsurance"
    // }
    renderChart(
      axis,
      value,
      caredata,
      xAxis,
      yAxis,
      circlesGroup,
      ageLabel,
      povertyLabel,
      noHealthlabel,
      smokelabel,
      incomeLabel,
      obeselabel
    );
  });
});
