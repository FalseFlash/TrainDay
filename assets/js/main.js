var config = {
    apiKey: "AIzaSyD1bb13C9bbPcMhW8om0uIIc6x_-K7Lojo",
    authDomain: "train-times-e5d89.firebaseapp.com",
    databaseURL: "https://train-times-e5d89.firebaseio.com",
    storageBucket: "train-times-e5d89.appspot.com",
    messagingSenderId: "383943144082"
};

firebase.initializeApp(config);

moment.updateLocale('en', {
    relativeTime : {
        future: "%s",
        past:   "Train Missed"
    }
});

var _classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
};

function Train(name, dest, time, freq, firstHour, firstMin) {
    _classCallCheck(this, Train);

    if (!(name) || !(dest) ||
        (!(dest)) || !(time)) {
        return new TypeError("Expected a value (name, dest, time, freq)");
    }

    this.trainName = name;
    this.trainDest = dest;
    this.trainTime = time;
    this.trainFreq = freq;
    this.nextArrival = function() {
        return moment(this.trainTime).format("hh:mm A");
    };
    this.minutesAway = function() {
        return moment(this.trainTime).fromNow();
    };
}

Train.prototype.push = function(tableSelector) {
    if (!tableSelector)
        throw new TypeError("Missing table selector");

    if(!tableSelector.length)
        throw new TypeError("Selected table is missing");

    $(tableSelector).append(
        "<tr>" +
            "<th scope='\"row\"'>"+ this.trainName +"</th>" +
            "<th>"+ this.trainDest +"</th>" +
            "<th>"+ this.trainFreq +"</th>" +
            "<th>"+ this.nextArrival() +"</th>" +
            "<th>"+ this.minutesAway() +"</th>" +
        "</tr>"
    , null);

    var database = firebase.database();
    var data = {
        name: this.trainName,
        freq: this.trainFreq,
        time: this.trainTime,
        dest: this.trainDest
    };

    database.ref().child('trains/' + this.trainName).set(data);
};

$(document).ready( function() {
    (function() {
        //noinspection JSDuplicatedDeclaration
        for (var i = 0; i <= 24; i++) {
            if (i < 10)
                $("#trainTimeHour").append("<option> 0" + i + "</option>", null);
            else
                $("#trainTimeHour").append("<option>" + i + "</option>", null);
        }

        //noinspection JSDuplicatedDeclaration
        for (var i = 0; 59 >= i; i++) {
            if (i < 10)
                $("#trainTimeMinute").append("<option> 0" + i + "</option>", null);
            else
                $("#trainTimeMinute").append("<option>" + i + "</option>", null);
        }
    })();

    $("#addTrain").on("click", function(e) {
        e.preventDefault();

        var trainName = $("#trainName").val();
        var trainDest = $("#trainDestination").val();
        var firstTrainHour = $("#trainTimeHour").val();
        var firstTrainMin = $("#trainTimeMinute").val();
        var trainFreq = $("#trainFreq").val();

        var trainFormattedTime = moment(firstTrainHour + ":" + firstTrainMin, "hh:mm");

        var train = new Train(trainName, trainDest, trainFormattedTime, trainFreq, firstTrainHour, firstTrainMin);
        train.push("#trainTimes");
    });
});