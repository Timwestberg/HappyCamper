/**
 * Front-end code that submits a review for a park.
 */
//$.ready(function() {
    function submitReview(){
        console.log("User submitted a review, posting it to server");
    
        var review = {};
    
        review.name = $("#reviewer-name").val();
        review.rating = 4; // !!!!!!   FIX T?HIS    !!!!!
        review.text = $("#review-text").val();
        review.parkCode = "ACAD";
    
        $.post("/api/review", review, function(result){
            console.log("Post method returned");
            console.log(result);
        })
    }
    
    var $reviewSubmitBtn = $("#submit-review");
    
    $reviewSubmitBtn.on("click", submitReview);
//});

