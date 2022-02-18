class Bar {

    constructor(_config, _data, _colorScale) {
      this.config = {
        parentElement: _config.parentElement,
        y: _config.y,
        y_domain: _config.y_domain,
        x: _config.x,
        containerWidth: _config.containerWidth || 350,
        containerHeight: _config.containerHeight || 175,
        margin: { top: 10, bottom: 30, right: 50, left: 50 }
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
  
  
      //setup scales
      if (typeof(vis.config.x) == 'string'){
        vis.xScale = d3.scaleBand()
            .domain( vis.data.map(d => d[vis.config.x]))
            .range([0, vis.width]);
      }else{
        vis.xScale = d3.scaleBand()
            .domain( vis.config.x)
            .range([0, vis.width]); 
      }
  
      vis.yScale = d3.scaleLinear()
          .domain( vis.config.y_domain )
          .range([vis.height, 0])
          .nice(); //this just makes the y axes behave nicely by rounding up
  
      // // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale).tickFormat((d, i) => vis.config.x[i]);
      vis.yAxis = d3.axisLeft(vis.yScale).tickSize(-vis.width).tickPadding(10);
  
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
  
      vis.updateVis();           
    }
  
   updateVis() { 
        let vis = this;
        vis.chart.selectAll("rect").remove()

        vis.bisectYear = d3.bisector(d => d[vis.config.x]).left;

        vis.config.x.forEach((element, index) => {
          vis.chart.append('rect').data(vis.data)
              .attr('x', (d,i) => vis.xScale(vis.config.x[index]))
              .attr('class', "rect" + index)
              .attr('width', vis.xScale.bandwidth())
              .attr('y', (d,i) => vis.yScale(0))
              .attr('height', (d,i) => vis.height-vis.yScale(0))
              .attr("fill", vis.colorScale[index])
              .on('mouseenter', function(event) {
                // See code snippets below
                let xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
                let year = vis.xScale(xPos);

                // Find nearest data point
                let index = vis.bisectYear(vis.data, year, 1);
                let a = vis.data[index - 1];
                let b = vis.data[index];
                let d = b && (year - a.year > b.year - year) ? b : a; 

                let xIndex = vis.xScale(vis.config.x[1])
                let i = Math.floor(xPos/xIndex)

                // Update tooltip
                d3.select('#tooltip')
                // show the event name, the event cost, the date.
                  .style('display', 'block')
                  .style('left', (event.pageX + 15) + 'px')   
                  .style('top', (event.pageY + 15) + 'px')
                  .html(`
                  <div class="tooltip-title">${d.county}, ${d.state}</div>
                  <div><i>${vis.config.x[i]}: ${d[vis.config.y][i].toFixed(2)} %</i></div>
                  `);
              })
              .on('mouseleave', () => {
                d3.select('#tooltip').style('display', 'none');
              })

          vis.chart.selectAll(`.rect${index}`).transition().duration(800)
            .attr('y', (d,i) => vis.yScale(d[vis.config.y][index]))
            .attr('height', (d,i) => vis.height - vis.yScale(d[vis.config.y][index]))
        })
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
      // }
   }
  
  
   //leave this empty for now...
   renderVis() { 
  
    }
  
  
  
  }