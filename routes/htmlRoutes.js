var db = require("../models");

var path = require("path");

const fetch = require('node-fetch');

/* The National Park Service (NPS) API Key */
var parks_api_key = process.env.PARKS_API_KEY;

/**
 * This helper function implements an asynchronous version of tthe
 * array function 'forEach'. 
 * We use this to sequentially retrieve park information for the popular
 * parks in our database.
 * 
 * 
 * @param {*} array - the array to iterate over. In our case, its the 
 * array of popular park codes.
 * @param {*} callback - the callback function to execute for each array element. 
 * In our case, it's the NPS API lookup to retrieve information on each popular park.
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = function(app) {
  // Load index page
  app.get("/", async function(req, res) {
    
    /* When the page loads, display the most popular parks that aree searched.
      To do this, we first look up our 'parkSearches' table. This will give us 
      the popular park codes

      We use the park codes to query NPS for the park data - name, images,
      and build an array of objects that is fed to handlebars *

    /*Step 1: Look up the parkSearches table */
    let parkInfoArray = [];
    db.ParkSearches.findAll({
      order:[ 
        ['hitCount','DESC'] 
      ]}).then(async function(popularParks){
    
      /* Step 2 : for each popular park code, get its info from the NPS API */
    

      /* Use async/await to wait for the NPS API response on each park */
      await asyncForEach(popularParks, async (currentPark) => {
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

        // UNCOMMENT THIS DURING DEBUGGING
        //console.log("\n\n Here's the park data");
        //console.log(parkInfo);
  
        parkInfoArray.push(parkInfo);
      });

      // UNCOMMENT THIS DURING DEBUGGING
      console.log(parkInfoArray);

      /* Array is ready. Use it to populate handlebars */

    });
 
    const pageObject = {
      style:"camperMain",
      jsFile:"landPage",
      popularPark: parkInfoArray
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
