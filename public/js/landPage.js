// $("#loginButton").click(function () {
//     $(this).toggleClass("animate");
// });
var rows = [];

function append_park_row(nps, display)  {
    var park_row = new JQ("div", ["row", "park_row"], nps.parkCode+"_row");
    (display.section).append(park_row[0]);
    var park_img_col = new JQ("div", ["col-sm-3","col-md-3", "col-lg-3", "col-3", "park_img_col", nps.parkCode], nps.parkCode+"_img_col");
    var park_info_col = new JQ("div", ["col-sm-9","col-md-9", "col-lg-9", "col-9", "park_img_col", nps.parkCode], nps.parkCode+"_info_col");
    park_row.append(park_img_col, park_info_col);
    var park_img = new JQ("img", ["park_img","img-fluid", nps.parkCode], nps.parkCode+"_img", nps.images[0].url, nps.images[0].url);
    park_img_col.append(park_img);
    var park_info_col_top = new JQ("div", ["row", "park_info_col_top", nps.parkCode], nps.parkCode+"_info_col_top");
    var park_info_col_bottom = new JQ("div", ["row", "park_info_col_bottom", nps.parkCode], nps.parkCode+"_info_col_bottom");
    park_info_col.append(park_info_col_top, park_info_col_bottom);
    var park_title_div = new JQ("div",["col-8", "park_title_div", "park_info_col_top_children", nps.parkCode], nps.parkCode+"_title_div");
    var park_location_div = new JQ("div", ["col-4", "park_location_div", "park_info_col_top_children", nps.parkCode], nps.parkCode+"_location_div");
    park_info_col_top.append(park_title_div, park_location_div);
    var park_name = new JQ("h1", ["park_name", nps.parkCode], nps.name);
    park_title_div.append(park_name);
    park_name.text(""+nps.fullName+"");
    var park_location = new JQ("h1", ["park_location", nps.parkCode], nps.parkCode+"_location");
    park_location_div.append(park_location);
    park_location.text(nps.states);
    var park_description = new JQ("p",["park_description", nps.parkCode], nps.parkCode+"_description").text(nps.description);
    park_info_col_bottom.append(park_description);
    rows.push(search_results[0].children[i]);
    return rows;
};

var searchInput = $("input.searchInput");
var searchButton = $("button#searchButton");
var searchBy = $("#searchBy");
var searchParameters = $(".searchParameters");
var changeInputState = "open next";

var search_page = $("div#search_page");
var results_page = $("div#results_page");
var park_page = $("div#park_page");
var search_results = $("div#search_results");
var pages_viewed = [search_page];
var third_toggle = false;

function User_Search(search_type)  {
    this.search_type = search_type;
    this.search_code = searchInput.val();
};

function Display_Div()  {
    this.a = () =>  {this.section= $("div#search_results")[0]; this.number = 6; return this;},
    this.b = () =>  {this.section= $("div#park_page")[0]; this.number = 1; return this;}
    return this;
};

function callback_display(results) {
    for (i=0; i < display.number; i++)   {
        var randomized = Math.floor(Math.random() * results.total)
        var nps = results.data[randomized];
        rows = append_park_row(nps, display);
    }
    console.log(rows);
    for (i=0; i < rows.length; i++) {
        $(rows[i]).click((event)    =>  {
            var objClasses = $(event.target)[0].classList;
            for (i=0; i< objClasses.length; i++)  {
                if (objClasses[i].length === 4) {
                console.log($(event.target)[0].classList[i]);
}}})}};

function park_lookup_by(new_search){
    var search_code = new_search.search_code;
    if (new_search.search_type === "stateCode")   { 
        display = new Display_Div().a();
        if (!search_code || typeof(search_code) !== "string" || search_code.length !== 2) { 
            return console.log("Please enter a valid state");
        }}
    else { 
        display = new Display_Div().b();
        if (!search_code || typeof(search_code) !== "string" || search_code.length !== 4) {
        return console.log("Please enter a valid park");
    }};
    var parks_api_key = "6ZFucJJTnGwwCWfAHiXZuOBLrNo9fQIqGecLoCOz";
    var queryUrl = "http://api.nps.gov/api/v1/parks/?"+new_search.search_type+"="+search_code+"&fields=images&apiKey="+parks_api_key;
	$.ajax(queryUrl, (error, response, body) => {
		if(error || response.statusCode != 200){
            return console.log("Oops couldn't find the park(s)");
        };
        results = JSON.parse(body);
	}).then((results) => {
        console.log(results.total + " matches found!\n");
        return callback_display(results);
})};

function check_page_viewed(pages_viewed, third_toggle, new_search)  {
    if (pages_viewed.length === 1) {    pages_viewed.push(results_page);   }   
    else if ((pages_viewed.includes(park_page) === false)  && (third_toggle === true))  {  pages_viewed.push(park_page);  };
    return pages_now_viewed(pages_viewed, new_search);
};

function pages_now_viewed(pages_viewed, new_search)    {
for (i=0; i < pages_viewed.length; i++)    {
    pages_viewed[i].click((event) =>   {
        switch (event.target.id)    {
            case "search_page":
                phase1(pages_viewed, third_toggle, new_search);
                break;
            case "results_page":
                phase2(pages_viewed, third_toggle, new_search);
                break;
            case "park_page":
                phase3(pages_viewed, third_toggle, new_search);
                break;
            default:
                break;
}})}};

