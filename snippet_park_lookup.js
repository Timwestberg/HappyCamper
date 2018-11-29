/**
 *  This file contains code snippets for the API calls to 
 *  - NPS (National Park Service) 
 *  - OpenWeather
 * 
 */

/* Dependencies */
var request = require("request");
require('dotenv').config();

/* The National Park Service (NPS) API Key */
var parks_api_key = process.env.PARKS_API_KEY;
//console.log("The NPS API Key is " + parks_api_key);

/**
 *  Functions 
 */

/**
 * @function park_lookup_by_name
 * @description This function looks up information on the specified national park.
 * @param {string} park_name 
 */
function park_lookup_by_name(park_name){

	/* Ensure that a valid park name was provided */
	if(!park_name){
		/* To Be Implemented : return error back to client */
		return console.log("Please specify a park name");
	}

	/* Construct the query URL retrieve information on the park */
	var query_url = "http://api.nps.gov/api/v1/parks/?q=" + park_name;

	/* Append API Key to the query URL */
	query_url += ("&apiKey="+parks_api_key);

	/* Limit the number of results to 3. We expect to receive only one match, however the 
	   'q' parameter ends up returning multiple matches */
	query_url += "&limit=3";

	console.log("Query URL is " + query_url);

	request(query_url, function(error, response, body){

		var park_found = false;
		var park_info = {};
		

		if(error || response.statusCode != 200){
			return console.log("Oops couldn't find the park");
		}

		var results = JSON.parse(body);

		console.log(results.total + " matches found!\n");

		for(let i = 0; i < results.total; i++){
			let currentPark = results.data[i];

			console.log("each result has the following keys");

			console.log(Object.keys(currentPark));

			if(currentPark.fullName.includes(park_name)){
				console.log("\n FOUND THE PARK, HERE ARE ITS DETAILS");
				park_found = true;
				park_info = currentPark;
				console.log(currentPark);
				break;
			}
		}

		/* If the specified park wasn't found, return an error to the client */
		if(!park_found){
			/* TBD : Return error to client */
			return console.log("Couldn't find the specified park");
		}

		/* The specified national park was found. Retrieve its co-ordinates to perform 
			 a weather lookup */
		console.log(park_info.latLong);
		let coordinates = park_info.latLong.match(/[+-]?\d+(\.\d+)?/g).map(Number);
		console.log(coordinates);
		let latitude = coordinates[0];
		let longitude = coordinates[1];

		console.log("*** Park co-ordinates are ***");
		console.log("Latitude : " + latitude + " and Longitude : " + longitude);

	});
}

/* Test it by looking up 'Denali' */
park_lookup_by_name("Denali");
