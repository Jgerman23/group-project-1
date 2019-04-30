$(document).ready(function () {

    $(".search-content").hide();
    $(".search-result").hide();

    $("#bttn").click(function () {
        console.log("clicked");
        // animates the bottom portion down
        $(".button-container").animate({
            top: "50px"
        });
        $("#bttn").animate({
            opacity: 0, 
        },"slow");
        $(".search-content").fadeIn(1000);
    });

   

});