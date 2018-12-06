var db = require("../models");

/* Dependencies */
var request = require("request");
require('dotenv').config();

/* The National Park Service (NPS) API Key */
var parks_api_key = process.env.PARKS_API_KEY;

module.exports = function(app) {

  /**
   * GET method that handles park information lookup by park code
   */
  app.get("/api/getParkByCode/:code", function(req, res) {
    let parkToSearch = req.params.code;

    console.log("Got a park lookup request, the park code is " + parkToSearch);

    /* Parameter validation */
    if(!parkToSearch || typeof(parkToSearch) !== "string" || parkToSearch.length !== 4){
      res.status(500).send("Oops - bad park code passed in");
    }

    /* Valid park code provided. Do a lookup using the NPS API */
    /* Construct the query URL retrieve information on the park */
    var queryUrl = "http://api.nps.gov/api/v1/parks/?parkCode=" + parkToSearch;

    /* Append API Key to the query URL */
    queryUrl += ("&apiKey="+parks_api_key);

    /* Also ask for images of the park */
    queryUrl += "&fields=images";

    console.log("Query URL is " + queryUrl);

    request(queryUrl, function(error, response, body){

      if(error || response.statusCode != 200){
        res.status(500).send("NPS API lookup failed!");
      }

      var results = JSON.parse(body);

      console.log(results.total + " matches found!\n");

      // onsole.log(results);

      /* The specified national park was found. Retrieve its co-ordinates to perform 
        a weather lookup */
      let coordinates = results.data[0].latLong.match(/[+-]?\d+(\.\d+)?/g).map(Number);
      console.log(coordinates);
      let latitude = coordinates[0];
      let longitude = coordinates[1];

      console.log("*** Park co-ordinates are ***");
      console.log("Latitude : " + latitude + " and Longitude : " + longitude);

      /* Also, update the parkSearches database */
      db.ParkSearches.findAll({
        where: {
          parkCode: parkToSearch
        }
      }).then(function(searchResults){
        console.log("Searched for park code " + parkToSearch + 
        "Here are the search results");

        if(0 === searchResults.length){
          // Park code has not been searched before. Add it to parkSearches
          console.log("Park doesn't exist in searches, adding it");
          db.ParkSearches.create({
            parkCode: parkToSearch,
            states: parkInfo.parkStates
          }).then(function(newlyAddedSearch){
            if(!newlyAddedSearch){
              console.log("Unexpected Error, update seems to have failed");
            }
          });
        }else{
          // Park code has already been searched before. Update its hitCount.
          console.log("Park already exists in database, updating its hit-count");
          
          db.ParkSearches.increment('hitCount' , { 
            where: {
              parkCode: parkToSearch
            }
          }).then(function(updatedRow){
            if(!updatedRow){
              console.log("Unexpected Error, update seems to have failed");
            }
          });
        }

        res.send(results);

      });
    });

  });

   /**
   * GET method that handles park information lookup by state
   */
  app.get("/api/getParkByState/:code", function(req, res) {
    let stateToSearch = req.params.code;

    console.log("Got a park lookup request by state, the state code is " + stateToSearch);

    /* Parameter validation */
    if(!stateToSearch || typeof(stateToSearch) !== "string" || stateToSearch.length !== 2){
      res.status(500).send("Oops - bad state code passed in");
    }

    /* Valid state code provided. Do a lookup using the NPS API */
    /* Construct the query URL retrieve information on the park */
    var queryUrl = "http://api.nps.gov/api/v1/parks/?stateCode=" + stateToSearch;

    /* Append API Key to the query URL */
    queryUrl += ("&apiKey="+parks_api_key);

    /* Also ask for images of the park */
    queryUrl += "&fields=images";

    /* Don't limit the results */
    /* queryUrl += "&limit=3"; */

    console.log("Query URL is " + queryUrl);

    request(queryUrl, function(error, response, body){

      if(error || response.statusCode != 200){
        res.status(500).send("NPS API lookup failed!");
      }

      var results = JSON.parse(body);

      /* Update the stateSearches database */
      db.StateSearches.findAll({
        where: {
          stateCode:stateToSearch
        }
      }).then(function(searchResults){
        console.log("Searched for state code " + stateToSearch + 
        "Here are the search results");

        if(0 === searchResults.length){
          // Park code has not been searched before. Add it to parkSearches
          //console.log("State doesn't exist in searches, adding it");
          db.StateSearches.create({
            stateCode: stateToSearch,
          }).then(function(newlyAddedSearch){
            if(!newlyAddedSearch){
              console.log("Unexpected Error, update seems to have failed");
            }
          });
        }else{
          // Park code has already been searched before. Update its hitCount.
          // console.log("State already exists in database, updating its hit-count");
          
          db.StateSearches.increment('hitCount' , { 
            where: {
              stateCode: stateToSearch
            }
          }).then(function(updatedRow){
            if(!updatedRow){
              console.log("Unexpected Error, update seems to have failed");
            }
          });
        }
        /* Send back the results object */
        res.send(results);
      });
    });

  });

  /**
   * POST method that adds a user review about a park 
   * to the ParkReviews database.
   */
  app.post("/api/review", function(req, res){

    // Validate parameters
    if(!req.body || !req.body.review) {
        // Throw an error
        res.status(500).send("Got invalid review information")
    }

    // Add the review ton the database
    // the fields are
    // parkCode, rating, reviewText 
    db.ParkReviews.create({
      reviewer:req.body.name,
      rating: req.body.rating,
      reviewText: req.body.text,
      parkCode:req.body.parkCode
    })
      .then(function(dbPost) {
        res.json(dbPost);
      });

  });
};



