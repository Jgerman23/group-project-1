$(document).ready(function () {
    console.log("ready to go");

    //retrieve from local storage
    var previousSearches = JSON.parse(localStorage.getItem('previousSearches'));
   
    $("#topic-search").on("click", function (event) {
        var topic = $("#topic-input").val().trim();
        event.preventDefault();
        retrieveData(topic);
        saveSearchLocal(topic);
        movieDetails();
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


    // these are saved to local storate
    var saveSearchLocal = function (topic) {
        console.log("save search: "+topic);
        previousSearches.push(topic);
        localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
        displaySearches(previousSearches);
    }


    // todo: how many do we want to display
    var displaySearches = function (previousSearches) {
        var table = "<table border='1|1'>";
        for (var i = 0; i < previousSearches.length; i++) {
            console.log(previousSearches[i]);
            table += "<tr>";
            table += "<td>" + previousSearches[i] + "</td>";
            table += "</tr>";
        }
        table += "</table>";
        $("#previousSearch").html(table);
    }

    // /**************MOVIE DATABASE API************************************************ */



    function getUpcoming() {

        var apiKey2 = "94495226dcf25d4ca58cfc513b3eaf4d";
        var queryURL = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + apiKey2 + "&language=en-US&page=1";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var results = response.results;
            console.log(results);


            var table = "<table border='1|1'>";
            for (var i = 0; i < 5; i++) {
                table += "<tr>";
                table += "<td>" + results[i].title + "<br>" + "Release Date: " + results[i].release_date + "</td>";
                // table+="<td>"+results[i].release_date+"</td>";


                table += "</tr>";

            }
            table += "</table>";
            $("#upcomingMovies").html(table);

        });
    }
    getUpcoming();
    displaySearches(previousSearches);

    function movieDetails() {
        var apiKey2 = "94495226dcf25d4ca58cfc513b3eaf4d";


        var movieSearch = $("#topic-input").val().trim();
        var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey2 + "&language=en-US&query=" +
            movieSearch + "&page=1&include_adult=false";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var detailResults = response.results;
            console.log(detailResults);


            for (var i = 0; i < 1; i++) {
                var movieTitle = detailResults[i].title;
                var releaseDate = detailResults[i].release_date;
                var overviewResults = detailResults[i].overview;

                // var overviewResults = response.results.overview;
                $("#movieTi").text("Title: " + movieTitle);
                $("#movieRD").text("Release Date: " + releaseDate);
                $("#movieOv").text("Movie Overview: " + overviewResults);
                console.log(overviewResults);

            }



        })
    }

});




