console.log("Hello world");

let line1, line2, line3, line4, line5, line6, bar1, bar2, bar3, bar4, map
let groupedData, groupedDataYear, data
Promise.all([
	d3.json('data/counties-10m.json'),
	d3.csv('data/processed_aqi.csv'),
]).then(data => {
	let geo = data[0]
	let aqi = data[1]
  	console.log('Data loading complete. Work with dataset.');

	  aqi.forEach(d => {
		// for (let i = 0; i < fips.length; i++) {
		// 	if (d.county == fips[i].county & d.state == fips[i].state) {
		// 		d.cnty_fips = +fips[i].fips
		// 		break
		// 	}
		// }
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

		d.condition_percent = d.condition_percent.split(',').map(Number),
		d.other_percent = d.other_percent.split(',').map(Number),
		d.no_data_days = +d.no_data_days
		// d.no_data_days = isLeapYear(d.year) ? 366-d.aqi_days : 365-d.aqi_days,

		// d.good_percent = d.good_days/d.aqi_days * 100,
		// d.moderate_percent = d.moderate_days/d.aqi_days * 100,
		// d.unhealthy_for_sensitive_percent = d.unhealthy_for_sensitive_days/d.aqi_days * 100,
		// d.unhealty_percent = d.unhealthy_days/d.aqi_days * 100,
		// d.very_unhealthy_percent = d.very_unhealthy_days/d.aqi_days * 100,
		// d.hazardous_percent = d.hazardous_days/d.aqi_days * 100,

		// d.conidtion_percent = [
		// 	d.good_days/d.aqi_days * 100,
		// 	d.moderate_days/d.aqi_days * 100,
		// 	d.unhealthy_for_sensitive_days/d.aqi_days * 100,
		// 	d.unhealthy_days/d.aqi_days * 100,
		// 	d.very_unhealthy_days/d.aqi_days * 100,
		// 	d.hazardous_days/d.aqi_days * 100,
		// ],

		// d.other_percent = [
		// 	d.co/d.aqi_days * 100,
		// 	d.no2/d.aqi_days  * 100,
		// 	d.ozone/d.aqi_days  * 100,
		// 	d.so2/d.aqi_days  * 100,
		// 	d.pm2_5/d.aqi_days * 100 ,
		// 	d.pm10/d.aqi_days * 100,
		// ]
		
	});

	groupedData = d3.group(aqi, d => d.state, d => d.county)
	groupedDataYear = d3.group(aqi, d => d.state, d => d.county, d => d.year)
	groupedFips = d3.group(aqi, d => d.fips, d => d.year)

	fips_keys = groupedFips.keys()
	keys = Array.from(fips_keys)

	geo.objects.counties.geometries.forEach(d => {
		keys.forEach(key =>{
			if (d.id == key.padStart(5, "0")) {
				d.properties.data = groupedFips.get(key);
			}
		}); 
	});
	
	stateButtonData(groupedData, ["1", "2"]);

	let countyA = d3.select("#countyButton1").property("value")
	let stateA = d3.select("#stateButton1").property("value")
	let countyB = d3.select("#countyButton2").property("value")
	let stateB = d3.select("#stateButton2").property("value")

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
		'title': 'Percent of Levels of Health Concern in',
		// 'containerWidth': 500,
		'y': 'condition_percent',
		'y_domain': [0, 100],
		'x': ['Good', 'Moderate', 'Sensitive', 'Unhealty', 'Very Unhealthy', 'Hazardous'],
	}, groupedDataYear.get("Ohio").get("Hamilton").get(2021), ["#238B45", "#FFFF00", "#FFA500", "#E31A1C", "#8F3F97", "#7E0023"]);

	bar2 = new Bar({
		'parentElement': '#bar2',
		'title': 'Percent of Major Pollutant in',
		// 'containerWidth': 300,
		'y': 'other_percent',
		'y_domain': [0, 100],
		'x': ['CO', 'NO2', 'Ozone', 'SO2', 'PM2.5', 'PM10'],
	}, groupedDataYear.get("Ohio").get("Hamilton").get(2021), ["#006c9e", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"]);

	line4 = new Line({
		'parentElement': '#line4',
		'title': 'AQI Percentile per Year',
		'yValues': ['max', 'aqi90', 'median'],
	}, groupedData.get(stateB).get(countyB), ["#00d8c3", "#009af6", "#0032d8"], line1);


	line5 = new Line({
		'parentElement': '#line5',
		'title': 'Major Pollutants per Year',
		'yValues': ['co', 'no2', 'ozone', 'so2', 'pm2_5', 'pm10'],
	}, groupedData.get(stateB).get(countyB), ["#003f5c", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"], line2);

	line6 = new Line({
		'parentElement': '#line6',
		'title': 'Days with no data per Year',
		'yValues': ['no_data_days'],
	}, groupedData.get(stateB).get(countyB), ["#0074C6"], line3);

	bar3 = new Bar({
		'parentElement': '#bar3',
		'title': 'Percent of Levels of Health Concern in',
		// 'containerWidth': 500,
		'y': 'condition_percent',
		'y_domain': [0, 100],
		'x': ['Good', 'Moderate', 'Sensitive', 'Unhealty', 'Very Unhealthy', 'Hazardous'],
	}, groupedDataYear.get(stateB).get(countyB).get(2021), ["#238B45", "#FFFF00", "#FFA500", "#E31A1C", "#8F3F97", "#7E0023"]);

	bar4 = new Bar({
		'parentElement': '#bar4',
		'title': 'Percent of Major Pollutant in',
		'y': 'other_percent',
		'y_domain': [0, 100],
		'x': ['CO', 'NO2', 'Ozone', 'SO2', 'PM2.5', 'PM10'],
	}, groupedDataYear.get(stateB).get(countyB).get(2021), ["#006c9e", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"]);

	line1.pair = line4
	line2.pair = line5
	line3.pair = line6
	line1.updateVis()
	line2.updateVis()
	line3.updateVis()

	map = new ChoroplethMap({
		'parentElement': '#map',
	}, geo, 'max', 1990, countyA, stateA, countyB, stateB)

	map.counties.on('click', (event,d) => {
		firstKey = Array.from(d.properties.data.keys())[0]
		values = d.properties.data.get(firstKey)[0]
		d3.select('#stateButton1').property('value', values.state);
		element = document.getElementById('stateButton1');
		event = new Event('change');
		element.dispatchEvent(event)
		d3.select('#countyButton1').property('value', values.county);
		element = document.getElementById('countyButton1');
		event = new Event('change');
		element.dispatchEvent(event)
	})
	map.counties.on('contextmenu', (event,d) => {
		firstKey = Array.from(d.properties.data.keys())[0]
		values = d.properties.data.get(firstKey)[0]
		d3.select('#stateButton2').property('value', values.state);
		element = document.getElementById('stateButton2');
		event = new Event('change');
		element.dispatchEvent(event)
		d3.select('#countyButton2').property('value', values.county);
		element = document.getElementById('countyButton2');
		event = new Event('change');
		element.dispatchEvent(event)
	})
	// console.log(d3.csvFormat(aqi))
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
	bar1.data =  (groupedDataYear.get(stateOption1).get(countyOption1).has(year)) ? groupedDataYear.get(stateOption1).get(countyOption1).get(year) : ""
	bar2.data = bar1.data
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
	bar3.data =  (groupedDataYear.get(stateOption2).get(countyOption2).has(year)) ? groupedDataYear.get(stateOption2).get(countyOption2).get(year) : ""
	bar4.data = bar3.data
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
	bar1.data = (groupedDataYear.get(stateOption1).get(countyOption1).has(val)) ?  groupedDataYear.get(stateOption1).get(countyOption1).get(val) : ""
	bar2.data = bar1.data
	bar1.updateVis();
	bar2.updateVis();
	bar3.data = (groupedDataYear.get(stateOption2).get(countyOption2).has(val)) ? groupedDataYear.get(stateOption2).get(countyOption2).get(val) : ""
	bar4.data = bar3.data
	bar3.updateVis();
	bar4.updateVis();
	map.year = val
	map.updateVis()
});

let gTime = d3
.select('div#slider-time')
.append('svg')
.attr('width', 700)
.attr('height', 75)
.append('g')
.attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

// from https://www.w3resource.com/javascript-exercises/javascript-date-exercise-14.php
function isLeapYear(year) {
	return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function stateButtonData(data, ids) {
	
	ids.forEach((id, index) => {
		if (id == "1") {value = "Ohio"} 
		else {value = "Alabama"}
		d3.select("#stateButton" + id)
			.selectAll('option')
			.data(data.keys())
			.enter()
			.append('option')
			.text( d => d) 
			.attr("value",  d => d) 
			.property("selected", function(d){if (id == "1") {return d === value;}});
		updatCountyData(id, value, data);
	})
	
}

function updatCountyData(id, value, data) {
	d3.select("#countyButton" + id).selectAll('option').remove()

	
	d3.select("#countyButton" + id).selectAll('option')
			.data(Array.from(data.get(value).keys()))
		.enter().append('option')
			.text(d => d)
			.attr("value", d => d) 
			.property("selected", function(d){ if (id == "1") {return d === "Hamilton";} return d === "Autauga"});
}

// FROM https://www.w3schools.com/howto/howto_js_dropdown.asp
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
	document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
	  var dropdowns = document.getElementsByClassName("dropdown-content");
	  var i;
	  for (i = 0; i < dropdowns.length; i++) {
		var openDropdown = dropdowns[i];
		if (openDropdown.classList.contains('show')) {
		  openDropdown.classList.remove('show');
		}
	  }
	}
  }