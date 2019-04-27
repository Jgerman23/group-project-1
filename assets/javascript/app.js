$(document).ready(function () {
    console.log("ready to go");

    $("#topic-search").on("click", function (event) {
        var topic = $("#topic-input").val().trim();
        event.preventDefault();
        retrieveData(topic);
    });

    var retrieveData = function (topic) {
        console.clear();
        console.log("retrieve data: " + topic);

        var part = "snippet";
        var q = topic + "-trailer";
        var apiKey = "AIzaSyAOaGuq-aF8SJE8pVwGS_NQ7tL9-yEXn84";
        var maxResults = 1;
        var channelType = "show";
        var safeSearch = "strict";
        var videoDefinition = "high";
        var videoLicense = "youtube";
        var safeSearch = "strict";
        var videoCategoryId = "30";
        //together
        var type = "video";
        var videoType = "movie";

        var queryURL = "https://www.googleapis.com/youtube/v3/search?part="
            + part
            + "&q=" + q
            + "&type=" + type
            + "&videoLicense=" + videoLicense
            + "&videoDefinition=" + videoDefinition
            + "&videoType=" + videoType
            + "&maxResults=" + maxResults
            + "&key=" + apiKey
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            displayTopic(response);
        });
    }


    var displayTopic = function (response) {
        $("#topic-result").empty();
        for (var i = 0; i < response.items.length; i++) {
            var data = response.items[i];
            console.log(data.snippet.title);
            var tRow = $("<tr>");
            var title = $("<td>").text(data.snippet.title);
            var kind = $("<td>").text(data.id.kind);
            var videoId = $("<td>").text(data.id.videoId);

            var iframe = $("<iframe>");
            iframe.attr("id", "ytplayer");
            iframe.attr("type", "text/html");
            iframe.attr("width", "640");
            iframe.attr("height", "360");
            iframe.attr("src", "https://youtube.com/embed/" + data.id.videoId);
            iframe.appendTo("body");
            var link = $('<a>', {
                target: '_new',
                href: "https://youtube.com/watch?v=" + data.id.videoId,
            }).appendTo('body');

            tRow.append(iframe);
            $("#topic-result").append(tRow);
        }

    }


    // /**************MOVIE DATABASE API************************************************ */



    function getUpcoming() {
        // event.preventDefault();
        // var movieSearch = $("#movieInput").val();
         // var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey2 + "&language=en-US&query=" +
        //     movieSearch + "&page=1&include_adult=false";

        var apiKey2 = "94495226dcf25d4ca58cfc513b3eaf4d";
        var queryURL = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + apiKey2 + "&language=en-US&page=1";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);


            // var results = response.data;

            for (var i = 0; i < response.results.length; i++) {
                var movDiv = $("<div>");
                var title = results[0].title;
                var p = $("<p>").text("Title: " + title);
                console.log(title);

            }
            movDiv.prepend(p);


            $("#movie-info-here").prepend(movDiv);
        });



    }

    getUpcoming();



});

