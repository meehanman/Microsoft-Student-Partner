(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            //http://roozo.ismywebsite.com/JSON/save/imgtest.txt
            //WinJS.xhr({ url: "http://search.twitter.com/search.json?q=%23windows8&rpp=100" }).then( // URL http://avalonfashions.ie/JSON/ut4.php http://search.twitter.com/search.json?q=%23windows8&rpp=100
            //document.getElementById("gridlistcontent1").winControl.addEventListener("iteminvoked", itemInvoked, false);

            WinJS.xhr({ url: "http://ut4.azurewebsites.net/dt4.php" }).then(
                                function (response) {
                                        var json = JSON.parse(response.responseText);
                                        var list = new WinJS.Binding.List(json.entries);
                                        gridlistcontent1.winControl.itemDataSource = list.dataSource;
                                        first = json.entries[0].artist;
                                        second = json.entries[0].title;
                                        document.getElementById("msg").innerText = ""
                                      //  document.write("http://www.youtube.com/results?search_query=" + json.en " lyrics " + document.getElementById("song"));

                                },
                                function (error) { document.getElementById("msg").innerText = "Error: Please Close and try later"; },
                                function (progress) { document.getElementById("msg").innerText = "Progress: Downloaing awesome tunes! Please wait! "; }
                    );

            document.getElementById("cmd1").addEventListener("click", doAppBarCmd, false);
        }

    });
    var first;
    var second;
    var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
    dataTransferManager.addEventListener("datarequested", function (e) {
        var request = e.request;
        request.data.properties.title = "Dance Top 40";
        request.data.setText("I'm Listening to the UK Dance top 40 where "+first+" - "+second+" is #1");
    });


    //function itemInvoked(e) {
    //    WinJS.xhr({ url: e.detail.itemPromise._value.data.youtubelink }).then(
    //         function (response) {
    //             var str = response.responseText;
    //             str.replace("http://www.youtube.com/embed/", "%deanmeehan%");
    //             str.replace("\" frameborder=\"0", "%meehandean%");
    //             var str1 = str.search("%deanmeehan%");
    //             var str2 = str.search("%meehandean%");
    //             var str3 = str2 - str1;
    //             var ans = str.substr(str1 + 73, str3);
    //             document.getElementById("frame1").src = "";
    //             var n = str.split("=");
    //             var url = "http://www.youtube.com/embed/" + n[1];
    //             debugger;
    //             document.getElementById("frame1").src = url;
    //         });
        
    //}
    function doAppBarCmd() {
        var message = "The security of your personal information is important to us. We follow generally accepted industry standards to protect the personal information submitted to us, both during transmission and once we receive it. No method of transmission over the Internet, or method of electronic storage, is 100% secure. Therefore, we cannot guarantee its absolute security. If you have any questions about security on our Web site, you can contact us at d3an.meehan@hotmail.com We will retain your information for as long as your account is active or as needed to provide you services. If you wish to cancel your account or request that we no longer use your information to provide you services contact us at d3an.meehan@hotmail.com. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.";
        var message2 = "\n\n Basically we use your internet connection to download the UK Top 40 onto your machine as quick as possible and then show you it. We do collect your ip address, but we never do look at it and it wouldnt really tell us much apart from what time this random number accessed our site. We cannot key yourself to your ip address so there is nothing to be scared of! :) ";
        var alertDialog = new Windows.UI.Popups.MessageDialog(message + message2);
        alertDialog.showAsync();
    }




})();
