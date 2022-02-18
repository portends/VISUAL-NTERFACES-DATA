console.log("Hello world");

let line1, line2, line3, line4, line5, line6, bar1, bar2, bar3, bar4
let groupedData, groupedDataYear, data

d3.csv('data/annual_aqi_by_county_1980_2021.csv')
  .then(data => {
  	console.log('Data loading complete. Work with dataset.');

	data.forEach(d => {
		d.year = +d.year,
		d.aqi_days = +d.aqi_days,
		d.good_days = +d.good_days,
		d.moderate_days = +d.moderate_days,
		d.unhealthy_for_sensitive_days = +d.unhealthy_for_sensitive_days,
		d.unhealthy_days = +d.unhealthy_days,
		d.very_unhealthy_days = +d.very_unhealthy_days,
		d.hazardous_days = +d.hazardous_days,
		d.max = +d.max,
		d.aqi90 = +d.aqi90,
		d.median = +d.median,
		d.co = +d.co,
		d.no2 = +d.no2,
		d.ozone = +d.ozone,
		d.so2 = +d.so2,
		d.pm2_5 = +d.pm2_5,
		d.pm10 = +d.pm10,
		d.no_data_days = isLeapYear(d.year) ? 366-d.aqi_days : 365-d.aqi_days,

		d.good_percent = d.good_days/d.aqi_days * 100,
		d.moderate_percent = d.moderate_days/d.aqi_days * 100,
		d.unhealthy_for_sensitive_percent = d.unhealthy_for_sensitive_days/d.aqi_days * 100,
		d.unhealty_percent = d.unhealthy_days/d.aqi_days * 100,
		d.very_unhealthy_percent = d.very_unhealthy_days/d.aqi_days * 100,
		d.hazardous_percent = d.hazardous_days/d.aqi_days * 100,

		d.co_percent = d.co/d.aqi_days * 100,
		d.no2_percent = d.no2/d.aqi_days  * 100,
		d.ozone_percent = d.ozone/d.aqi_days  * 100,
		d.so2_percent = d.so2/d.aqi_days  * 100,
		d.pm2_5_percent = d.pm2_5/d.aqi_days * 100 ,
		d.pm10_percent = d.pm10/d.aqi_days * 100,

		d.conidtion_percent = [d.good_percent, d.moderate_percent, d.unhealthy_for_sensitive_percent, d.unhealty_percent, d.very_unhealthy_percent, d.hazardous_percent]
		d.other_percent = [d.co_percent, d.no2_percent, d.ozone_percent, d.so2_percent, d.pm2_5_percent, d.pm10_percent ]
	});

	groupedData = d3.group(data, d => d.state, d => d.county)
	groupedDataYear = d3.group(data, d => d.state, d => d.county, d => d.year)

	
	stateButtonData(groupedData, ["1", "2"]);

	line1 = new Line({
		'parentElement': '#line1',
		'title': 'AQI Percentile per Year',
		'yValues': ['max', 'aqi90', 'median'],
	}, groupedData.get("Ohio").get("Hamilton"), ["#00d8c3", "#009af6", "#0032d8"]);

	line2 = new Line({
		'parentElement': '#line2',
		'title': 'Major Pollutants per Year',
		'yValues': ['co', 'no2', 'ozone', 'so2', 'pm2_5', 'pm10'],
	}, groupedData.get("Ohio").get("Hamilton"), ["#003f5c", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"]);

	line3 = new Line({
		'parentElement': '#line3',
		'title': 'Days with no data per Year',
		'yValues': ['no_data_days'],
		// 'y': 'no_data_days',
		// 'y_domain': [0, 366],
		// 'x': 'year',
	}, groupedData.get("Ohio").get("Hamilton"), ["#0074C6"]);

	bar1 = new Bar({
		'parentElement': '#bar1',
		'containerWidth': 725,
		'y': 'conidtion_percent',
		'y_domain': [0, 100],
		'x': ['Good', 'Moderate', 'Unhealthy for Sensitive', 'Unhealty', 'Very Unhealthy', 'Hazardous'],
	}, groupedDataYear.get("Ohio").get("Hamilton").get(2021), ["#238B45", "#FFFF00", "#FFA500", "#E31A1C", "#8F3F97", "#7E0023"]);

	bar2 = new Bar({
		'parentElement': '#bar2',
		'y': 'other_percent',
		'y_domain': [0, 100],
		'x': ['CO', 'NO2', 'Ozone', 'SO2', 'PM2.5', 'PM10'],
	}, groupedDataYear.get("Ohio").get("Hamilton").get(2021), ["#006c9e", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"]);

	line4 = new Line({
		'parentElement': '#line4',
		'title': 'AQI Percentile per Year',
		'yValues': ['max', 'aqi90', 'median'],
	}, groupedData.get("Ohio").get("Hamilton"), ["#00d8c3", "#009af6", "#0032d8"]);

	line5 = new Line({
		'parentElement': '#line5',
		'title': 'Major Pollutants per Year',
		'yValues': ['co', 'no2', 'ozone', 'so2', 'pm2_5', 'pm10'],
	}, groupedData.get("Ohio").get("Hamilton"), ["#003f5c", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"]);

	line6 = new Line({
		'parentElement': '#line6',
		'title': 'Days with no data per Year',
		'yValues': ['no_data_days'],
	}, groupedData.get("Ohio").get("Hamilton"), ["#0074C6"]);

	bar3 = new Bar({
		'parentElement': '#bar3',
		'containerWidth': 725,
		'y': 'conidtion_percent',
		'y_domain': [0, 100],
		'x': ['Good', 'Moderate', 'Unhealthy for Sensitive', 'Unhealty', 'Very Unhealthy', 'Hazardous'],
	}, groupedDataYear.get("Ohio").get("Hamilton").get(2021), ["#238B45", "#FFFF00", "#FFA500", "#E31A1C", "#8F3F97", "#7E0023"]);

	bar4 = new Bar({
		'parentElement': '#bar4',
		'y': 'other_percent',
		'y_domain': [0, 100],
		'x': ['CO', 'NO2', 'Ozone', 'SO2', 'PM2.5', 'PM10'],
	}, groupedDataYear.get("Ohio").get("Hamilton").get(2021), ["#006c9e", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"]);

	// let map = new ChoroplethMap({
	// 	'parentElement': '#map',
	// }, data)

})
.catch(error => {
    console.error('Error loading the data');
	console.error(error);
});

d3.select("#stateButton1").on("change", function(d) {
	let selectedOption = d3.select(this).property("value")
	updatCountyData("1", selectedOption, groupedData)
})

d3.select("#stateButton2").on("change", function(d) {
	let selectedOption = d3.select(this).property("value")
	updatCountyData("2", selectedOption, groupedData)
})

d3.select("#countyButton1").on("change", function(d) {
	let stateOption1 = d3.select("#stateButton1").property("value");
	let countyOption1 = d3.select(this).property("value");
	let year = d3.select(".slider text").text()

	line1.data = groupedData.get(stateOption1).get(countyOption1);
	line2.data = line1.data
	line3.data = line1.data
	if (groupedDataYear.get(stateOption1).get(countyOption1).has(year)){
		bar1.data = groupedDataYear.get(stateOption1).get(countyOption1).get(year)
		bar2.data = bar1.data
	}
	line1.updateVis();
	line2.updateVis();
	line3.updateVis();
	bar1.updateVis();
	bar2.updateVis();
})

d3.select("#countyButton2").on("change", function(d) {
	let stateOption2 = d3.select("#stateButton2").property("value");
	let countyOption2 = d3.select(this).property("value");
	let year = d3.select(".slider text").text()

	line4.data = groupedData.get(stateOption2).get(countyOption2);
	line5.data = line4.data
	line6.data = line4.data
	if (groupedDataYear.get(stateOption2).get(countyOption2).has(year)){
		bar3.data = groupedDataYear.get(stateOption2).get(countyOption2).get(year)
		bar4.data = bar3.data
	}
	line4.updateVis();
	line5.updateVis();
	line6.updateVis();
	bar3.updateVis();
	bar4.updateVis();
})

let sliderTime = d3
.sliderBottom()
.min(1980)
.max(2021)
.step(1)
.width(600)
.tickFormat(d3.format("d"))
.default(2021)
.on('onchange', val => {
	d3.select('p#value-time').text(d3.format("d")(val));
	// check if county has year
	let stateOption1 = d3.select("#stateButton1").property("value");
	let countyOption1 = d3.select("#countyButton1").property("value");
	let stateOption2 = d3.select("#stateButton2").property("value");
	let countyOption2 = d3.select("#countyButton2").property("value");

	if (groupedDataYear.get(stateOption1).get(countyOption1).has(val)){
		bar1.data = groupedDataYear.get(stateOption1).get(countyOption1).get(val)
		bar2.data = bar1.data
		bar1.updateVis();
		bar2.updateVis();
	}
	if (groupedDataYear.get(stateOption2).get(countyOption2).has(val)){
		bar3.data = groupedDataYear.get(stateOption2).get(countyOption2).get(val)
		bar4.data = bar3.data
		bar3.updateVis();
		bar4.updateVis();
	}
});

let gTime = d3
.select('div#slider-time')
.append('svg')
.attr('width', 700)
.attr('height', 100)
.append('g')
.attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

line1.trackingArea.on("mouseover", function(event) {
	let xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
	let year = line4.xScale.invert(xPos);

	// // Find nearest data point
	let index = line4.bisectYear(line4.data, year, 1);
	let a = line4.data[index - 1];
	let b = line4.data[index];
	let d = b && (year - a.year > b.year - year) ? b : a; 

	line4.tooltip
	  .attr('x', line4.xScale(line4.xValue(d)))
	  .attr('width', "2")
	  .attr('y', 0)
	  .attr('height', line4.height)
	  .attr("fill", "#887D91")

})
// from https://www.w3resource.com/javascript-exercises/javascript-date-exercise-14.php
function isLeapYear(year) {
	return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function stateButtonData(data, ids) {
	ids.forEach((id, index) => {
		d3.select("#stateButton" + id)
			.selectAll('option')
			.data(data.keys())
			.enter()
			.append('option')
			.text(function (d) { return d; }) 
			.attr("value", function (d) { return d; }) ;
		updatCountyData(id, "Alabama", data);
	})
	
}

function updatCountyData(id, value, data) {
	d3.select("#countyButton" + id).selectAll('option').remove()

	
	d3.select("#countyButton" + id).selectAll('option')
			.data(Array.from(data.get(value).keys()))
		.enter().append('option')
			.text(d => d)
			.attr("value", d => d) 
}