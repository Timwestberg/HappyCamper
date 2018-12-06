const express = require("express");
const app = express();

var request = require("request");
var parks_api_key = "dhGJ8AteLZ%UAwz7dvhNVa43QGqu0WjD29R0J2B";

app.get("/api/nps/stateCode/:stateCode", function(req, res) {
    console.log(req.originalUrl);
    request("http://api.nps.gov/api/v1/parks/?stateCode="+req.params.stateCode+"&fields=images&apiKey="+parks_api_key,
    (error, response, body) =>    {
        if(error || response.statusCode != 200){
            return console.log("Oops couldn't find the park");
        }
        var results = JSON.parse(body);
        res.send(results);
    });
});

app.get("/api/nps/parkCode/:parkCode", function(req, res) {
    console.log(req.originalUrl);
    request("http://api.nps.gov/api/v1/parks/?parkCode="+req.params.parkCode+"&fields=images&apiKey="+parks_api_key,
    (error, response, body) =>    {
        if(error || response.statusCode != 200){
            return console.log("Oops couldn't find the park");
        }
        var results = JSON.parse(body);
        res.send(results);
    });
});

module.exports = app;