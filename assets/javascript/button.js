$(document).ready(function () {

    $(".search-content").hide();

    $("#bttn").click(function () {
        console.log("clicked");
        // animates the bottom portion down
        $(".button-container").animate({
            top: "500px"
        });
        $("#bttn").hide();
        // var bttnWidth = $("")
        $(".search-content").fadeIn(2000);
    });

});