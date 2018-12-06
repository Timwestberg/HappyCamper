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


  app.get("/api/nps/parkCode/:parkCode", function(req, res) {
    console.log(req.originalUrl);
    let parkToSearch =req.params.parkCode;
    request("http://api.nps.gov/api/v1/parks/?parkCode="+req.params.parkCode+"&fields=images&apiKey="+parks_api_key,
    (error, response, body) =>    {
        if(error || response.statusCode != 200){
            return console.log("Oops couldn't find the park");
        }
        var results = JSON.parse(body);
        res.send(results);

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

  app.get("/api/nps/stateCode/:stateCode", function(req, res) {
    console.log(req.originalUrl);
    let stateToSearch =req.params.stateCode
    request("http://api.nps.gov/api/v1/parks/?stateCode="+req.params.stateCode+"&fields=images&apiKey="+parks_api_key,
    (error, response, body) =>    {
        if(error || response.statusCode != 200){
            return console.log("Oops couldn't find the park");
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
        res.status(400).send("Got invalid review information")
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



