(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            //Button Controls
            var mixfeedItem = document.getElementById("NAVmixfeed");
            mixfeedItem.addEventListener('click', getMixes(1, "", "", "popular", 20), false);

            //End Button Controls
            getMixes(1, "", "", "hot", 40);
            //var NavMixBtn = document.getElementById("NAVmixfeed");
            //NavMixBtn.addEventListener('click', getMixes(1, "", "", "hot", 20), false);

            //var NAVnew = document.getElementById("new");
            //NAVnew.addEventListener('click', getMixes(1, "", "", "popular", 20), false);
            
        }
    });

    function showMoreInfo() {
       
    }

    function getMixes(page, search, tag, sort, entries) {
        var mixes = "http://8tracks.com/mixes?format=json";
        var api_key = "&api_key=dc075b8838f98d6340f255775921191a95b6d631";
        page = "&page=" + page;
        search = "&q=" + search;
        tag = "&tag=" + tag;
        sort = "&sort=" + sort; //recent/popular/hot
        entries = "&per_page=" + entries;
        var requesturl = mixes + api_key + page + search + tag + sort + entries;
        WinJS.xhr({ url: requesturl }).then(
                                function (response) {
                                    var json = JSON.parse(response.responseText);
                                    var list = new WinJS.Binding.List(json.mixes);
                                    maingridview.winControl.itemDataSource = list.dataSource;
                                    maingridview.focus();
                                    //document.getElementById("msg").innerHTML = response.responseText;
                                },
                                function (error) { },
                                function (progress) { }
                    );
    }
})();
