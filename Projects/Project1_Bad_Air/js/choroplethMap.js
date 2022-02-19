class ChoroplethMap {

  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _selector, _year, _countyA, _stateA,  _countyB, _stateB) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 500,
      margin: _config.margin || {top: 10, right: 10, bottom: 10, left: 10},
      tooltipPadding: 10,
      legendBottom: 50,
      legendLeft: 50,
      legendRectHeight: 12, 
      legendRectWidth: 150
    }
    this.data = _data;
    // this.config = _config;

    this.us = _data;
    this.selector = _selector
    this.year = _year
    this.countyA = _countyA
    this.stateA = _stateA
    this.countyB = _countyB
    this.stateB = _stateB

    this.active = d3.select(null);

    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('class', 'center-container')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    vis.svg.append('rect')
            .attr('class', 'background center-container')
            .attr('height', vis.config.containerWidth ) //height + margin.top + margin.bottom)
            .attr('width', vis.config.containerHeight) //width + margin.left + margin.right)
            .on('click', vis.clicked);

  
    vis.projection = d3.geoAlbersUsa()
            .translate([vis.width /2 , vis.height / 2])
            .scale(vis.width);

    vis.colorRage = {"max": ["#00ffe5", "#009c8d"], "median": ["#2c5dfd", "#0032d8"], "90": ["#79ceff", "#009af6"], "pollutant": ["#006c9e", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"]}

    vis.colorScale = d3.scaleLinear()
      .domain(d3.extent(vis.data.objects.counties.geometries, d => { 
        if (d.properties.data && d.properties.data.has(vis.year)) {
          return d.properties.data.get(vis.year)[0][vis.selector]
        }
      }))
        .range(vis.colorRage[vis.selector])
        .interpolate(d3.interpolateHcl);

    vis.path = d3.geoPath()
            .projection(vis.projection);

    vis.g = vis.svg.append("g")
            .attr('class', 'center-container center-items us-state')
            .attr('transform', 'translate('+vis.config.margin.left+','+vis.config.margin.top+')')
            .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)
            
    vis.updateVis()
  }

  updateVis(){
    let vis = this

    vis.counties = vis.g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(topojson.feature(vis.us, vis.us.objects.counties).features)
        .enter().append("path")
        .attr("d", vis.path)
        .attr("stroke", d => {
          if (d.properties.data && d.properties.data.has(vis.year)) {
            let val = d.properties.data.get(vis.year)[0]
            if (val.state == vis.stateA && val.county == vis.countyA){
              return "red"
            }
            else if (val.state == vis.stateB && val.county == vis.countyB){
              return "yellow"
            }else{             
              return "none"
            }}})
        .attr('fill', d => {
              if (d.properties.data && d.properties.data.has(vis.year)) {
                return vis.colorScale(d.properties.data.get(vis.year)[0][vis.selector]);
              } else {
                return 'url(#lightstripe)';
              }
            });

    vis.counties
        .on('mousemove', (event,d) => {
            let popDensity = (d.properties.data && d.properties.data.has(vis.year)) ? `<strong>${d.properties.data.get(vis.year)[0][vis.selector]}</strong> pop. density per km<sup>2</sup>` : 'No data available';
            d3.select('#tooltip')
              .style('display', 'block')
              .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
              .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
              .html(`
                <div class="tooltip-title">${d.properties.name}</div>
                <div>${popDensity}</div>
              `);
          })
          .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
          });



    vis.g.append("path")
        .datum(topojson.mesh(vis.us, vis.us.objects.states, function(a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", vis.path);
      }
}