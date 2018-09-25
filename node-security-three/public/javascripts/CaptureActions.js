$(document).ready(function(){
    var scrollCount =0;
    var questionCount =0;
    var searchCount = 0;
    var interval = 1000 * 60 * 2; // where X is your every X minutes
    console.log("document is loaded.");

    //-----------------------------------------------------
    $('.star-off').click(function () {
        console.log("User clicked on star");

    });

    //---------------------------------------------------------
    $(document).on('scroll', function(e) {
        console.log("user scrolling on document");
        scrollCount++;


    });
    //--------------------------------------------------------

    $('.askQuestion').click(function (e) {
        console.log("User clicked on ask question");
        questionCount++;

    });

    //------------------------------------------------------

    $('.searchButton').click(function (e) {
        console.log('user clicked on search button');
        searchCount++;

    });
    //--------------------------------------------------------------

    var callAPI = function(){
        $.ajax({
            type: "POST",
            url: "/users/updateDB/",
            data:{
                questionCount,
                searchCount,
                scrollCount
            },
            success: function(result) {
                console.log('ok');
            },
            error: function(result) {
                console.log('error');
            }
        });

        questionCount =0;
        searchCount =0;
        scrollCount = 0;
    };


    setInterval(callAPI, interval);

});// end of the main function.