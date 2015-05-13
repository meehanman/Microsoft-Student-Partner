// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                document.getElementById("sidebarLogo").addEventListener('click', function () { x = x + 1; getMixes(x, "", "dubstep", "popular", 1) }, false);
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();

    var x = 1;

    getMixes(x, "", "dubstep", "popular", 1);

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
                    var msg = new Windows.UI.Popups.MessageDialog("Error: No Results Found.");
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
                                    document.getElementById("recordTrack").src = json.mix.cover_urls.sq250;
                                    document.getElementById("backgroundimage").setAttributeNS('http://www.w3.org/1999/xlink', 'href', json.mix.cover_urls.max1024);
                                    //Sets artists and stuff    
                                    document.getElementById("MixName").innerText = json.mix.name;
                                    document.getElementById("SongArtist").innerText = json.mix.name;
                                    document.getElementById("SongName").innerText = json.mix.name;
                                    document.getElementById("profilePIC").src = json.mix.user.avatar_urls.sq72;

                                },
                                function (error) { },
                                function (progress) { }
                    );
    }

    function playURL(src) {
        var mus = document.getElementById("musicplayer");
        mus.src = src;
        mus.play();
    }

    //End of Document
})();
