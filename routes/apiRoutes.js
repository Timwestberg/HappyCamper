var db = require("../models");

/* Dependencies */
var request = require("request");
require('dotenv').config();

/* The National Park Service (NPS) API Key */
var parks_api_key = process.env.PARKS_API_KEY;

module.exports = function(app) {

  /**
   * Route that handles park information lookup by park code
   *
   */

  app.post("/api/parkCode", function(req,res){

  });

  app.post("/api/stateCode", function(req,res){

  });

  app.get("/api/getParkByCode/:code", function(req, res) {
    let parkToSearch = req.params.code;

    console.log("Got a park lookup request, the park code is " + parkToSearch);

    /* Parameter validation */
    if(!parkToSearch || typeof(parkToSearch) !== "string" || parkToSearch.length !== 4){
      res.status(404).send("Oops - bad park code passed in");
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

      var parkInfo = {};

      if(error || response.statusCode != 200){
        res.status(404).send("NPS API lookup failed!");
      }

      var results = JSON.parse(body);

      console.log(results.total + " matches found!\n");

      // onsole.log(results);

      /* Construct the park information object that we'll send back to the client */
      parkInfo.parkName = results.data[0].fullName;
      parkInfo.parkDescription = results.data[0].description;
      parkInfo.parkImages = results.data[0].images;
      parkInfo.parkStates = results.data[0].states;

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

        res.send(parkInfo);

      });
    });

  });

  /**
   * Route that handles park information lookup by state
   *
   */
  app.get("/api/getParkByState/:code", function(req, res) {
    let stateToSearch = req.params.code;

    console.log("Got a park lookup request by state, the state code is " + stateToSearch);

    /* Parameter validation */
    if(!stateToSearch || typeof(stateToSearch) !== "string" || stateToSearch.length !== 2){
      res.status(404).send("Oops - bad state code passed in");
    }

    /* Valid state code provided. Do a lookup using the NPS API */
    /* Construct the query URL retrieve information on the park */
    var queryUrl = "http://api.nps.gov/api/v1/parks/?stateCode=" + stateToSearch;

    /* Append API Key to the query URL */
    queryUrl += ("&apiKey="+parks_api_key);

    /* Also ask for images of the park */
    queryUrl += "&fields=images";

    /* For now, lets limit the number of results to 5 */
    queryUrl += "&limit=3";

    console.log("Query URL is " + queryUrl);

    request(queryUrl, function(error, response, body){

      var parksList = [];

      if(error || response.statusCode != 200){
        res.status(404).send("NPS API lookup failed!");
      }

      var results = JSON.parse(body);

      for(let i = 0; i < results.data.length; i++){

        let parkInfo = {};

        console.log(results.data[i]);

        /* Construct the park information object that we'll send back to the client */
        parkInfo.parkName = results.data[i].fullName;
        parkInfo.parkDescription = results.data[i].description;
        parkInfo.parkImages = results.data[i].images;
        parkInfo.parkStates = results.data[i].states;

        // TBD: additional fields to show in the expanded window
        
        parksList.push(parkInfo);

        //console.log("*** Park co-ordinates are ***");
        //console.log("Latitude : " + latitude + " and Longitude : " + longitude);
      }

      /* Also, update the stateSearches database */
      db.StateSearches.findAll({
        where: {
          stateCode:stateToSearch
        }
      }).then(function(searchResults){
        console.log("Searched for state code " + stateToSearch + 
        "Here are the search results");

        if(0 === searchResults.length){
          // Park code has not been searched before. Add it to parkSearches
          console.log("State doesn't exist in searches, adding it");
          db.StateSearches.create({
            stateCode: stateToSearch,
          }).then(function(newlyAddedSearch){
            if(!newlyAddedSearch){
              console.log("Unexpected Error, update seems to have failed");
            }
          });
        }else{
          // Park code has already been searched before. Update its hitCount.
          console.log("State already exists in database, updating its hit-count");
          
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
        res.send(parksList);
      });
    });

  });


  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
