const MAX_WIDTH = Math.max(2000, window.innerWidth)//Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 2000//720;
const margin = {top: 40, right: 100, bottom: 40, left: 250};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 750//250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let graph_1 = d3.select("body")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

let countRef = graph_1.append("g");


d3.csv('../data/netflix.csv').then(function(data) {
	genre_count = {};

	for (var i = 0; i < data.length; i++){
		genres = data[i]["listed_in"].split(",")
		for (var j = 0; j < genres.length; j++) {
			genre = genres[j].trim()

			if (!(genre in genre_count)) {
				genre_count[genre] = 0
			}
			genre_count[genre] = genre_count[genre] + 1
		}
	}

	// Create items array
	var data = Object.keys(genre_count).map(function(key) {
	  return [key, genre_count[key]];
	});

	// Sort the array based on the second element
	data.sort(function(first, second) {
	  return second[1] - first[1];
	});

	NUM_EXAMPLES = data.length

	data = data.map(function(row) {return {genre: row[0], count: row[1]}})

	let x = d3.scaleLinear()
	    .domain([0, d3.max(data, function(d) {return d.count})])
		.range([0, graph_1_width - margin.left - margin.right]);

	let y = d3.scaleBand()
	    .domain(data.map(function(d){return d.genre}))		
	    .range([0, graph_1_height - margin.top - margin.bottom])
	    .padding(0.1);  // Improves readability

	graph_1.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));


	let bars = graph_1.selectAll("rect").data(data);
    
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["genre"] }))
	    .range(d3.quantize(d3.interpolateHcl("#b30000", "#ffb3b3"), NUM_EXAMPLES));

	console.log()

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['genre']);}) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", x(0))
        .attr("y", function(d) {return y(d['genre'])})//.attr("y", function(d) { return y(d['genre'])})
        .attr("width", function(d) {return x(d.count)})
        .attr("height",  y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

	let counts = countRef.selectAll("text").data(data);
        // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        // .attr("x", 100)       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        // .attr("x", function(d) { return x(d.count) + 20 })       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("x", function(d) { return x(parseInt(d.count))})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) { return y(d.genre) + 20 })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        // .attr("y", function(d) { return (d.artist + 20) })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d) { return d.count});           // HINT: Get the name of the artist


       // TODO: Add x-axis label
    graph_1.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right)/2}, ${graph_1_height - margin.bottom - margin.top + 15})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Count");

    graph_1.append("text")
        .attr("transform", `translate(-120, ${(graph_1_height - margin.bottom - margin.top)/ 2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Genre");

    // TODO: Add chart title
    graph_1.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right)/2}, -10)`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .style("font-weight", 600)
        .text("Top Netflix Genres");

})

let graph_2 = d3.select("body")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform


d3.csv('../data/netflix.csv').then(function(data) {
	year_mins_count = {};

	for (var i = 0; i < data.length; i++){
		medium = data[i]["type"].trim()
		if (medium != "Movie"){
			continue
		}

		year = parseInt(data[i]["release_year"].trim())
		if (!(year in year_mins_count)) {
			year_mins_count[year] = [0, 0]
		}
		mins = parseInt(data[i]["duration"].trim())
		year_mins_count[year][0] = year_mins_count[year][0] + mins
		year_mins_count[year][1] = year_mins_count[year][1] + 1
	}

	// Create items array
	var data = Object.keys(year_mins_count).map(function(key) {
	  return [key, year_mins_count[key][0] / year_mins_count[key][1]];
	});

	// // Sort the array based on the second element
	// data.sort(function(first, second) {
	//   return second[1] - first[1];
	// });



	data = data.map(function(row) {return {year: row[0], duration: row[1]}})

	NUM_EXAMPLES = data.length


	let x = d3.scaleLinear()
	    .domain([d3.min(data, function(d) {return d.year}), d3.max(data, function(d) {return d.year})])
		.range([0, graph_2_width - margin.left - margin.right]);

	graph_2.append("g")
        .call(d3.axisBottom(x).tickSize(0).tickPadding(10));


	let y = d3.scaleLinear()
	    .domain([0, d3.max(data, function(d){return d.duration})])		
	    .range([graph_2_height - margin.top - margin.bottom, 0])
	    //.padding(0.1);  // Improves readability

	graph_2.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));


    graph_2.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      //.attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.duration) })
        )

       // TODO: Add x-axis label
    graph_2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, ${graph_2_height - margin.bottom - margin.top + 15})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Release Year");

    graph_2.append("text")
        .attr("transform", `translate(-120, ${(graph_2_height - margin.bottom - margin.top)/ 2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Average Runtime (minutes)");

    // TODO: Add chart title
    graph_2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, -10)`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .style("font-weight", 600)
        .text("Average Runtime Per Year");

})


