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
		d.pm10 = +d.pm10
	});

	let groupedData = d3.group(data, d => d.state, d => d.county)
	let groupedDataV1 = d3.group(groupedData.get("Ohio").get("Hamilton"), d => d.year)

	let line = new Line({
		'parentElement': '#line',
		'containerHeight': 300,
		'containerWidth': 1000
	}, groupedData.get("Ohio").get("Hamilton"));

})
.catch(error => {
    console.error('Error loading the data');
	console.error(error);
});