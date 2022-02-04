console.log("Hello world");

d3.json('data/annual_aqi_by_county_1980_2021.json')
  .then(data => {
  	console.log('Data loading complete. Work with dataset.');
    console.log(data);

	data.forEach(d => {
		d.year = +d.year,
		d.aqi_days = +d.aqi_days,
		d.good_days = +d.good_days,
		d.moderate_days = +d.moderate_days,
		d.unhealthy_for_sensitive_days = +d.unhealthy_for_sensitive_days,
		d.unhealty_days = +d.unhealty_days,
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
		d.no_data_days = isLeapYear(d.year) ? 366-d.aqi_days : 365-d.aqi_days
	});

	let groupedData = d3.group(data, d => d.state, d => d.county)

	let line = new Line({
		'parentElement': '#line',
		'yValues': ['max', 'aqi90', 'median'],
		'containerHeight': 300,
		'containerWidth': 1000
	}, groupedData.get("Ohio").get("Hamilton"));

	let line2 = new Line({
		'parentElement': '#line2',
		'yValues': ['co', 'no2', 'ozone', 'so2', 'pm2_5', 'pm10'],
		'containerHeight': 300,
		'containerWidth': 1000
	}, groupedData.get("Ohio").get("Hamilton"));

	let line3 = new Line({
		'parentElement': '#line3',
		'yValues': ['no_data_days'],
		'containerHeight': 300,
		'containerWidth': 1000
	}, groupedData.get("Ohio").get("Hamilton"));

})
.catch(error => {
    console.error('Error loading the data');
	console.error(error);
});

// from https://www.w3resource.com/javascript-exercises/javascript-date-exercise-14.php
function isLeapYear(year) {
	return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}