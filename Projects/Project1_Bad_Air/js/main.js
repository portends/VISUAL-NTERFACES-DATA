console.log("Hello world");

d3.json('data/annual_aqi_by_county_1980_2021.json')
  .then(data => {
  	console.log('Data loading complete. Work with dataset.');
    console.log(data);

	data.forEach(d => {
		d.year = +d["Year"]; 
		d.aqi_days = +d["Days with AQI"];
		d.good_days = +d["Good Days"];
		d.moderate_days = +d["Moderate Days"]; 
		d.unhealthy_for_sensitive_days = +d["Unhealthy for Sensitive Groups Days"]; 
		d.unhealty_days = +d["Unhealthy Days"];
		d.very_unhealthy_days = +d["Very Unhealthy Days"];
		d.hazardous_days = +d["Hazardous Days"];
		d.max = +d["Max AQI"];
		d.aqi90 = +d["90th Percentile AQI"];
		d.median = +d["Median AQI"];
		d.co = +d["Days CO"];
		d.no2 = +d["Days NO2"];
		d.ozone = +d["Days Ozone"];
		d.so2 = +d["Days SO2"];
		d.pm2_5 = +d["Days PM2.5"];
		d.pm10 = +d["Days PM10"];
	});


  	// // Create an instance (for example in main.js)
	// 	let timelineCircles = new TimelineCircles({
	// 		'parentElement': '#timeline',
	// 		'containerHeight': 1100,
	// 		'containerWidth': 1000
	// 	}, data);


	// 	//TO DO:  Make a line chart object.  Make it 200 pixels tall by 1000 pixels wide. 
	// 	//Be sure to send it the costsPerYear data 
	// 	// The svg for this element has already been created in index.html, above the timeline circles- check it out
		let line = new Line({
			'parentElement': '#line',
			'containerHeight': 300,
			'containerWidth': 1000
		}, data);

})
.catch(error => {
    console.error('Error loading the data');
});