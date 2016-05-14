/**
 * app.js
 * created by Marcel Baur (marcel.baur@soom-it.ch)
 */

var EdmundsClient = require('./test/..');
var server = require('./test/server');
var readlineSync = require('readline-sync');
var colors = require('colors');
var util = require('util');

var port = 4001;
var client = new EdmundsClient({apiKey: 'tf45g986ttqefx389t36ppmg'});

var make = "Audi";
var model = "A4";
var year = "2010";

/*
 var make = "Tesla";
 var model = "Model S";
 var year = "2015";
 */

var treeCO2ConsumptionYearly = 21.8;
var averageKmYearly = 15000;
var kplcity;
var kplhighway;
var engine;
var emissionPerKm;
var emissionPerYear;

function readInput() {

    make = readlineSync.question('Auto Marke: ');
    model = readlineSync.question('Auto Modell: ');
    year = readlineSync.question('Auto Jahrgang: ');
    console.log('Suche nach ' + make.green + ' ' + model.green + ' ' + year.green + '...');

    apiCall();

};

function apiCall() {

    server.listen(port);
    console.log('Server listening on port '.cyan + port);

    var opts = {};
    opts.make = make;
    opts.model = model;
    opts.year = year;
    opts.view = 'full';

    //server.setFileName('getallcardetails');
    client.getAllCarDetails(opts, function onResponse(err, res) {

        if (err) {
            console.log('An error occurred while querying the API!'.red);
        }
        if (res.stylesCount == 0) {
            console.log("Car could not be found!".red);
        } else {
            // Debug: log entire response
            //console.log(util.inspect(res, {showHidden: false, depth: null}));

            //console.log("ID: " + res.styles[0].make.id);
            //console.log("HP: " + res.styles[0].engine.horsepower);

            console.log(make + " " + model + " " + year + " Spezifikationen:");
            engine = res.styles[0].engine.type;
            console.log("Motor: " + engine);
            //console.log("Getriebe: " + res.styles[0].transmission.transmissionType);
            console.log("Gänge: " + res.styles[0].transmission.numberOfSpeeds);
            console.log("Türen: " + res.styles[0].numOfDoors);
            console.log("Preis: " + res.styles[0].price.baseMSRP);
            console.log("Fahrzeugtyp: " + res.styles[0].categories.vehicleStyle);
            kplcity = doMath(res.styles[0].MPG.city, 1, 1);
            console.log("KPL Stadt: " + kplcity);
            console.log("Kosten für 100km Stadt: " + doMath(kplcity, 1, 2) + "0 CHF");
            kplhighway = doMath(res.styles[0].MPG.highway, 1, 1);
            console.log("KPL Autobahn: " + kplhighway);
            console.log("Kosten für 100km Autobahn: " + doMath(kplhighway, 1, 2) + "0 CHF");
            emissionPerKm = doMath(res.styles[0].MPG.city, 0, 3);
            console.log("Emissionen pro km: " + emissionPerKm + "g/km");
            emissionPerYear = emissionPerKm * averageKmYearly / 1000;
            console.log("Emissionen pro Jahr: " + doMath(emissionPerYear / 1000, 2, 0) + " Tonnen CO2");
            console.log("Anzahl Bäume pro Jahr: " + doMath(emissionPerYear, 0, 4) + " Bäume");


        }

        //getImage();

        console.log('Query done! '.green);

        server.close();
        console.log('Server stopped listening. Exiting.'.yellow);
    });

}

function doMath(value, decimals, opt) {
    decimals = +decimals;

    // Keep value unchanged if opt = 0
    if (opt == 0) {
        value = +value;
    }
    // Convert mpg to kpl if opt = 1
    if (opt == 1) {
        value = +value * 0.425144;
        // Calculate fuel costs if opt = 2
    }
    if (opt == 2) {
        value = (100 / +value) * 1.40;
        // Calculate emissions based on fuel type if opt = 3
    }
    if (opt == 3) {
        if (engine != "diesel" && engine != "electric") {
            value = 6760 / +value;
        }
        if (engine == "diesel") {
            value = 7440 / +value;
        }
        if (engine == "electric") {
            value = 0;
        }

        // Calculate Trees per Year if opt = 4
    }
    if (opt == 4) {
        value = +value / treeCO2ConsumptionYearly;
    }

    if (isNaN(value))
        return NaN;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 2) : 2)));

    // Shift back
    value = value.toString().split('e');
    return (+(value[0] + 'e' + (value[1] ? (+value[1] - 2) : -2))).toFixed(decimals);
}

function getImage() {

    var opts = {};
    opts.make = make;
    opts.model = model;
    opts.year = year;

    client.getCarImage(opts, function onResponse(err, res) {

        if (err) {
            console.log('An error occurred while querying the API!'.red);
        } else {
            console.log(util.inspect(res, {showHidden: false, depth: null}));
        }
    });
}

readInput();
