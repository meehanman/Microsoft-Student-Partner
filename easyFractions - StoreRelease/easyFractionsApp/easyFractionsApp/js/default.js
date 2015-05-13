// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509

(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {

            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
            // Retrieve the button and register our event handler. 
            var ButtonwithIDbtneq = document.getElementById("btneq");
            ButtonwithIDbtneq.addEventListener("click", getanswerbutton, false);

            //var testbutton = document.getElementById("clearButton");
            //testbutton.addEventListener("click", function () { clearall("inputs"); }, false)


        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is auto matically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };
	//Event handers, basicly functions
    function getanswerbutton(eventInfo) {
		var inputfratop = document.getElementById("fratop").value;
		var inputfrabot = document.getElementById("frabot").value;
		var outputfraans = inputfratop + "/" + inputfrabot;
		var bottomwidth = inputfratop / inputfrabot * 100;

        //Valadation if number above -1
		if ((inputfratop != "" && inputfrabot != "") && ((inputfratop >= 0 && inputfrabot >= 0) && (inputfratop <= 100 && inputfrabot <= 100)) && (bottomwidth <= 100))
		{
		    //Remove Error Message if there is any
		    document.getElementById("error1").innerText = "";
		    //Gets the input text of the textbox with id fraans and sets it to the value set about inputfraans
		    //document.getElementById("fraans").value = outputfraans;
		    //document.getElementById("fraans").focus;
		    //Clear any previous outputed information
		    clearall("HTML")
		    //Calculated this percentage
		    var bottomwidtha = inputfratop / inputfrabot;
		    var bottomwidth = inputfratop / inputfrabot * 100;
		    //Displays the percentage in a bar
		    document.getElementById("bottom").style.width = bottomwidth + "%";
		    //Places the percentage at the end
		    document.getElementById("bottom").innerHTML = "<b>" + bottomwidth.toFixed(0) + "% </b>";
		    //WinJS.UI.Animation.enterContent(content, startingPosition).done()
		    WinJS.UI.Animation.enterContent(Top, { top: "0px", left: "-13px" }).done()
		    WinJS.UI.Animation.enterContent(bottom, { top: "0px", left: "-13px" }).done()
		    //Displaying Raw Data
		    var rawmessage = "To find the percentage, divide the top number (" + inputfratop + ") by the bottom (" + inputfrabot + ") and multiply by 100! ";
		    rawmessage = rawmessage + "<br>(" + inputfratop + " ÷ " + inputfrabot + ") = " + bottomwidtha.toFixed(2);
		    rawmessage = rawmessage + "<br> Thats (" + bottomwidtha.toFixed(2) + ") x 100 = " + bottomwidth.toFixed(0) + "%";
		    document.getElementById("rawcalc").innerHTML = (rawmessage);
		    //Forming the Pie Chart
		    //document.getElementById("pieSlice1").style.transform = "transform:rotate(" + bottomwidth.toFixed(2) + "deg)";
		    var rotation = "rotate(" + 3.6*(bottomwidth.toFixed(0)) + "deg)";
		    document.getElementById("piechart001").style.transform = rotation;
		    if (3.6 * (bottomwidth.toFixed(0)) < 180) {
		        //background-color: #dd7400; = ORANGE        #FFFFFF = WHITE
		        document.getElementById("piechart001").style.backgroundColor = "#FFFFFF";
		        document.getElementById("piechart002").style.backgroundColor = "#dd7400";
		    } else {
		        document.getElementById("piechart001").style.backgroundColor = "#dd7400";
		        document.getElementById("piechart002").style.backgroundColor = "#FFFFFF";
		    }
		    document.getElementById("pieContainer").style.visibility = "Visible";
		    //End Pie Chart
		    //Start Smallest Common Deminator
		    var Div, frac, zxc0;
		        Div=1;
		        frac = new Array();
		        frac[0] = inputfratop;
		        frac[1] = inputfrabot;
		        for (zxc0=1;zxc0<100;zxc0++){
		            if (frac[0]%zxc0==0&&frac[1]%zxc0==0){
		                Div=zxc0;
		            }
		        }
		        var simpleHTML = new Array(); simpleHTML[1] = "Your Fraction Simplyfied:<div style=\"text-align:center; font-size:60px;\">"; simpleHTML[2] = "</div>";
		        document.getElementById('simplefraction').innerHTML = simpleHTML[1] + (frac[0] / Div) + '/' + (frac[1] / Div) + simpleHTML[2];
		    //Display the writing
		        var word = new Array()
		        frac[2] = (frac[0] / Div);
		        frac[3] = (frac[1] / Div);

		        if (frac[2] < 21 && frac[3] < 21) {
		            firstnum(frac[2].toString())
		            secondnum(frac[2], frac[3].toString())
		        } else {
		            document.getElementById('simplefractiontext').innerHTML = "";
		        }
		        //if (frac[2].toString().length >20) {
		        //    firstnum(frac[2])
		        //} else {
		        //    firstnum(frac[2].toString().charAt(0))
		       // if (frac[3].toString().length >20) {
		       //     secondnum(frac[2], frac[3])
		       // } else {
		        //    secondnum(frac[2], frac[3].toString().charAt(0))
		       //     secondnum(frac[2], frac[3].toString().charAt(1))
		      //  }
		           
		    //Display One Twelth
		           //document.getElementById('simplefractiontext').innerHTML = word[1] + " " + word[2];
		}
		else
        {
		    document.getElementById("error1").innerText = ("The input must be between 0 and 100 and equal less than 1. Your input was not correct. Input was {" + inputfratop + "} and {" + inputfrabot + "}");
		    document.getElementById("fratop").value = 1;
		    document.getElementById("frabot").value = 2;
		}
    }//END getAnsButton
    function clearall(job) {
        //Job can be all, HTML or inputs
        if (job == "inputs") {
            //Clears Everything first the inputs
            document.getElementById("fratop").value = "";
            document.getElementById("frabot").value = "";
            document.getElementById("fraans").value = "";

        }
        else if (job == "HTML") {
            //Now the HTML
            //document.getElementById("top").innerHTML = "";
            //document.getElementById("bottom").innerHTML = "";
        }
        else {
            //Clears Everything first the inputs
            document.getElementById("fratop").value = "";
            document.getElementById("frabot").value = "";
            document.getElementById("fraans").value = "";
            //Now the HTML
            document.getElementById("top").innerHTML = "";
            document.getElementById("bottom").innerHTML = "";
        }
    }
    function firstnum(input) {
        var output;
        switch (input) {
            case "1":
                output = "one";
                break;
            case "2":
                output = "two";
                break;
            case "3":
                output = "three";
                break;
            case "4":
                output = "four";
                break;
            case "5":
                output = "five";
                break;
            case "6":
                output = "six";
                break;
            case "7":
                output = "seven";
                break;
            case "8":
                output = "eight";
                break;
            case "9":
                output = "nine";
                break;
            case "10":
                output = "ten";
                break;
            case "11":
                output = "eleven";
                break;
            case "12":
                output = "twelve";
                break;
            case "13":
                output = "thirteen";
                break;
            case "14":
                output = "fourteen";
                break;
            case "15":
                output = "fifteen";
                break;
            case "16":
                output = "sixteen";
                break;
            case "17":
                output = "seventeen";
                break;
            case "18":
                output = "eightteen";
                break;
            case "19":
                output = "nineteen";
                break;
            case "20":
                output = "twenty";
                break;
            case "30":
                output = "thrity";
                break;
            case "40":
                output = "fourty";
                break;
            case "50":
                output = "fifty";
                break;
            case "60":
                output = "sixty";
                break;
            case "70":
                output = "seventy";
                break;
            case "80":
                output = "eighty";
                break;
            case "90":
                output = "ninety";
                break;
            case "100":
                output = "one hundreth";
                break;
           defaut:
                output = "";
                break;
        }
        if (output == undefined) { output = "";}
        document.getElementById('simplefractiontext').innerHTML = output;
    }
    function secondnum(prev, input) {
        var output;
        switch (input) {
            
            case "1":
                output = "whole";
                break;
            case "2":
                output = "half";
                break;
            case "3":
                output = "third";
                break;
            case "4":
                output = "fourth";
                break;
            case "5":
                output = "fifth";
                break;
            case "6":
                output = "sixth";
                break;
            case "7":
                output = "seventh";
                break;
            case "8":
                output = "eightth";
                break;
            case "9":
                output = "nineth";
                break;
            case "10":
                output = "tenth";
                break;
            case "11":
                output = "eleventh";
                break;
            case "12":
                output = "twelveth";
                break;
            case "13":
                output = "thirteenth";
                break;
            case "14":
                output = "fourteenth";
                break;
            case "15":
                output = "fifteenth";
                break;
            case "16":
                output = "sixteenth";
                break;
            case "17":
                output = "seventeenth";
                break;
            case "18":
                output = "eightteenth";
                break;
            case "19":
                output = "nineteenth";
                break;
            case "20":
                output = "twentieth";
                break;
            case "30":
                output = "thritieth";
                break;
            case "40":
                output = "fourtieth";
                break;
            case "50":
                output = "fiftieth";
                break;
            case "60":
                output = "sixtieth";
                break;
            case "70":
                output = "seventieth";
                break;
            case "80":
                output = "eightieth";
                break;
            case "90":
                output = "ninetieth";
                break;
            case "100":
                output = "hundredth";
                break;
                defaut:
           output = "";
                break;
        }
        //s or not
        var s; var finalString;
        var sstring = document.getElementById('simplefractiontext').innerHTML

        if (prev > 1) { s = "s"; } else { s = ""; }
        if (output == undefined || (sstring == undefined || (sstring == "undefined" || sstring == ""))) {
            finalString = ""; 
        }else{
        finalString = document.getElementById('simplefractiontext').innerHTML + " " + output + s;
        }
        document.getElementById('simplefractiontext').innerHTML = finalString;

    }
    app.start();
})();
