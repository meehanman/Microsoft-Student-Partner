(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        ////System URL Example
        //processed: function (element, uri) {
        //    // During an initial activation this event is called before the system splash screen is torn down.
        //    // Uri is the parameter passed to navigation in the activated event handler.
        //    if (uri) {
        //        WinJS.log && WinJS.log("Protocol activation received. The received URI is " + uri.rawUri + ".", "sample", "status");
        //    }
        //},

        ////End o fExamplme



        ready: function (element, options) {
            

            //Populate Tagbox, Popular and Hot
            searchTags("");
            getMixes(1, "", "", "hot", 20, 2);
            getMixes(1, "", "", "popular", 20, 1);

            //Facebook Messaging
            message();

            //Login
            login("meehanman", "thisismypassword");

            //Pin Currnet Mix
            document.getElementById("PinMe").addEventListener('click', function () { pinSecondaryTile() }, false);

            //Playto
            document.getElementById("musicplayr").msPlayToSource.connection.addEventListener("statechanged", playToSrcStateChangeHandler);
            document.getElementById("musicplayr").msPlayToSource.connection.addEventListener("error", playToSrcErrorHandler);

            //Now Playing
            document.getElementById("npskipsong").addEventListener('click', function () { nextsong("skip") }, false);
            document.getElementById("npplaypause").addEventListener('click', function () { playpausetoggle() }, false);
            document.getElementById("npskipmix").addEventListener('click', function () { nextMIX() }, false);
            //Appbar
            document.getElementById("appbarskip").addEventListener('click', function () { nextsong("skip") }, false);
            document.getElementById("appbarplaypause").addEventListener('click', function () { playpausetoggle() }, false);
            document.getElementById("appbarmix").addEventListener('click', function () { nextMIX() }, false);
            document.getElementById("facebooklike").addEventListener('click', function () { window.open('http://www.facebook.com/MetroTracks', '_self', false) }, false);
            document.getElementById("appbarlike").addEventListener('click', function () { togglelike() }, false);
            //Snaped
            document.getElementById("snapskip").addEventListener('click', function () { nextsong("skip") }, false);
            document.getElementById("snapplaypause").addEventListener('click', function () { playpausetoggle() }, false);
            document.getElementById("snapmix").addEventListener('click', function () { nextMIX() }, false);
            

            /////SEARCH
            //UI Search
            document.getElementById("devSearch").addEventListener('click', function () {
                var searchbar = document.getElementById("url");
                var searchRes = searchbar.value;
                getMixes("", searchRes, "", "", "40", 3); //Searches Tag
            }, false);    
            //Windows 8 Search Event
            Windows.ApplicationModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (eventObject) {
                var newsearch = eventObject.queryText;
                getMixes("", newsearch, "", "", "40", 3);
            };
            //Primary Search
            document.getElementById("SearchBar").addEventListener('keypress', function (e) {
                if (e.keyCode == 13) {
                    var newsearch = document.getElementById("SearchBar").value;
                    getMixes("", newsearch, "", "", "40", 3); //Searches Tag
                    document.getElementById("SearchBar").value = "Searching for " + newsearch + "..";
                }
            }, false);
            /////SEARCH


            //Windows 8 Share Event
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.addEventListener("datarequested", function (e) {
                var request = e.request;
                request.data.properties.title = "MetroTracks - Powered by 8tracks.com";
                request.data.setText("Check out this Mix. I'm Listening to '" + currentSongName + "' by '" + currentSongArtist + "' on MetroTracks for Windows 8.           " + currentMIXURL);
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
            Windows.Media.MediaControl.addEventListener("nexttrackpressed", function () { }, false);

            // Add event listeners for the audio element
            document.getElementById("musicplayr").addEventListener("playing", playing, false);
            document.getElementById("musicplayr").addEventListener("paused", paused, false);
            document.getElementById("musicplayr").addEventListener("ended", ended, false);
            //document.getElementById("alert1").addEventListener('onmouseover', function () { document.getElementById("alert1").style.color = "#000000"; },false);

            //var NAVnew = document.getElementById("new");
            //NAVnew.addEventListener('click', getMixes(1, "", "", "popular", 20), false);
            
        }
    });







    //Global Variables
    var currentMIXID = null;
    var currentMIXNAME = "";
    var currentMIXURL = null;
    var currentSongID = null;
    var currentSongName = "";
    var currentSongArtist = "";
    var currentSongBGURL = "";
    var currentSongURL = null;
    var currentSongBill = null;
    var playTokenGlobal = null;
    var userTokenGlobal = null;
    var tagcloud; //The array of the tag cloud (after processed initially)
    var bannedWords = new Array("sex","cunt","fuck", "shit", "nude", "dirty"); //Words that are banned for the tags
    //End











    //Login
    function login(username, password) {
        //username = "&login=" + username;
        //password = "&password=" + password;
        var LoginData = "login="+username+"&password="+password;
        var loginurl = "http://" + "8tracks.com/sessions.json" + "?api_key=dc075b8838f98d6340f255775921191a95b6d631";// + username + password;
        WinJS.xhr({
            type: "POST", url: loginurl, headers: { "Content-type": "multipart/form-data" }, data: LoginData
        }).then(
            function (response) {
                var json = JSON.parse(response.responseText);
                console.log(response.responseText);
                document.getElementById("TitlePlay").innerText = "Welcome " + json.current_user.slug;
                userTokenGlobal = json.user_token;
            },
            function (error) {
                var json = JSON.parse(error.responseText);
                console.log(error.responseText);
                debugger;
            },
            function (progress) { }
        );
    }


    //Facebook Message thats got on load! :)
    function message() {
        WinJS.xhr({ url: "http://ut4.azurewebsites.net/MetroTracks.php" }).then(
            function (response) {
                var json = JSON.parse(response.responseText);
                if (json.likeonfacebook != "") {
                    document.getElementById("facebookmessage").innerText = json.likeonfacebook;
                    document.getElementById("messagecontent").style.display = "inline";
                }
            },
            function (error) { },
            function (progress) { }
        );
    }



    function getMixes(page, search, tag, sort, entries, loadposition) {
        //Gets the mixes from the API and returns this to the specifified location
        var SortText = sort;
        var selectedPage = page;
        var mixes = "http://8tracks.com/mixes?format=json";
        var api_key = "&api_key=dc075b8838f98d6340f255775921191a95b6d631"; 
        var saveBrowse = "&safe_browse=1"; //?safe_browse=1
        if (page == "") { page = ""; } else { page = "&page=" + page;}
        if (search == "") { search = ""; } else { search = "&q=" + search; }
        if (tag == "") { tag = "";}else{tag = "&tag=" + tag;}
        if (sort == "") { sort = "";}else{sort = "&sort=" + sort;} //recent/popular/hot
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
                if (loadposition == 1) {
                    document.getElementById("TitleMain").innerText = SortText.charAt(0).toUpperCase() + SortText.slice(1) + " >";
                    document.getElementById("TitleMain").title = "Goto Page " + (selectedPage + 1);
                    maingridview.winControl.itemDataSource = list.dataSource;

                } else if (loadposition == 2) {
                    document.getElementById("TitleSecond").innerText = SortText.charAt(0).toUpperCase() + SortText.slice(1) + " >";
                    secondgridview.winControl.itemDataSource = list.dataSource;
                } else if (loadposition == 3) {
                    document.getElementById("TitleThird").innerText = "Search Results >" + search.replace("&q=", " ").replace("%2B", " ") + tag.replace("&tag=", " ").replace("%2B", " ");
                        thirdgridview.winControl.itemDataSource = list.dataSource;
                        document.getElementById("SearchBar").value = "";
                            window.location.hash = '#thirdgridview';
                } else if (loadposition == 4) {
                    searchgridview.winControl.itemDataSource = list.dataSource;
                }
                    //Sets current song to first song in last loaded grid
                    backgroundmix(currentMIXID = json.mixes[0].id); 

                }
            },
            function (error) {
                document.getElementById("noloaderror").style.display = "block";
                document.getElementById("contenthost").style.display = "none";
            },
            function (progress) { }
        );
       
    }

    function searchTags(relatedTag) {
        //This function shows the tags, and if there already is a tag choosen, gets a simular one
        if (relatedTag == "") {
            var tagurl = "http://" + "8tracks.com/tags?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631&per_page=30";
        } else {
            var tagurl = "http://" + "8tracks.com/tags/related.json?tag=" + relatedTag + "&format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631&per_page=30";
            }
        WinJS.xhr({ url: tagurl }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    var list = new WinJS.Binding.List(json.tags);
                                    var TotalTags = list.length-1;
                                    var totalBannedWords = bannedWords.length-1;
                                    //Checks for Naughty Words ;)
                                    while (TotalTags >= 0) {
                                        while (totalBannedWords >= 0) {
                                            if (list._keyMap[TotalTags].data.name == bannedWords[totalBannedWords]) { //If It ='s a rude word
                                                list.splice(TotalTags, 1); //Slice it at its location
                                                if (TotalTags >= 0) { TotalTags - 1; totalBannedWords = 0;}
                                            }
                                            //Else Do Nothing
                                            totalBannedWords--;
                                        }
                                        totalBannedWords = bannedWords.length-1;
                                        TotalTags--;
                                    }
                                    //Trys to ensure tags stick at 25
                                    while (list.length > 25) { list.pop(); }
                                    //Assigns to the Gridview
                                    taggridview.winControl.itemDataSource = list.dataSource;
                                    tagcloud = list;
                                },
                                function (error) { },
                                function (progress) { }
                    );
    }



    function backgroundmix() {
        //This Function Sets all the Images and Labels for Music currently playing
        var url = "http://8tracks.com/mixes/" + currentMIXID + "?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        WinJS.xhr({ url: url }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    var imgurl = json.mix.cover_urls.original_url;
                                    //var x = document.body.style.backgroundImage = "url(" + imgurl + ")";
                                    // Step 1: Create the animation object and save the result
                                    var imagehost = document.getElementById("preloadimg");
                                    imagehost.src = imgurl;
                                    currentSongBGURL = json.mix.cover_urls.sq250;

                                    // Step 2: Insert the element given in the added parameter immediately before
                                    // the element given in the affected parameter. This causes both elements to move.
                                    imagehost.onload = function () {
                                        document.getElementById("imgbg").style.backgroundImage = "url(" + imgurl + ")";
                                        document.getElementById("imgNowPlaying").style.backgroundImage = "url(" + imgurl + ")";
                                        document.getElementById("imgNowPlaying1").style.backgroundImage = "url(" + imgurl + ")"; //Snaped View
                                        //Media Controls (On new song change album art)
                                       // Windows.Media.MediaControl.albumArt = encodeURIComponent(imgurl);
                                        // Setting artistName and trackName
                                        //fileObject.properties.getMusicPropertiesAsync().then(function (musicProperties) {
                                            Windows.Media.MediaControl.artistName = currentSongArtist;
                                            Windows.Media.MediaControl.trackName = currentSongName;
                                            document.location;
                                            var uri = new Windows.Foundation.Uri('ms-appx:///images/logo.png');
                                            Windows.Media.MediaControl.albumArt = uri;
                                        //});

                                        //Sets artists and stuff
                                        document.getElementById("mixnowplaying").innerText = currentMIXNAME;
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
    function togglelike() {
        var Playurl = "http://8tracks.com/mixes/"+currentMIXID+"/toggle_like.json";
        var api_key = "?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        if (userTokenGlobal != null) { var userToken = "&user_token=" + userTokenGlobal; } else { var userToken = ""; }
        var requesturl = Playurl + api_key + userToken;
        WinJS.xhr({ url: requesturl }).then(
                                    function (response) {
                                        var json = JSON.parse(response.responseText);
                                        //Like mix button
                                        if (json.mix.liked_by_current_user == true) {
                                            document.getElementById("appbarlike").winControl.label = "Liked";
                                        } else {
                                            document.getElementById("appbarlike").winControl.label = "Not Liked";
                                        }
                                    },
                                    function (error) { },
                                    function (progress) { }
                        );
    }
    function playMix(newMIXid) {
        //var play_Token = playToken();
        playToken(function (play_Token) {
            document.getElementById("appbarlike").winControl.label = "Like Mix";
            //var y = playToken();
            //var play_Token = document.getElementById("alert1").innerText;
            //8tracks.com/sets/23348144/play?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631&mix_id=1369461
            var Playurl = "http://8tracks.com/sets/";
            var api_key = "/play?format=json&api_key=dc075b8838f98d6340f255775921191a95b6d631";
            var mixid1 = "&mix_id=" + newMIXid;
            if (userTokenGlobal != null) { var userToken = "&user_token=" + userTokenGlobal; } else { var userToken = "";}
            var requesturl = Playurl + play_Token + api_key + mixid1 + userToken;
            WinJS.xhr({ url: requesturl }).then(
                                    function (response) {
                                        var json = JSON.parse(response.responseText);
                                        currentSongID = json.set.track.id;
                                        currentSongName = json.set.track.name;
                                        currentSongArtist = json.set.track.performer;
                                        currentSongURL = json.set.track.url;
                                        currentSongBill = false;
                                        backgroundmix();
                                        getStartVideoFuntion(json.set.track.url);
                                        document.getElementById("url").value = currentMIXID;
                                        //Enable skip key if allowed
                                        document.getElementById("npskipsong").style.opacity = "1";
                                        document.getElementById("snapskip").style.opacity = "1";
                                        //Set all Elements to say Pause. Since the music is now playing
                                        play();
                                        //End
                                    },
                                    function (error) { },
                                    function (progress) { }
                        );
        });//End of playtoken private function
    }

    function nextsong(method) {
        //Method can be either next or skip
        //8tracks.com/sets/460486803/next.xml?mix_id=2000
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
                        document.getElementById("mixnowplaying").innerText = currentMIXNAME;
                        document.getElementById("artistnowplaying").innerText = currentSongArtist;
                        document.getElementById("songnowplaying").innerText = currentSongName;
                        document.getElementById("snapartistnowplaying").innerText = currentSongArtist;
                        document.getElementById("snapsongnowplaying").innerText = currentSongName;
                        currentSongBill = false;
                        getStartVideoFuntion(json.set.track.url);
                        //Enable skip key if allowed
                        document.getElementById("npskipsong").style.opacity = "1";
                        document.getElementById("snapskip").style.opacity = "1";
                        Windows.Media.MediaControl.addEventListener("nexttrackpressed", function () { nextsong("next") }, false);
                        //Set all Elements to say Pause. Since the music is now playing
                        play();
                        //End
                    } else {
                        var msg = new Windows.UI.Popups.MessageDialog("Apologies for the inconvenience, but our music license requires us to limit the number of tracks you may skip each hour.");
                        msg.showAsync();
                        //Disable to keys when skipping not allowed
                        document.getElementById("npskipsong").style.opacity = "0.05";
                        document.getElementById("snapskip").style.opacity = "0.05";
                        Windows.Media.MediaControl.removeEventListener("nexttrackpressed", function () { nextsong("next") });
                    }
                    //if at end of mix
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
        //8tracks.com/sets/460486803/next_mix?format=json&mix_id=2000&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        var apikey = "&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        var exp_api = "/next_mix?format=json&mix_id=";
        var url = "http://8tracks.com/sets/" + playTokenGlobal + "/next_mix?format=json&mix_id=" + currentMIXID + "&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        WinJS.xhr({ url: url }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    currentMIXID = json.next_mix.id;
                                    currentMIXNAME = json.next_mix.name;
                                    currentMIXURL = json.next_mix.restful_url;
                                    playMix(json.next_mix.id);
                                },
                                function (error) { },
                                function (progress) { }
                    );
    }

    //Handles the paying of a song
    function advertisementpayment() {
        var mus = document.getElementById("musicplayr");
        mus.ontimeupdate = function () {
            if (mus.currentTime >= 30) {
                var url = "http://" + "8tracks.com/sets/874076615/report.xml?track_id=" + currentSongID + "&mix_id=" + currentMIXID;
                WinJS.xhr({ url: url }).then(
                                function (response) {},
                                function (error) { },
                                function (progress) { }
                    );
                currentSongBill = true
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

    //This runs on click of item 
    function itemInvoked(e) {
        currentMIXID = e.detail.itemPromise._value.data.id;
        currentMIXNAME= e.detail.itemPromise._value.data.name
        currentMIXURL = e.detail.itemPromise._value.data.restful_url;
        playMix(currentMIXID);
        window.location.hash = '#playingsectionofpage';
    }
    //This runs on click of a tag
    function tagInvoked(e) {
        tagcloud.splice(e.detail.itemPromise._value.index, 1);
        
        if (document.getElementById("b1").innerText == "_________") {
            document.getElementById("b1").innerText = e.detail.itemPromise._value.data.name;
            searchTags(e.detail.itemPromise._value.data.name);
            //getMixes(1, "", document.getElementById("b1").innerText, "", 8, 4);
        }
        else if (document.getElementById("b2").innerText == "_________") {
            document.getElementById("b2").innerText = e.detail.itemPromise._value.data.name;
            var tag1 = document.getElementById("b1").innerText;
            var tag2 = document.getElementById("b2").innerText;
            //getMixes(1, "", tag1 + "%2B" + tag2, "", 8, 4);
            getMixes(1, "", tag1 + "%2B" + tag2, "", 40, 3);
            var testlist = new Array(24);
            thirdgridview.winControl.itemDataSource = testlist.dataSource;
            window.location.hash = '#secondgridview';
            document.getElementById("b1").innerText = "_________";
            document.getElementById("b2").innerText = "_________";
            searchTags("");
        }
    }
  
    //Play music to <audio> tag
    function getStartVideoFuntion(src) {
        var mus = document.getElementById("musicplayr");
            mus.src = src;
            mus.play();
            advertisementpayment();
    }

    // Define functions that will be the event handlers for the Audio Controls
    function play() {
        document.getElementById("musicplayr").play();
        document.getElementById("npplaypause").winControl.icon = "pause";
        document.getElementById("npplaypause").winControl.label = "Pause";
        document.getElementById("appbarplaypause").winControl.icon = "pause";
        document.getElementById("appbarplaypause").winControl.label = "Pause";
        document.getElementById("snapplaypause").winControl.icon = "pause";
        document.getElementById("snapplaypause").winControl.label = "Pause";
        Windows.Media.MediaControl.isPlaying = true;
    }
    function pause() {
        document.getElementById("musicplayr").pause();
        document.getElementById("npplaypause").winControl.icon = "play";
        document.getElementById("npplaypause").winControl.label = "Play";
        document.getElementById("appbarplaypause").winControl.icon = "play";
        document.getElementById("appbarplaypause").winControl.label = "Play";
        document.getElementById("snapplaypause").winControl.icon = "play";
        document.getElementById("snapplaypause").winControl.label = "Play";
        Windows.Media.MediaControl.isPlaying = false;
    }

    function playpausetoggle() {
        if (currentSongID == null) { playMix(currentMIXID); }
        if( Windows.Media.MediaControl.isPlaying === true) {
            pause();
        } else if( Windows.Media.MediaControl.isPlaying === false) {
            play();
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

    //PlaytoFunctions
    function id(elementId) {
        return document.getElementById(elementId);
    }
    function playToSrcStateChangeHandler(eventIn) {
        var states = Windows.Media.PlayTo.PlayToConnectionState;
        if (eventIn.currentState === states.disconnected) {
            WinJS.log && WinJS.log("PlayTo connection state: Disconnected", "sample", "status");
        } else if (eventIn.currentState === states.connected) {
            WinJS.log && WinJS.log("PlayTo connection state: Connected", "sample", "status");
        } else if (eventIn.currentState === states.rendering) {
            WinJS.log && WinJS.log("PlayTo connection state: Rendering", "sample", "status");
        }
    }
    function playToSrcErrorHandler(eventIn) {
        WinJS.log && WinJS.log("PlayTo connection error: " + eventIn.message, "sample", "error");
    }
    function handleError(error) {
        WinJS.log && WinJS.log("Error: " + error.message, "sample", "error");
    }
    function playWebContent() {
        var localVideo = document.getElementById("musicplayr");
        localVideo.src = currentSongURL;
        localVideo.play();
    }
    //End of Playto Function



})();