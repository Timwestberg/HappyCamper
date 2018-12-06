var db = require("../models");

var path = require("path");

const fetch = require('node-fetch');

/* The National Park Service (NPS) API Key */
var parks_api_key = process.env.PARKS_API_KEY;

/**
 * @function getParkInfo
 * @description this function performs an API lookup on the NPS API (National Parks Service)
 * It retrieves park information (name, images, description) and returns this in an object.
 *
const getParkInfo = async url => {
  try {
    
    return json;
  } catch (error) {
    console.log(error);
  }
};*/

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    
    /* When the page loads, display the most popular parks that aree searched.
      To do this, we first look up our 'parkSearches' table. This will give us 
      the popular park codes

      We use the park codes to query NPS for the park data - name, images,
      and build an array of objects that is fed to handlebars *

    /*Step 1: Look up the parkSearches table */
    db.ParkSearches.findAll({
      order:[ 
        ['hitCount','DESC'] 
      ]}).then(async function(popularParks){
    
      /* Step 2 : for each popular park code, get its info from the NPS API */
      let parkInfoArray = [];

      popularParks.forEach(async (currentPark) => {
        //console.log("*** ITERATION ****");
        
        /* Construct the query URL retrieve information on the park */
        var queryUrl = "http://api.nps.gov/api/v1/parks/?parkCode=" + currentPark.parkCode;

        /* Append API Key to the query URL */
        queryUrl += ("&apiKey="+parks_api_key);

        /* Also ask for images of the park */
        queryUrl += "&fields=images";

        //console.log("Query URL is " + queryUrl);

        const response = await fetch(queryUrl);
        const json = await response.json();

        /* Construct the park information object that we'll push to the array */
        let parkInfo = {};
        parkInfo.parkName = json.data[0].fullName;
        parkInfo.parkDescription = json.data[0].description;
        parkInfo.parkImages = json.data[0].images;
        parkInfo.parkStates = json.data[0].states;
        //console.log("\n\n Here's the park data");
        //console.log(parkInfo);
        parkInfoArray.push(parkInfo);
      });

      /* Array is ready. Use it to populate handlebars */

    });
 
    const pageObject = {
      style:"camperMain",
      jsFile:"landPage"
    };
    console.log(pageObject);
    
    res.render("index", pageObject);
    // res.sendFile(path.join(__dirname, "../public/landPage.html"));
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
