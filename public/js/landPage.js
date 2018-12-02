$(document).ready(function () {

    console.log("ready!");

    $('#searchButton').toggleClass("animate");

    $(".searchInput").toggleClass("active").focus;

    $("#searchBy").toggleClass("active").focus;


    $(".calendarInput").toggleClass("active").focus;

    $(".calendarInput2").toggleClass("active").focus;

    $(".calendarbutton").toggleClass("animate")

    $("section#searchPage").css("width", "70%");

    $("section#listResults").css("width", "15%");

    $("section#parkProfile").css("width", "15%");



});

//   Search Button
$("#searchButton").click(function () {

    $(".searchInput").toggleClass("active").focus;

    $("#searchBy").toggleClass("active").focus;

    $(this).toggleClass("animate");

    $(".searchInput").val("");

    // Switch page function
    $("section#searchPage").css("width", "70%");

    $("section#listResults").css("width", "15%");

    $("section#parkProfile").css("width", "15%");

    // Roll up calendar
    $(".calendarInput").toggleClass("active").focus;

    $(".calendarInput2").toggleClass("active").focus;

    $(".calendarbutton").toggleClass("animate")
});


//   Calendar Button
$(".calendarButton").click(function () {

    $(".calendarInput").toggleClass("active").focus;

    $(".calendarInput2").toggleClass("active").focus;

    $(this).toggleClass("animate");

    $(".calendarInput").val("");

    $(".calendarInput2").val("");

    // Switch page function
    $("section#searchPage").css("width", "70%");

    $("section#listResults").css("width", "15%");

    $("section#parkProfile").css("width", "15%");


    // SearchBar Roll up 

    $('#searchButton').toggleClass("animate");

    $(".searchInput").toggleClass("active").focus;

    $("#searchBy").toggleClass("active").focus;
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
var phase_triggers = [$("#searchButton")];

var pages_viewed = [$("section#searchPage")];

function check_page_viewed(pages_viewed) {

    if (pages_viewed.length === 1) {

        pages_viewed.push($("section#listResults"));

    } else if (pages_viewed.includes($("section#parkProfile")) === false) {
        pages_viewed.push($("section#parkProfile"));
    };

    return pages_now_viewed(pages_viewed);
};

function pages_now_viewed(pages_viewed) {
    for (i = 0; i < pages_viewed.length; i++) {
        pages_viewed[i].click((event) => {
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

    $("section#searchPage").css("width", "70%");

    $("section#listResults").css("width", "15%");

    $("section#parkProfile").css("width", "15%");

    // $("button#resultsButton").css("display", "none");

    if (pages_viewed.length < 3) {
        check_page_viewed(pages_viewed);

    };

};

function phase2(pages_viewed) {
    $("section#searchPage").css("width", "15%");
    $("section#listResults").css("width", "70%");
    // $("button#r").css("display", "block");
    $("section#parkProfile").css("width", "15%");
    if (pages_viewed.length < 3) {
        check_page_viewed(pages_viewed);
    };
};

function phase3(pages_viewed) {
    // $("#resultsButton").css("display", "none");
    $("section#searchPage").css("width", "15%");
    $("section#listResults").css("width", "15%");
    $("section#parkProfile").css("width", "70%");
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