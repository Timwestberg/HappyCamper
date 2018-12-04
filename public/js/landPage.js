$(document).ready(function () {

    console.log("ready!");

    $('#searchButton').toggleClass("animate");

    $(".searchInput").toggleClass("active").focus;

    $("#searchBy").toggleClass("active").focus;


    $(".calendarInput").toggleClass("active").focus;

    $(".calendarInput2").toggleClass("active").focus;

    $(".calendarbutton").toggleClass("animate");

    $("section#searchPage").css("width", "70vw");

    $("section#listResults").css("width", "15vw");

    $("section#parkProfile").css("width", "15vw");



});

//   Search Button
$("#searchButton").click(function () {

    $(".searchInput").toggleClass("active").focus;

    $("#searchBy").toggleClass("active").focus;

    $(this).toggleClass("animate");

    $(".searchInput").val("");

    // Switch page function
    // $("section#searchPage").toggleClass("open").toggleClass("closed");

    // $("section#listResults").toggleClass("closed").toggleClass("open");

    // Roll up calendar
    $(".calendarInput").toggleClass("active").focus;

    $(".calendarInput2").toggleClass("active").focus;

    $(".calendarbutton").toggleClass("animate");
});


//   Calendar Button
$(".calendarButton").click(function () {

    $(".calendarInput").toggleClass("active").focus;

    $(".calendarInput2").toggleClass("active").focus;

    $(this).toggleClass("animate");

    $(".calendarInput").val("");

    $(".calendarInput2").val("");

    // Switch page function
    $("section#searchPage").css("width", "70vw");

    $("section#listResults").css("width", "15vw");

    $("section#parkProfile").css("width", "15vw");
    


    // SearchBar Roll up 

    $('#searchButton').toggleClass("animate");

    $(".searchInput").toggleClass("active").focus;

    $("#searchBy").toggleClass("active").focus;
});

// login Button ======================================
$("#loginButton").click(function () {

  
    $(this).toggleClass("animate");
});

//   Date Picker
$("#datepicker").datepicker({

    inline: true,

    format: "mm/dd/yyyy",

    todayBtn: "linked",

    clearBtn: true,

    multidate: false,

    autoclose: true,

    todayHighlight: true,

    toggleActive: true
});


// Functions for movement between tabs
let phase_triggers = [$("#searchButton")];

let pages_viewed = [$("section#searchPage")];

function check_page_viewed(pages_viewed)  {

    if (pages_viewed.length === 1) {

        pages_viewed.push($("section#listResults"));

    } else if (pages_viewed.includes($("section#parkProfile"),$(".carouselVanish")) === false) {
        pages_viewed.push($("section#parkProfile"),$(".carouselVanish"));
    };

    return pages_now_viewed(pages_viewed);
};

function pages_now_viewed(pages_viewed) {

    
    for (i = 0; i < pages_viewed.length; i++) {

        pages_viewed[i].click((event) => {

            event.preventDefault();

            console.log(pages_viewed);

            switch (event.target.id) {

                case "searchPage":

                    phase1(pages_viewed);

                    break;

                case "listResults":

                    phase2(pages_viewed);

                    break;

                case "parkProfile":

                    phase3(pages_viewed);

                    break;

                default:

                    break;
            }
        })
    }
};

function phase1(pages_viewed) {

    $("section#searchPage").css("width", "70vw");

    $("section#listResults").css("width", "15vw");

    $("section#parkProfile").css("width", "15vw");

    if (pages_viewed.length < 3) {
        check_page_viewed(pages_viewed);

    };

};

function phase2(pages_viewed) {

    $("section#searchPage").css("width", "15vw");

    $("section#listResults").css("width", "70vw");

    $("section#parkProfile").css("width", "15vw");

    if (pages_viewed.length < 3) {

        check_page_viewed(pages_viewed);
    };
};

function phase3(pages_viewed) {

    $("section#searchPage").css("width", "15vw");

    $("section#listResults").css("width", "15vw");

    $("section#parkProfile").css("width", "70vw");

    $(".carouselVanish").css("visibility","visible").css("background-color","#2892e2");

    if (pages_viewed.length < 3) {

        check_page_viewed(pages_viewed);

    };

};

for (i = 0; i < phase_triggers.length; i++) {

    phase_triggers[i].click((event) => {

        event.preventDefault();

        switch (event.target.id) {

            case "searchButton":

                phase2(pages_viewed);

                break;

            case "resultsButton":

                phase3(pages_viewed);

                break;

            default:

                break;
        }
    })
};

// Login Page Modal Javscript 
// =============================================

// Doesnt Work Yet
// $(window).click( () => {

//     function outsideClick(e) {
//     if(e.target == $("#loginModal")) {
//         $("#loginModal").css("display","none")
//     }

// };

// outsideClick();
// });

    // click funciton for login button
$("#loginButton").click( () => {

    /** Function to open the modal */
   function openModal()  {
        $("#loginModal").css("display","block");
    }

    openModal();

});

// close function using button to exit
$(".loginCloseButton").click( () => {

    /** Function to close the modal */
    function closeModal() {
        $("#loginModal").css("display","none");
    }

    closeModal();
})





// =================================================================


// Park Profile Javascript ======================================================
// This is where the API URL is going to go
var queryURL = "https://api.nps.gov/api/v1/parks/?parkCode=YOSE&fields=images&apiKey=dhGJ8AteLZVwUAwz7dvhNVa43QGqu0WjD29R0J2B";

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


getParkDetails('ACAD');



// ===========================================================================


