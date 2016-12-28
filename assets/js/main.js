var config = {
    apiKey: "AIzaSyD1bb13C9bbPcMhW8om0uIIc6x_-K7Lojo",
    authDomain: "train-times-e5d89.firebaseapp.com",
    databaseURL: "https://train-times-e5d89.firebaseio.com",
    storageBucket: "train-times-e5d89.appspot.com",
    messagingSenderId: "383943144082"
};

firebase.initializeApp(config);

var trains = [];

var database = firebase.database();

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

function Train(name, dest, time, freq) {
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

    if(trains.indexOf(this.trainName) !== -1)
        return;

    trains.push(this.trainName);

    $(tableSelector).append(
        "<tr>" +
            "<th scope='\"row\"'>"+ this.trainName +"</th>" +
            "<th>"+ this.trainDest +"</th>" +
            "<th>"+ this.trainFreq +"</th>" +
            "<th>"+ this.nextArrival() +"</th>" +
            "<th>"+ this.minutesAway() +"</th>" +
        "</tr>"
    , null);

    database.ref().push({
        name: this.trainName,
        freq: this.trainFreq,
        time: this.trainTime.toString(),
        dest: this.trainDest
    });
};

function getTrainData(tableSelector) {
    database.ref().on("child_added", function(snapshot) {
        var values = snapshot.val();

        if(trains.indexOf(values.name) !== -1)
            return;

        trains.push(values.name);
        $(tableSelector).append(
            "<tr>" +
            "<th scope='\"row\"'>"+ values.name +"</th>" +
            "<th>"+ values.dest +"</th>" +
            "<th>"+ values.freq +"</th>" +
            "<th>"+ moment(values.time).format("hh:mm A") +"</th>" +
            "<th>"+ moment(values.time).fromNow() +"</th>" +
            "</tr>"
            , null);
    });
}

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

    getTrainData("#trainTimes");

    $("#addTrain").on("click", function(e) {
        e.preventDefault();

        var trainName = $("#trainName").val();
        var trainDest = $("#trainDestination").val();
        var firstTrainHour = $("#trainTimeHour").val();
        var firstTrainMin = $("#trainTimeMinute").val();
        var trainFreq = $("#trainFreq").val();

        var trainFormattedTime = moment(firstTrainHour + ":" + firstTrainMin, "hh:mm");

        var train = new Train(trainName, trainDest, trainFormattedTime, trainFreq);
        train.push("#trainTimes");
    });
});