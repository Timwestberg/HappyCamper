/**
 *  This file contains code snippets for the API calls to 
 *  - NPS (National Park Service) 
 *  - OpenWeather
 */

/* Dependencies */
var request = require("request");
require('dotenv').config();

/* The National Park Service (NPS) API Key */
var parks_api_key = process.env.PARKS_API_KEY;

/**
 *  Functions 
 */

/**
 * @function park_lookup_by_code
 * @description This function looks up information on the specified national park.
 * @param {string} park_code 
 */
function park_lookup_by_code(park_code){

	/* Ensure that a valid park name was provided */
	if(!park_code){
		/* To Be Implemented : return error back to client */
		return console.log("Please specify a park name");
	}

	/* Construct the query URL retrieve information on the park */
	var query_url = "http://api.nps.gov/api/v1/parks/?parkCode=" + park_code;

	/* Append API Key to the query URL */
	query_url += ("&apiKey="+parks_api_key);

	/* Also ask for images of the park */
	query_url += "&fields=images";

	console.log("Query URL is " + query_url);

	request(query_url, function(error, response, body){

		var park_found = false;
		var park_info = {};
		

		if(error || response.statusCode != 200){
			return console.log("Oops couldn't find the park");
		}

		var results = JSON.parse(body);

		console.log(results.total + " matches found!\n");

		console.log(results);

		park_info = results.data[0];

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

/**
 * @function park_lookup_by_state
 * @description  This function looks up all the national parks in the specified state.
 * @param {string} state_code
 */
function park_lookup_by_state(state_code){
	if(!state_code || typeof(state_code) !== "string" || state_code.length !== 2){
		/* return error */
		return console.log("Please enter a valid state");
	}

	/* Construct the query URL retrieve information on parks by state */
	var query_url = "http://api.nps.gov/api/v1/parks/?stateCode=" + state_code;

	/* Also ask for images of the park */
	query_url += "&fields=images";

	/* Limit the number of results to 3 */
	query_url += "&limit=3";

	/* Append API Key to the query URL */
	query_url += ("&apiKey="+parks_api_key);

	console.log("Query URL is " + query_url);

	request(query_url, function(error, response, body){

		var park_found = false;
		var park_info = {};
		

		if(error || response.statusCode != 200){
			return console.log("Oops couldn't find the park");
		}

		var results = JSON.parse(body);

		console.log(results.total + " matches found!\n");

		console.log(results);

		park_info = results.data[0];

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

/* Test the 'lookup by park code' function by  looking up Denali (DENA) */
park_lookup_by_code("DENA");

/* Test the 'lookup by state' function by looking up parks in Minnesote (MN) */
park_lookup_by_state("MN");

module.exports = {
	state_lookup : park_lookup_by_state,
	parkid_lookup : park_lookup_by_code
}