function phase1(pages_viewed, third_toggle, new_search)   {
    search_page.css("width", "70%")
    results_page.css("width", "15%");
    park_page.css("width", "15%");
    search_results.css("display", "none");
    if (pages_viewed.length < 3)  {   check_page_viewed(pages_viewed, third_toggle, new_search);    };
};

function phase2(pages_viewed, third_toggle, new_search)   {
    search_page.css("width", "15%");
    results_page.css("width", "70%")
    search_results.css("display", "block");
    park_page.css("width", "15%");
    if (pages_viewed.length < 3)  {   check_page_viewed(pages_viewed, third_toggle, new_search);    };
;};

function phase3(pages_viewed, third_toggle, new_search)   {
    search_results.css("display", "none");
    search_page.css("width", "15%");
    results_page.css("width", "15%");
    park_page.css("width", "70%")
    if (pages_viewed.length < 3)  {   check_page_viewed(pages_viewed, third_toggle, new_search);    };
};

$("button#results_btn").click((event) => {
    event.preventDefault();
    third_toggle = true;
    phase3(pages_viewed, third_toggle);
});

searchButton.click((event)   =>  {
    event.preventDefault();
    switch (changeInputState)   {
        case ("open next"):
            searchBy.toggleClass("active").focus;
            searchInput.toggleClass("active").focus;
            searchButton.toggleClass("animate");
            changeInputState = "close next";
            return changeInputState;
        case ("close next"):
            if (searchInput.val() === "" || undefined || null)   {
                searchBy.toggleClass("active").focus;
                searchInput.toggleClass("active").focus;
                searchButton.toggleClass("animate");
                changeInputState = "open next";
                return changeInputState;
            }   else    {
                    switch (searchParameters[0].checked)  {
                        case false:
                            if (searchInput.val().length !== 2) {   return alert("Please input a valid state code") }
                            else    {
                                var new_search = new User_Search("stateCode");
                                phase2(pages_viewed, third_toggle, new_search);
                                park_lookup_by(new_search);
                            };
                        break;
                        case true:
                            if (searchInput.val().length !== 4) {   return alert("Please input a valid park code") }
                            else    {
                                var new_search = new User_Search("parkCode");
                                phase3(pages_viewed, third_toggle, new_search);
                                park_lookup_by(new_search);
                            };
                        break;
            }};
        return changeInputState; 
        default: break;
    }

    return changeInputState;
});



// Park Profile Javascript ======================================================
// This is where the API URL is going to go
var queryURL = "https://api.nps.gov/api/v1/parks/?parkCode=YOSE&fields=images&apiKey=6ZFucJJTnGwwCWfAHiXZuOBLrNo9fQIqGecLoCOz";

/**
 * Summary
 * This function display the description of the park
 */
function getParkDetails(ParkCode){
  var queryURL= "https://api.nps.gov/api/v1/parks/?parkCode="+ParkCode.toUpperCase()+"&fields=images&apiKey=dhGJ8AteLZVwUAwz7dvhNVa43QGqu0WjD29R0J2B";
  console.log("Querying National Parks with the following URL");
  console.log(queryURL);
  
  $.ajax({
    url: queryURL,
    method: "GET",
    crossDomain:true
  }).then(function(response){
    var results = response;
    console.log(results);

    var imageIDs = ["#FirstImg", "#SecondImg", "#ThirdImg"]


    console.log("Here is the description of the park");
    console.log(results.data[0].description);
    console.log(results.data[0].images[0].url);

  //GETt the Park Name to display 
  $("#park").text(results.data[0].fullName);

  //GET the park description of the park 
  $("#parkInfo").text(results.data[0].description);

  var numImages = results.data[0].images.length;

  console.log("The park has " + numImages + " images");
    
  //GET Images to display in the carousel 
  for(let i = 0; i < imageIDs.length; i++){
    $(imageIDs[i]).attr("src",results.data[0].images[i].url);
  }

  });
  
}
//This whole bottom function is for the stars in the reviews
$(function() {
    $("div.star-rating > s, div.star-rating-rtl > s").on("click", function(e) {
    
    // remove all active classes first, needed if user clicks multiple times
    $(this).closest('div').find('.active').removeClass('active');
  
    $(e.target).parentsUntil("div").addClass('active'); // all elements up from the clicked one excluding self
    $(e.target).addClass('active');  // the element user has clicked on
  
  
        var numStars = $(e.target).parentsUntil("div").length+1;
        $('.show-result').text(numStars + (numStars == 1 ? " star" : " stars!"));
    });
  });


getParkDetails('CASA');



// ===========================================================================






function JQ(element, classes, id, src, href)    {
    this.classes = () => {
        if (typeof(classes) === "string")  {return classes;} else {Array.isArray(classes) ? classes: [classes]; return classes.join(" ");};};
    this.DOMref = () => {
        var createElement = $("<"+element+">");
		if (typeof(classes) != "undefined" || "null" || "number" || "function")	{createElement.addClass(this.classes());};
		if (typeof(id) != "undefined" || "null" || "number" || "function")	{createElement.attr("id", id)};
        if (typeof(src) != "undefined" || "null" || "number" || "function")  {createElement.attr("src", src);};
        if (typeof(href) != "undefined" || "null" || "number" || "function")  {createElement.attr("href", href);};
        this.DOMref = createElement; return $(this.DOMref[0]);};
		return this.DOMref();
};