$(document).ready(function () {
    console.log("ready to go");
    
    var savedSearches = [];

    // listener for firebase data changes
    database.ref("/moviebox/upcomming").on("child_added", function (data) {
    })
    database.ref("/moviebox/previousSearch").on("child_added", function (data) {
    })

    //search on enter
    var input = document.getElementById("topic-input");
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("topic-search").click();
        }
    });

    $("#topic-search").on("click", function (event) {
        var topic = $("#topic-input").val().trim();
        event.preventDefault();
        retrieveData(topic);
        saveSearchFireBase(topic);
        movieDetails();
        if (topic.length === 0) {
            // $("#myModal").modal("show");
            alert("place holder for modal, remove and uncomment modal logic")
        }
        $("#topic-input").val("");
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
            tRow.append(iframe);
            $("#topic-result").append(tRow);
            $(".search-result").slideDown(500)
        }

    }


    // these are saved to local storate
    var saveSearchLocal = function (topic) {
        console.log("save search local: " + topic);
        previousSearches.push(topic);
        localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
        displaySearches(previousSearches);
        saveSearchFireBase(previousSearches);
    }

    
    var saveSearchFireBase = function (search) {
        console.log("save searh firebase");
        if (!savedSearches.includes(search)) {
            console.log("new search, saving");
            database.ref("/moviebox/previousSearch/").push(search);
        }
        displaySearches();
    }


    //TODO: how many do we want to display
    var displaySearches = function () {
        console.log("display searches");
        var query = firebase.database().ref("/moviebox/previousSearch/");
        query.once("value").then(function (searchedMovie) {
            // var table = "<table border='1|1'>";
            searchedMovie.forEach(function (childsearchedMovie) {
                var value = childsearchedMovie.val();
                savedSearches.push(value);

                var td = $("<td>");
                    td.html(value);
                var tr = $("<tr>");
                    tr.append(td);
                $(".previousSearch").append(tr);
                // table += "<tr>";
                // table += "<td>" + value + "</td>";
                // table += "</tr>";
            });
            // $("#previousSearch").html(table);
        });
    }
    // /**************MOVIE DATABASE API************************************************ */


    var saveUpComming = function (movies) {
        console.log("save up coming");
        var upComming = {};
        for (var i = 0; i < movies.length; i++) {
            var title = movies[i].title;
            var releaseDate = movies[i].release_date;
            upComming = {
                key: i,
                movie: title,
                date: releaseDate
            };
            database.ref("/moviebox/upcomming/" + i).set(upComming);
        }
    }

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
            saveUpComming(results);

            for (var i = 0; i < 5; i++) {
                var name = results[i].title
                console.log(name);
                var a = $("<a>");
                a.attr("href", "#")
                console.log(a);
                // a.attr("onclick", "func(); return false;")
                a.attr("id", "movieLink");
                a.attr("data-name", results[i].title);
                a.attr("title", name);
                a.text(results[i].title);
                var td = $("<td>");
                td.html("<br>" + "Release Date: " + results[i].release_date);
                var tr = $("<tr>");
                td.prepend(a);
                tr.append(td);
                $(".upcomingCard").append(tr);

            }

        });
    }
    getUpcoming();
    displaySearches();
    
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
                var movieRating = detailResults[i].vote_average;
                var releaseDate = detailResults[i].release_date;
                var overviewResults = detailResults[i].overview;

                // var overviewResults = response.results.overview;
                $("#movieTi").text(movieTitle);
                $("#movieRa").text(movieRating);
                $("#movieRD").text("Release Date: " + releaseDate);
                $("#movieOv").text("Movie Overview: " + overviewResults);
                console.log(overviewResults);
                document.getElementById("stars").innerHTML = getStars(movieRating);
            }
        })
    }

    $(document).on("click", "#movieLink", function () {
        console.log("click");
        var movieSearch = $("#movieLink").val();
        var movie = $(this).attr("data-name")
        console.log(movie);
        $(".button-container").animate({
            top: "50px"
        });
        $("#bttn").animate({
            opacity: 0,
        }, "slow");
        $(".search-content").fadeIn(1000);
        movieClickLink()
        console.log(movieSearch);
    });

    function movieClickLink() {
        var apiKey2 = "94495226dcf25d4ca58cfc513b3eaf4d";


        var movieSearch = $("#movieLink").val();
        console.log(movieSearch);
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
                var movieRating = detailResults[i].vote_average;
                var releaseDate = detailResults[i].release_date;
                var overviewResults = detailResults[i].overview;

                // var overviewResults = response.results.overview;
                $("#movieTi").text(movieTitle);
                $("#movieRa").text(movieRating);
                $("#movieRD").text("Release Date: " + releaseDate);
                $("#movieOv").text("Movie Overview: " + overviewResults);
                console.log(overviewResults);
                document.getElementById("stars").innerHTML = getStars(movieRating);
            }
        });
    }


    function getStars(rating) {

        // Round to nearest half
        rating = Math.round(rating * 2) / 2;
        let output = [];

        // Append all the filled whole stars
        for (var i = rating; i >= 1; i--)
            output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');

        // If there is a half a star, append it
        if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

        // Fill the empty stars
        for (let i = (5 - rating); i >= 1; i--)
            output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

        return output.join('');

    }

});




