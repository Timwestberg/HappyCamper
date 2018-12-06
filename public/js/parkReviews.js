/**
 * Front-end code that submits a review for a park.
 */

 //This whole bottom function is for the stars in the reviews
var numStars;
$("div.star-rating > s, div.star-rating-rtl > s, rating").on("click", function(e) {

    console.log("Stars clicked");

    // remove all active classes first, needed if user clicks multiple times
    $(this).closest('div').find('.active').removeClass('active');

    $(e.target).parentsUntil("div").addClass('active'); // all elements up from the clicked one excluding self
    $(e.target).addClass('active');  // the element user has clicked on


    numStars = $(e.target).parentsUntil("div").length+1;
    $('.show-result').text(numStars + (numStars == 1 ? " star" : " stars!"));
});

function submitReview(){
    console.log("User submitted a review, posting it to server");

    var review = {};

    review.name = $("#reviewer-name").val();
    review.rating = numStars; 
    review.text = $("#review-text").val();
    review.parkCode = currentDisplayedPark;

    $.post("/api/review", review, function(result){
        console.log("Post method returned");
        console.log(result);

        /* Display the submitted review */
        var $parkReviewsDiv = $("#display-reviews");

        var $reviewCard =$("<div/>");
        $reviewCard.addClass("card");

        var $reviewCardBody = $("<div/>");
        $reviewCardBody.addClass("card-body");

        var $reviewCardTitle = $("<h5/>");
        $reviewCardTitle.addClass("card-title");
        $reviewCardTitle.text("Reviewer : " + result.reviewer);

        var $reviewCardSubTitle = $("<h6/>");
        $reviewCardSubTitle.addClass("card-title");
        $reviewCardSubTitle.text("Rating : " + result.rating);

        var $reviewCardText = $("<p/>");
        $reviewCardText.addClass("card-text");
        $reviewCardText.text(result.reviewText);
        
        $reviewCardBody.append($reviewCardTitle);
        $reviewCardBody.append($reviewCardSubTitle);
        $reviewCardBody.append($reviewCardText);

        $reviewCard.append($reviewCardBody);

        $parkReviewsDiv.append($reviewCard);
    })
}

var $reviewSubmitBtn = $("#submit-review");

$reviewSubmitBtn.on("click", submitReview);
//});

