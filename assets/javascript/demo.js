$(document).ready(function () {

    $(".search-content").hide();

    $("#bttn").click(function () {
        console.log("clicked");
        // animates the bottom portion down
        $(".button-container").animate({
            top: "500px"
        });
        // animates the button from bottom of the div to the right side
        $("#bttn").animate({
            top: "120px",
            right: "500px",
            opacity: "0"
        });
        $("#bttn").empty();
        $(".search-content").fadeIn(2000);
    });

});