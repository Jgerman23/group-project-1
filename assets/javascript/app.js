$(document).ready(function () {
    console.log("ready to go");


    
    $("#topic-search").on("click", function (event) {
        // console.log("search");
        var topic = $("#topic-input").val().trim();
        retrieveData(topic);
    });

    var retrieveData = function (topic) {
        console.clear();
        console.log("retrieve data: " + topic);
        
        //https://developers.google.com/youtube/v3/docs/search/list
        var part = "snippet";
        var q = topic + "-trailer";
        var apiKey = "AIzaSyAOaGuq-aF8SJE8pVwGS_NQ7tL9-yEXn84";
        var maxResults = 1;
        var channelType = "show";
        var safeSearch = "strict";
        var videoDefinition = "high";
        var videoLicense = "youtube";
        var safeSearch = "strict";
        var videoCategoryId = "30"; //https://gist.github.com/dgp/1b24bf2961521bd75d6c

        //together
        var type = "video";
        var videoType = "movie";

        var queryURL = "https://www.googleapis.com/youtube/v3/search?part="
            + part
            + "&q=" + q
            // + "&videoCategoryId=" + videoCategoryId
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
            var responseString = JSON.stringify(response, '', 2);
            // console.log(responseString);

            console.log(response.items.length);
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
                // iframe.attr("src", "https://youtube.com/watch?v=" + data.id.videoId + "&output=embed");
                iframe.attr("src", "https://youtube.com/embed/" + data.id.videoId);
                iframe.appendTo("body");
                var link = $('<a>', {
                    // text: data.snippet.title,
                    target: '_new',
                    href: "https://youtube.com/watch?v=" + data.id.videoId,
                }).appendTo('body');

                tRow.append(iframe);
                


                $("#topic-result").append(tRow);
            }
        });
    }


})