$(document).ready(function () {
    console.log("ready to go");
    var savedSearches = [];


    firebase.database().ref("/moviebox/previousSearch").on('value', function () {
        console.log("previous search changed");
        displaySearches();
    });

    firebase.database().ref("/moviebox/upcoming").on('value', function () {
        console.log("upcoming changed");
        getUpComingMovies();
    });


    //allow enter key to initiate search
    var input = document.getElementById("movie-input");
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("movie-search").click();
        }
    });


    //search button listener
    $("#movie-search").on("click", function (event) {
        var movie = $("#movie-input").val().trim();
        event.preventDefault();
        if (movie.length === 0) {
            $("#myModal").modal("show");
        }
        else {
            getMovieTrailer(movie)
            saveSearchFireBase(movie);
            getMovieDetails(movie);
            $("#movie-input").val("");
        }
    });


    //upcoming movie listener
    $(document).on("click", "#movieLink", function () {
        var movie = $(this).attr("data-name")
        console.log("click: "+movie);
        $(".button-container").animate({
            top: "50px"
        });
        $("#bttn").animate({
            opacity: 0,
        }, "slow");
        $(".search-content").fadeIn(1000);
        getMovieTrailer(movie);
        getMovieDetails(movie);
    });


    var getMovieTrailer = function (movie) {
        var apiQuery = firebase.database().ref("/moviebox/youtubeapi/");
        apiQuery.once("value").then(function (api) {
            var youTubeAPI = api.val();
            searchYouTube(movie, youTubeAPI);
        });
    }


    var getUpComingMovies = function () {
        var apiQuery = firebase.database().ref("/moviebox/tmdbapi/");
        apiQuery.once("value").then(function (apiKey) {
            var tmdbAPI = apiKey.val();
            searchTMDB(tmdbAPI);
        });
    }


    var getMovieDetails = function (movie) {
        var apiQuery = firebase.database().ref("/moviebox/tmdbapi/");
        apiQuery.once("value").then(function (apiKey) {
            var tmdbAPI = apiKey.val();
            movieDetails(movie, tmdbAPI);
        });
    }


    var searchYouTube = function (movie, youTubeAPI) {
        console.log("search youtube: " + movie);
        var part = "snippet";
        var q = movie;// + "-trailer";
        var maxResults = 1;
        // var videoDefinition = "high";
        var videoLicense = "youtube";
        var type = "video";
        var videoType = "movie";

        var queryURL = "https://www.googleapis.com/youtube/v3/search?part="
            + part
            + "&q=" + q
            + "&type=" + type
            + "&videoLicense=" + videoLicense
            // + "&videoDefinition=" + videoDefinition
            + "&videoType=" + videoType
            + "&maxResults=" + maxResults
            + "&key=" + youTubeAPI
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            showMoviePlayer(response);
        });
    }


    var showMoviePlayer = function (response) {
        $("#movie-result").empty();
        for (var i = 0; i < response.items.length; i++) {
            var data = response.items[i];
            console.log(data.snippet.title);
            var tRow = $("<tr>");
            var iframe = $("<iframe>");
            iframe.attr("id", "ytplayer");
            iframe.attr("type", "text/html");
            iframe.attr("width", "640");
            iframe.attr("height", "360");
            iframe.attr("src", "https://youtube.com/embed/" + data.id.videoId);
            iframe.appendTo("body");
            tRow.append(iframe);
            $("#movie-result").append(tRow);
            $(".search-result").slideDown(500)
        }
    }


    var saveSearchFireBase = function (search) {
        console.log("save searh firebase");
        if (!savedSearches.includes(search)) {
            console.log("new search, saving");
            database.ref("/moviebox/previousSearch/").push(search);
        }
        displaySearches();
    }


    var displaySearches = function () {
        console.log("display searches");
        var query = firebase.database().ref("/moviebox/previousSearch/");
        $(".previousSearch").empty();
        query.once("value").then(function (searchedMovie) {
            searchedMovie.forEach(function (childsearchedMovie) {
                var value = childsearchedMovie.val();
                savedSearches.push(value);
                var td = $("<td>");
                td.html(value);
                var tr = $("<tr>");
                tr.append(td);
                $(".previousSearch").prepend(tr);
            });
        });
    }


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


    function searchTMDB(tmdbAPI) {
        var queryURL = "https://api.themoviedb.org/3/movie/upcoming?api_key=" +
            tmdbAPI + "&language=en-US&page=1";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var results = response.results;
            saveUpComming(results);
            displayUpcomingMovies(results);
        });
    }


    var displayUpcomingMovies = function (results) {
        for (var i = 0; i < 7; i++) {
            var name = results[i].title
            var releaseDate = moment(results[i].release_date).format("MMM Do YYYY");
            var a = $("<a>");
            a.attr("href", "#")
            a.attr("id", "movieLink");
            a.attr("data-name", name);
            a.attr("title", name);
            a.text(name);
            var td = $("<td>");
            td.html("<br>" + "Release Date: " + releaseDate);
            var tr = $("<tr>");
            td.prepend(a);
            tr.append(td);
            $(".upcomingCard").append(tr);
        }
    }


    function movieDetails(movie, tmdbAPI) {
        var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=" +
            tmdbAPI + "&language=en-US&query=" +
            movie + "&page=1&include_adult=false";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var detailResults = response.results;
            displayMovieDetails(detailResults);
        })
    }


    var displayMovieDetails = function (detailResults) {
        for (var i = 0; i < 1; i++) {
            var movieTitle = detailResults[i].title;
            var movieRating = detailResults[i].vote_average;
            var releaseDate = moment(detailResults[i].release_date).format("MMM Do YYYY");
            var overviewResults = detailResults[i].overview;
            $("#movieTi").text(movieTitle);
            $("#movieRa").text(movieRating);
            $("#movieRD").text("Release Date: " + releaseDate);
            $("#movieOv").text("Movie Overview: " + overviewResults);
            document.getElementById("stars").innerHTML = getStars(movieRating);
        }
    }


    function getStars(rating) {
        // Round to nearest half
        rating = Math.round(rating * 2) / 2;
        let output = [];
        // Append all the filled whole stars
        for (var i = rating; i >= 1; i--) {
            output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');
        }
        // If there is a half a star, append it
        if (i == .5) {
            output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
        }
        // Fill the empty stars
        for (let i = (5 - rating); i >= 1; i--) {
            output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
        }
        return output.join('');
    }

});
