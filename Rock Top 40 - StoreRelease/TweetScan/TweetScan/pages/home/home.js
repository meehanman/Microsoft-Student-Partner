(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            //ShareEvents
            document.getElementById("refresh").addEventListener('click', function () { getitems(1) } , false);
            document.getElementById("priv").addEventListener("click", doAppBarCmd  , false);
            document.getElementById("reshare").addEventListener('click', function () { share() }, false);
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();

            // TODO: Initialize the page here.
            //http://roozo.ismywebsite.com/JSON/save/imgtest.txt
            //WinJS.xhr({ url: "http://search.twitter.com/search.json?q=%23windows8&rpp=100" }).then( // URL http://avalonfashions.ie/JSON/ut4.php http://search.twitter.com/search.json?q=%23windows8&rpp=100
            getitems()
        }
    });
    var list;
    var topart;
    var topsng;
    function getitems(requested) {
        if (requested == 1) { gridlistcontent1.winControl.itemDataSource = "";}
        WinJS.xhr({ url: "http://ut4.azurewebsites.net/rt4.php" }).then(
                            function (response) {
                                var json = JSON.parse(response.responseText);
                                list = new WinJS.Binding.List(json.entries);
                                gridlistcontent1.winControl.itemDataSource = list.dataSource;
                                document.getElementById("msg").innerText = ""
                                topart = list._keyMap[0].data.artist
                                topsng = list._keyMap[0].data.title
                                //  document.write("http://www.youtube.com/results?search_query=" + json.en " lyrics " + document.getElementById("song"));


                            },
                            function (error) { document.getElementById("msg").innerText = "Error: Please Close and try later"; },
                            function (progress) { document.getElementById("msg").innerText = "Progress: Downloaing awesome tunes! Please wait! "; }
                );
    }
    function doAppBarCmd() {
        var message = "The security of your personal information is important to us. We follow generally accepted industry standards to protect the personal information submitted to us, both during transmission and once we receive it. No method of transmission over the Internet, or method of electronic storage, is 100% secure. Therefore, we cannot guarantee its absolute security. If you have any questions about security on our Web site, you can contact us at d3an.meehan@hotmail.com We will retain your information for as long as your account is active or as needed to provide you services. If you wish to cancel your account or request that we no longer use your information to provide you services contact us at d3an.meehan@hotmail.com. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.";
        var message2 = "\n\n Basically we use your internet connection to download the UK Top 40 onto your machine as quick as possible and then show you it. We do collect your ip address, but we never do look at it and it wouldnt really tell us much apart from what time this random number accessed our site. We cannot key yourself to your ip address so there is nothing to be scared of! :) ";
        var alertDialog = new Windows.UI.Popups.MessageDialog(message + message2);
        alertDialog.showAsync();
    }

    var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
    dataTransferManager.addEventListener("datarequested", function (e) {
        var request = e.request;
        request.data.properties.title = "Share Title";
        request.data.setText("Share Text");
    });

})();