//--------------
let graph_3 = d3.select("body")
    .append("svg")
    .attr("width", graph_3_width)     // HINT: width
    .attr("height", graph_3_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

let countRef3 = graph_3.append("g");


d3.csv('../data/netflix.csv').then(function(data) {
	director_actor_count = {};

	for (var i = 0; i < data.length; i++){
		directors = data[i]["director"].trim().split(",")
		for (var d = 0; d < directors.length; d++){
			director = directors[d].trim()
			if (director === ""){
				continue
			}

			actors = data[i]["cast"].split(",")
			for (var j = 0; j < actors.length; j++) {
				actor = actors[j].trim()
				key = director + " starring " + actor
				if (!(key in director_actor_count)) {
					director_actor_count[key] = 0
				}
				director_actor_count[key] = director_actor_count[key] + 1
			}

		}

	}

	// Create items array
	var data = Object.keys(director_actor_count).map(function(key) {
	  return [key, director_actor_count[key]];
	});

	// Sort the array based on the second element
	data.sort(function(first, second) {
	  return second[1] - first[1];
	});



	NUM_EXAMPLES = 25
	data = data.slice(0,NUM_EXAMPLES)

	data = data.map(function(row) {return {da: row[0], count: row[1]}})

	let x = d3.scaleLinear()
	    .domain([0, d3.max(data, function(d) {return d.count})])
		.range([0, graph_3_width - margin.left - margin.right]);

	let y = d3.scaleBand()
	    .domain(data.map(function(d){return d.da}))		
	    .range([0, graph_3_height - margin.top - margin.bottom])
	    .padding(0.1);  // Improves readability

	graph_3.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));


	let bars = graph_3.selectAll("rect").data(data);
    
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["da"] }))
	    .range(d3.quantize(d3.interpolateHcl("#cc0000", "#ff99ff"), NUM_EXAMPLES));

	console.log()

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['da']);}) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", 25)//x(0))
        .attr("y", function(d) {return y(d['da'])})//.attr("y", function(d) { return y(d['genre'])})
        .attr("width", function(d) {return x(d.count)})
        .attr("height",  y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

	let counts = countRef3.selectAll("text").data(data);
        // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        // .attr("x", 100)       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        // .attr("x", function(d) { return x(d.count) + 20 })       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("x", function(d) { return x(parseInt(d.count)) + 25})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) { return y(d.da) + 20 })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        // .attr("y", function(d) { return (d.artist + 20) })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d) { return d.count});           // HINT: Get the name of the artist


       // TODO: Add x-axis label
    graph_3.append("text")
        .attr("transform", `translate(${(graph_3_width - margin.left - margin.right)/2}, ${graph_3_height - margin.bottom - margin.top + 15})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Number of collaborations");

    // graph_3.append("text")
    //     .attr("transform", `translate(-120, ${(graph_3_height - margin.bottom - margin.top)/ 2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
    //     .style("text-anchor", "middle")
    //     .text("pair");

    // TODO: Add chart title
    graph_3.append("text")
        .attr("transform", `translate(${(graph_3_width - margin.left - margin.right)/2}, -10)`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .style("font-weight", 600)
        .text("Top Director Actor Pairs");

})

