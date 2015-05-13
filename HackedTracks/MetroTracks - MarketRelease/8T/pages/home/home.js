(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            searchTags("");
            getMixes(1, "", "", "hot", 20, 1);
            getMixes(1, "", "", "popular", 20, 2);
            //var NavMixBtn = document.getElementById("NAVmixfeed");
            //NavMixBtn.addEventListener('click', getMixes(1, "", "", "hot", 20), false);#

            //Testing EasterEgg ;) 
            document.getElementById("snaplogo").addEventListener('dblclick ', function () { nextsong("next") }, false);

            //Now Playing (NP)
            document.getElementById("npskipsong").addEventListener('click', function () { nextsong("skip") }, false);
            document.getElementById("npplaypause").addEventListener('click', function () { playpausetoggle() }, false);
            document.getElementById("npskipmix").addEventListener('click', function () { nextMIX() }, false);
            //Appbar
            document.getElementById("appbarskip").addEventListener('click', function () { nextsong("skip") }, false);
            document.getElementById("appbarplaypause").addEventListener('click', function () { playpausetoggle() }, false);
            document.getElementById("appbarmix").addEventListener('click', function () { nextMIX() }, false);
            //Snaped
            document.getElementById("snapskip").addEventListener('click', function () { nextsong("skip") }, false);
            document.getElementById("snapplaypause").addEventListener('click', function () { playpausetoggle() }, false);
            document.getElementById("snapmix").addEventListener('click', function () { nextMIX() }, false);
            
            document.getElementById("search1").addEventListener('click', function () {
                var searchbar = document.getElementById("url");
                var searchRes = searchbar.value;
                getMixes("", searchRes, "", "", "40", 3);
            }, false);

            //Search Events
            Windows.ApplicationModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (eventObject) {
                getMixes("", eventObject.queryText, "", "", "40", 3);
                getMixes("", eventObject.queryText, "", "", "40", 3);
            };
            document.getElementById("searchbar001").addEventListener('keypress', function (e) {
                if (e.keyCode == 13) {
                    var newsearch = document.getElementById("searchbar001").value;
                    getMixes("", newsearch, "", "", "40", 3);
                    document.getElementById("searchbar001").value = "Searching for " + newsearch + "..";
                }
            }, false);
            
            Windows.ApplicationModel.Search.SearchPane.getForCurrentView().onsuggestionsrequested = function (eventObject) {
                var queryText = eventObject.target.queryText;
                var suggestionRequest = eventObject.request;
                var maxNumberOfSuggestions = 5;
                var deferral = eventObject.request.getDeferral();
                if (suggestionRequest.length > 2) {
                    var tagurl = "http://" + "8tracks.com/tags.json?q=" + queryText + "&format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631";
                    WinJS.xhr({ url: tagurl }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    var suggestionList = ["One", "Two"];
                                    suggestionList.push(json.tags[0].name);
                                    suggestionList.push(json.tags[1].name);
                                    suggestionList.push(json.tags[2].name);
                                    suggestionList.push(json.tags[3].name);
                                    suggestionList.push(json.tags[4].name);
                                    suggestionRequest.searchSuggestionCollection.appendQuerySuggestions(suggestionList);
                                    deferral.complete();

                                    if (suggestionRequest.searchSuggestionCollection.size > 0) {
                                        WinJS.log && WinJS.log("Suggestions provided for query: " + queryText, "sample", "status");
                                    } else {
                                        WinJS.log && WinJS.log("No suggestions provided for query: " + queryText, "sample", "status");
                                    }
                                },
                                function (error) { },
                                function (progress) { }
                    );
                }
            }

            //ShareEvents
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.addEventListener("datarequested", function (e) {
                var request = e.request;
                request.data.properties.title = "Windows 8Tracks - Powered by 8tracks.com";
                request.data.setText("Check out this Mix. I'm Listening to '" + currentSongName + "' by '" + currentSongArtist + "' on Windows 8Tracks for Windows 8.           " + currentMIXURL);
            });
            //Grid Events
            document.getElementById("taggridview").winControl.addEventListener("iteminvoked", tagInvoked, false);
            document.getElementById("maingridview").winControl.addEventListener("iteminvoked", itemInvoked, false);
            document.getElementById("secondgridview").winControl.addEventListener("iteminvoked", itemInvoked, false);
            document.getElementById("thirdgridview").winControl.addEventListener("iteminvoked", itemInvoked, false);

            //Audio Events
            var mus = document.getElementById("musicplayr");
            mus.addEventListener('ontimeupdate', function () { advertisementpayment(currentSongID) }, false);
            mus.addEventListener('ended', function () { nextsong("next") }, false);

            //Audio Controls (BGMEDIA)
            // Assign the button object to MediaControls
            var MediaControls = Windows.Media.MediaControl;

            // Add event listeners for the buttons
            MediaControls.addEventListener("playpressed", play, false);
            MediaControls.addEventListener("pausepressed", pause, false);
            MediaControls.addEventListener("playpausetogglepressed", playpausetoggle, false); 
            MediaControls.addEventListener("stoppressed", pause, false);

            // Add event listeners for the audio element
            document.getElementById("musicplayr").addEventListener("playing", playing, false);
            document.getElementById("musicplayr").addEventListener("paused", paused, false);
            document.getElementById("musicplayr").addEventListener("ended", ended, false);
            //document.getElementById("alert1").addEventListener('onmouseover', function () { document.getElementById("alert1").style.color = "#000000"; },false);

            //var NAVnew = document.getElementById("new");
            //NAVnew.addEventListener('click', getMixes(1, "", "", "popular", 20), false);
            
        }
    });







    //Globals
    var currentMIXID = null;
    var currentMIXURL = null;
    var currentSongID = null;
    var currentSongName = "";
    var currentSongArtist = "";
    var currentSongURL = null;
    var currentSongBill = null;
    var playTokenGlobal = null;
    var tagcloud;
    var poptag;
    //End










    function getMixes(page, search, tag, sort, entries,loadposition) {
        //8tracks.com/mixes?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631&page=&q=&tag=&sort=&per_page=
        var SortText = sort;
        var mixes = "http://8tracks.com/mixes?format=json";
        var api_key = "&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        if (page == "") { page = ""; } else { page = "&page=" + page;}
        if (search == "") { search = ""; } else { search = "&q=" + search; }
        if (tag == "") { tag = "";}else{tag = "&tag=" + tag;}
        if (sort == "") { sort = "";}else{sort = "&sort=" + sort;} //recent/popular/hot
        if (entries == "") { entries = ""; } else { entries = "&per_page=" + entries; }
        //var requesturl = mixes + api_key + page + search + tag + sort + entries;
        var requesturl = (mixes + api_key + page + search + tag + sort + entries).toLowerCase();
        WinJS.xhr({ url: requesturl }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    var list = new WinJS.Binding.List(json.mixes);
                                    //Check if there are any results
                                    if (json.mixes[0] == undefined) {
                                        var msg = new Windows.UI.Popups.MessageDialog("Error: No Results Found.");
                                        msg.showAsync();
                                    } else {
                                        //
                                    if (loadposition == 1) {
                                        document.getElementById("TitleMain").innerText = SortText.charAt(0).toUpperCase() + SortText.slice(1) + " >";
                                        maingridview.winControl.itemDataSource = list.dataSource;

                                    } else if (loadposition == 2) {
                                        document.getElementById("TitleSecond").innerText = SortText.charAt(0).toUpperCase() + SortText.slice(1) + " >";
                                        secondgridview.winControl.itemDataSource = list.dataSource;
                                    } else if (loadposition == 3) {
                                         document.getElementById("TitleThird").innerText = "Search Results >";
                                         thirdgridview.winControl.itemDataSource = list.dataSource;
                                         document.getElementById("searchbar001").value = "";
                                    }
                                   
                                        backgroundmix(currentMIXID = json.mixes[1].id); //5 is middle of 3x3 array

                                    }
                                },
                                function (error) { },
                                function (progress) {
                                    if (loadposition == 3) {
                                        window.location.hash = '#thirdgridview';
                                    }
                                }
                    );
       
    }

    function searchTags(relatedTag) {
        if (relatedTag == "") {
            var tagurl = "http://" + "8tracks.com/tags" + "?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631&per_page=25";
        } else {
            var tagurl = "http://" + "8tracks.com/tags/related.json?tag=" + relatedTag + "&format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631&per_page=25";
        }
        WinJS.xhr({ url: tagurl }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    var list = new WinJS.Binding.List(json.tags);
                                    tagcloud = list;
                                    taggridview.winControl.itemDataSource = list.dataSource;
                                },
                                function (error) { },
                                function (progress) { }
                    );
    }



    function backgroundmix() {
        var url = "http://8tracks.com/mixes/" + currentMIXID + "?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        WinJS.xhr({ url: url }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    var imgurl = json.mix.cover_urls.original_url;
                                    //var x = document.body.style.backgroundImage = "url(" + imgurl + ")";
                                    // Step 1: Create the animation object and save the result
                                    var imagehost = document.getElementById("preloadimg");
                                    imagehost.src = imgurl;

                                    // Step 2: Insert the element given in the added parameter immediately before
                                    // the element given in the affected parameter. This causes both elements to move.
                                    imagehost.onload = function () {
                                        document.getElementById("imgbg").style.backgroundImage = "url(" + imgurl + ")";
                                        document.getElementById("imgNowPlaying").style.backgroundImage = "url(" + imgurl + ")";
                                        document.getElementById("imgNowPlaying1").style.backgroundImage = "url(" + imgurl + ")"; //Snaped View
                                        document.getElementById("artistnowplaying").innerText = currentSongArtist;
                                        document.getElementById("songnowplaying").innerText = currentSongName;
                                        document.getElementById("snapartistnowplaying").innerText = currentSongArtist;
                                        document.getElementById("snapsongnowplaying").innerText = currentSongName;
                                    };
                                    
                                    //document.body.style.backgroundImage = "url(" + imgurl + ")";
                                },
                                function (error) { },
                                function (progress) { }
                    );
        //
        //document.getElementById("imgbg").style.backgroundImage = "url("+imgurl+")";
        
    }
    function playMix(newMIXid) {
        //var play_Token = playToken();
        playToken(function (play_Token) {
        
            //var y = playToken();
            //var play_Token = document.getElementById("alert1").innerText;
            //8tracks.com/sets/23348144/play?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631&mix_id=1369461
            var Playurl = "http://8tracks.com/sets/";
            var api_key = "/play?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631";
            var mixid1 = "&mix_id=" + newMIXid;
            var requesturl = Playurl + play_Token + api_key + mixid1;
            WinJS.xhr({ url: requesturl }).then(
                                    function (response) {
                                        var json = JSON.parse(response.responseText);
                                        currentSongID = json.set.track.id;
                                        currentSongName = json.set.track.name;
                                        currentSongArtist = json.set.track.performer;
                                        currentSongURL = json.set.track.url;
                                        currentSongBill = false;
                                        getStartVideoFuntion(json.set.track.url, json.set.track.id);
                                        document.getElementById("url").value = currentMIXID;
                                        backgroundmix();
                                    },
                                    function (error) { },
                                    function (progress) { }
                        );
        });//End of playtoken private function
    }

    function nextsong(method) {
        //Method can be either next or skip
        //8tracks.com/sets/460486803/next.xml?mix_id=2000
        //                <playTokenGlobal>/next?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631&mix_id=<currentMIXID>
        var setsURL = "http://8tracks.com/sets/";
        var exp_api = "/"+method+"?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631&mix_id=";
        var requesturl = setsURL + playTokenGlobal + exp_api + currentMIXID;
        WinJS.xhr({ url: requesturl }).then(
                                   function (response) {
                                       var json = JSON.parse(response.responseText);
                                       if (json.set.at_end == false) {
                                           if (json.set.skip_allowed == true || method == "next") {
                                               currentSongID = json.set.track.id;
                                               currentSongName = json.set.track.name;
                                               currentSongArtist = json.set.track.performer;
                                               currentSongURL = json.set.track.url;
                                               document.getElementById("snapartistnowplaying").innerText = currentSongArtist;
                                               document.getElementById("snapsongnowplaying").innerText = currentSongName;
                                               document.getElementById("snapartistnowplaying").innerText = currentSongArtist;
                                               document.getElementById("snapsongnowplaying").innerText = currentSongName;
                                               currentSongBill = false;
                                               getStartVideoFuntion(json.set.track.url, json.set.track.id);
                                           } else {
                                               var msg = new Windows.UI.Popups.MessageDialog("Apologies for the inconvenience, but our music license requires us to limit the number of tracks you may skip each hour.");
                                               msg.showAsync();
                                           }
                                       } else {
                                           nextMIX();
                                       }
                                   },
                                   function (error) { },
                                   function (progress) { }
                       );
    }

    function nextMIX() {
        //When playback reaches the end of the mix, it's nice for 
        //users to redirect them to another similar mix so music keeps playing.
        //http://8tracks.com/sets/460486803/next_mix?format=json&mix_id=2000&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        var apikey = "&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        var exp_api = "/next_mix?format=json&mix_id=";
        var url = "http://8tracks.com/sets/" + playTokenGlobal + "/next_mix?format=json&mix_id=" + currentMIXID + "&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        WinJS.xhr({ url: url }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    currentMIXID = json.next_mix.id;
                                    currentMIXURL = json.next_mix.restful_url;
                                    playMix(json.next_mix.id);
                                },
                                function (error) { },
                                function (progress) { }
                    );
    }

    function advertisementpayment(_trackid) {
        var trackid     = _trackid;
        var mus = document.getElementById("musicplayr");
        //// setInterval(function () {
        ////     if (trackid == currentSongID && currentSongBill == false) {
        //if (mus.currentTime >= 30) {

        //var msg = new Windows.UI.Popups.MessageDialog(currentSongName + " " + currentSongArtist + " Paid For"); msg.showAsync(); currentSongBill = true;
        //}
        ////     }
        //// }, 30*1000);
        //document.getElementById("alert1") = mus.duration;
        mus.ontimeupdate = function () {
            if (mus.currentTime >= 30) {
                document.getElementById("alert2").innerText = (currentSongArtist + " - " + currentSongName + " Paid For"); currentSongBill = true
            }
        }
    }

    function playToken(play_Token) {
        var Tokenurl = "http://8tracks.com/sets/new?format=json";
        var api_key = "&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        //Example url 8tracks.com/sets/new?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631
        var requesturl = Tokenurl + api_key;
        if (playTokenGlobal == null || playTokenGlobal == false) {
            WinJS.xhr({ url: requesturl }).then(
                                    function (response) {
                                        var json = JSON.parse(response.responseText);
                                        /////document.getElementById("alert1").innerText = json.play_token;
                                        playTokenGlobal = json.play_token;
                                        play_Token(playTokenGlobal);
                                    },
                                    function (error) { },
                                    function (progress) { }
                        );
        } else {
            play_Token(playTokenGlobal);
        }
    }
    //MDSN TUT

    function itemInvoked(e) {
        //This runs on click of item
        currentMIXID = e.detail.itemPromise._value.data.id;
        currentMIXURL = e.detail.itemPromise._value.data.restful_url;
        playMix(currentMIXID);
        window.location.hash = '#playingsectionofpage';
    }
    function tagInvoked(e) {
        tagcloud.splice(e.detail.itemPromise._value.index, 1);
        
        if (document.getElementById("b1").innerText == "_________") {
            document.getElementById("b1").innerText = e.detail.itemPromise._value.data.name;
            searchTags(e.detail.itemPromise._value.data.name);
        }
        else if (document.getElementById("b2").innerText == "_________") {
            document.getElementById("b2").innerText = e.detail.itemPromise._value.data.name;
            var tag1 = document.getElementById("b1").innerText;
            var tag2 = document.getElementById("b2").innerText;
            getMixes(1, "", tag1 + "%2B" + tag2, "", 40, 3);
            window.location.hash = '#secondgridview';
            document.getElementById("b1").innerText = "_________";
            document.getElementById("b2").innerText = "_________";
            searchTags("");
        }
    }

    //xxCopy from MS
    function getStartVideoFuntion(src,trackid) {
       // return function () {
            // Set video element's source
        var mus = document.getElementById("musicplayr");
            mus.src = src;
            mus.play();
            advertisementpayment(trackid);
            //document.getElementById("url").innerText = src;
            var x = x + 1;
        //Run advertisements after 
         
       // };
    }
    //xxCopy from MS END

    //Audio Examples
    // Define functions that will be the event handlers
    function play() {
        document.getElementById("musicplayr").play();
    }
    function pause() {
        document.getElementById("musicplayr").pause();
    }

    function playpausetoggle() {
        if (currentSongID == null) { playMix(currentMIXID); }
        if( Windows.Media.MediaControl.isPlaying === true) {
            document.getElementById("musicplayr").pause();
            document.getElementById("npplaypause").winControl.icon = "play";
            document.getElementById("npplaypause").winControl.label = "Play";
            document.getElementById("appbarplaypause").winControl.icon = "play";
            document.getElementById("appbarplaypause").winControl.label = "Play";
            document.getElementById("snapplaypause").winControl.icon = "play";
            document.getElementById("snapplaypause").winControl.label = "Play";
            Windows.Media.MediaControl.isPlaying = false;
        } else if( Windows.Media.MediaControl.isPlaying === false) {
            document.getElementById("musicplayr").play();
            document.getElementById("npplaypause").winControl.icon = "pause";
            document.getElementById("npplaypause").winControl.label = "Pause";
            document.getElementById("appbarplaypause").winControl.icon = "pause";
            document.getElementById("appbarplaypause").winControl.label = "Pause";
            document.getElementById("snapplaypause").winControl.icon = "pause";
            document.getElementById("snapplaypause").winControl.label = "Pause";
            Windows.Media.MediaControl.isPlaying = true;
        }
    }

    function playing() {

        Windows.Media.MediaControl.isPlaying = true;
    }

    function paused() {
        Windows.Media.MediaControl.isPlaying = false;
    }

    function ended() {
        Windows.Media.MediaControl.isPlaying = false;
    }

    //End of AE
    //Seperating Values of tags
    function processtags() {
        var elm = document.getElementById('tagslist');
        elm.innerHTML = elm.innerHTML.replace(/, /g, '<br />');
        // Get all the input controls (can be any DOM element you would like)


        // Loop through all the DOM elements we grabbed
        for (var i = 0; i < inputs.length; i++) {

            // In this case we are looping through all the Dek Volume and then the Mcf volume boxes in the grid and not an individual one and totalling them
            if (inputs[i].name.indexOf("txtDekVolume") > 1) {
                if (inputs[i].value != "") {
                    totalDTH = totalDTH + parseInt(inputs[i].value);
                }

            }
            if (inputs[i].name.indexOf("txtMcfVolume") > 1) {
                if (inputs[i].value != "") {
                    totalMCF = totalMCF + parseInt(inputs[i].value);
                }
                //var myArray = myList.split(',');
            }
        }
    }



})();
