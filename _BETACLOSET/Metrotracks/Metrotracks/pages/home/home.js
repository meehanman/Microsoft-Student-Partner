(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            getMixes(1, "", "", "popular", 1);
        }

    });

    function getMixes(page, search, tag, sort, entries) {
        //Gets the mixes from the API and returns this to the specifified location
        var SortText = sort;
        var selectedPage = page;
        var mixes = "http://8tracks.com/mixes?format=json";
        var api_key = "&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        var saveBrowse = "&safe_browse=1"; //?safe_browse=1
        if (page == "") { page = ""; } else { page = "&page=" + page; }
        if (search == "") { search = ""; } else { search = "&q=" + search; }
        if (tag == "") { tag = ""; } else { tag = "&tag=" + tag; }
        if (sort == "") { sort = ""; } else { sort = "&sort=" + sort; } //recent/popular/hot
        if (entries == "") { entries = ""; } else { entries = "&per_page=" + entries; }
        var requesturl = (mixes + api_key + page + search + tag + sort + entries + saveBrowse).toLowerCase();
        WinJS.xhr({ url: requesturl }).then(
            function (response) {
                var json = JSON.parse(response.responseText);
                var list = new WinJS.Binding.List(json.mixes);
                //Check if there are any results
                if (json.mixes[0] == undefined) {
                   // var msg = new Windows.UI.Popups.MessageDialog("Error: No Results Found.");
                    msg.showAsync();
                } else {
                        //maingridview.winControl.itemDataSource = list.dataSource;

                    //Sets current song to first song in last loaded grid
                    backgroundmix(json.mixes[0].id);

                }
            },
            function (error) {
                document.getElementById("noloaderror").style.display = "block";
                document.getElementById("contenthost").style.display = "none";
            },
            function (progress) { }
        );

    }

    function backgroundmix(currentMIXID) {
        //This Function Sets all the Images and Labels for Music currently playing
        var url = "http://8tracks.com/mixes/" + currentMIXID + "?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        WinJS.xhr({ url: url }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    //document.body.style.backgroundImage = "url(" + json.mix.cover_urls.max1024 + ")";
                                    //document.getElementById("recordTrack").src = json.mix.cover_urls.sq250;
                                    //Sets artists and stuff    
                                    document.getElementById("MixName").innerText = json.mix.name;
                                    document.getElementById("SongArtist").innerText = json.mix.name;
                                    document.getElementById("SongName").innerText = json.mix.name;

                                },
                                function (error) { },
                                function (progress) { }
                    );
    }

//End of Document
})();
