class Line {

  constructor(_config, _data, _colorScale) {
    this.config = {
      parentElement: _config.parentElement,
      title: _config.title,
      yValues: _config.yValues,
      containerWidth: _config.containerWidth || 350,
      containerHeight: _config.containerHeight || 175,
      margin: { top: 30, bottom: 30, right: 50, left: 50 }
    }

    this.data = _data;
    this.colorScale = _colorScale

    // Call a class function
    this.initVis();
  }

  initVis() {
      
    let vis = this;

    //set up the width and height of the area where visualizations will go- factoring in margins               
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xValue = d => d.year; 
    // vis.colorScale = d3.scaleOrdinal().domain(vis.config.yValues).range(d3.schemeSet2)
    let e1 = [];
    vis.config.yValues.forEach(element => { e1 = e1.concat(d3.extent(vis.data, (d) => d[element]))})

    //setup scales
    vis.xScale = d3.scaleLinear()
        .domain(d3.extent(vis.data, vis.xValue))
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .domain( d3.extent(e1) )
        .range([vis.height, 0])
        .nice();


    // // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale).tickFormat(d3.format("d"));
    vis.yAxis = d3.axisLeft(vis.yScale).tickSize(-vis.width).tickPadding(10).ticks(6);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight)
        .style("background-color", "#fcfcfc");


    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    

    // Append x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis')
        .call(vis.yAxis); 

    vis.tooltip = vis.chart.append("rect")

    vis.trackingArea = vis.chart.append("rect")
      .attr('width', vis.width)
      .attr('height', vis.height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

    vis.title = vis.chart.append("text")
      .attr("x", (vis.width / 2))             
      .attr("y", 0 - (vis.config.margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .text(vis.config.title);

    vis.updateVis();                   
  }

 updateVis() { 
    let vis = this;
    vis.title.text(`${vis.data[0].county},${vis.data[0].state} - ${vis.config.title}`)
    let e1 = [];
    vis.config.yValues.forEach(element => { e1 = e1.concat(d3.extent(vis.data, (d) => d[element]))})
    vis.xScale = vis.xScale.domain(d3.extent(vis.data, vis.xValue))
    vis.yScale = vis.yScale.domain( d3.extent(e1) )

    vis.chart.selectAll("path").remove()
    vis.config.yValues.forEach((element, index) => {
        vis.chart.append('path')
            .data([vis.data])
            .transition().duration(800)
            .attr('stroke', vis.colorScale[index])
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('d', d3.line()
                .x((d) => vis.xScale(vis.xValue(d)))
                .y((d) => vis.yScale(d[element]))
              )
    });

    vis.bisectYear = d3.bisector(vis.xValue).left;

    vis.trackingArea.on('mousemove', function(event) {
      // See code snippets below
      let xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
      let year = vis.xScale.invert(xPos);

      // // Find nearest data point
      let index = vis.bisectYear(vis.data, year, 1);
      let a = vis.data[index - 1];
      let b = vis.data[index];
      let d = b && (year - a.year > b.year - year) ? b : a; 

      vis.tooltip
        .attr('x', vis.xScale(vis.xValue(d)))
        .attr('width', "2")
        .attr('y', 0)
        .attr('height', vis.height)
        .attr("fill", "#887D91")


      // // Update tooltip
      if (vis.config.yValues[0] == "max"){vis.chart1Tooltip(event, d)}
      if (vis.config.yValues[0] == "co"){vis.chart2Tooltip(event, d)}
      if (vis.config.yValues[0] == "no_data_days"){vis.chart3Tooltip(event, d)}
    })
    .on('mouseleave', () => {
      d3.select('#tooltip').style('display', 'none');
      vis.tooltip.attr('height', 0)
    });
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
 }

chart1Tooltip(event, d) { 
  d3.select('#tooltip')
  // show the event name, the event cost, the date.
    .style('display', 'block')
    .style('left', (event.pageX + 15) + 'px')   
    .style('top', (event.pageY + 15) + 'px')
    .html(`
    <div class="tooltip-title">${d.county}, ${d.state} - ${d.year}</div>
    <div><i>Max: ${d.max} AQI</i></div>
    <div><i>Median: ${d.median} AQI</i></div>
    <div><i>90th percentile: ${d.aqi90} AQI</i></div>
    `);
}

chart2Tooltip(event, d) { 
  d3.select('#tooltip')
  // show the event name, the event cost, the date.
    .style('display', 'block')
    .style('left', (event.pageX + 15) + 'px')   
    .style('top', (event.pageY + 15) + 'px')
    .html(`
    <div class="tooltip-title">${d.county}, ${d.state} - ${d.year}</div>
    <div><i>CO: ${d.co} Days</i></div>
    <div><i>NO2: ${d.no2} Days</i></div>
    <div><i>Ozone: ${d.ozone} Days</i></div>
    <div><i>SO2: ${d.so2} Days</i></div>
    <div><i>PM2.5: ${d.pm2_5} Days</i></div>
    <div><i>PM10: ${d.pm10} Days</i></div>
    `);
}

chart3Tooltip(event,d ) { 
  d3.select('#tooltip')
  // show the event name, the event cost, the date.
    .style('display', 'block')
    .style('left', (event.pageX + 15) + 'px')   
    .style('top', (event.pageY + 15) + 'px')
    .html(`
    <div class="tooltip-title">${d.county}, ${d.state} - ${d.year}</div>
    <div><i>No AQI data: ${d.no_data_days} AQI</i></div>
    `);
}



}