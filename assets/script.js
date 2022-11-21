
// QUERY SELECTORS---------------------------------------------------------------
// Use jQuery to getElementId
// var userInput = $("#user-input");
var mySelection = $('#specific-location');
var cityResultText = $("#city-display");
var tempResultText = $("#temp-display");
var humidityResult = $("#humidity-display");
var windResultText = $("#wind-display");
var mainIcon =       $("#mainIcon");
var rowForecast = $("#row-forecast");
var dayForecast = $("#forecast");
var cardDisplay = $("#cardDisplay");
var UVIndexText = $("#UVIndexResult");
var buttonList = $("#buttonsList");
var userInput = $("#user-input")
var buttonSearch = $("#search-button");


// GLOBALS---------------------------------------------------------------
var forecastDate = {};
var forecastIcon = {};
var forecastTemp = {};
var forecastHum = {};
var duplicateCity = [];
var userSelection;


var weatherApiKey = "a795125c754c25589a8e5535bdc9a574";
// UPDATE with jquery methods for lat, lon, api key. Former two variables are local 
// add script info into HTML 
var latitude
var longitude;
var limitSearch = 5;
// var userInput = "Houston"



// var citiesArray = JSON.parse(localStorage.getItem("Saved City")) || [];

// FUNCTIONS---------------------------------------------------------------
// TO-DO: put date/time into updateClock function like workday scheduler
// TO-DO: local storage
// TO-DO: fetch request for weather - put in function; conditionals for non-existent city
function loopThroughGeoObject(myGeoObject, myRepeatCityArray) {
    for (var i = 0; i < myGeoObject.length; i++) {

        var city = String(Object.values(myGeoObject)[i].name);
        var state = String(Object.values(myGeoObject)[i].state);
        var country = String(Object.values(myGeoObject)[i].country);
        var cityStateCountry = city + ", " + state + ", " + country;
        myRepeatCityArray[i] = cityStateCountry;
    }
    console.log("All my Cities: " + myRepeatCityArray);
    console.log("MY CITY: "+city + "MY STATE: "+state + "MY COUNTRY: "+country);
}

function multipleCities(myGeoObject, myRepeatCityArray) {

    var userSelection;
    var myDropDownSelectionArray;



    if (myGeoObject.length > 1) {
        loopThroughGeoObject(myGeoObject, myRepeatCityArray);

    }
    // operateDropDown(myRepeatCityArray, myGeoObject);
        // CREATE DYNAMIC DROPDOWN
        var newDropDown = document.createElement("select");
        newDropDown.setAttribute("id", "specific-location");
        newDropDown.setAttribute("class", "btn dropdown-trigger");
        // newDropDown.setAttribute("onchange", "getOption()");
        document.getElementById("specify-dropdown").appendChild(newDropDown);
    
        myOptions = myRepeatCityArray;
        test = $('#specific-location');
        test.append($('<option></option>').val("placeholder").html("Specify Location"));
        for (var i = 0; i < myRepeatCityArray.length; i++) {
            test.append($('<option></option>').val(i).html(myRepeatCityArray[i]));
            console.log("MY SPECFIC LOCATION: " + myRepeatCityArray);
        }

        // Create Button
        var buttonDropdown = document.createElement("button");
        buttonDropdown.setAttribute("id", "btn-dropdown");
        buttonDropdown.setAttribute("class", "btn btn-outline-primary");
        buttonDropdown.setAttribute("type", "submit");
        buttonDropdown.textContent = "Submit";
        document.getElementById("specify-dropdown").appendChild(buttonDropdown);
    

        let dropdownSubmitHandler = function () {
            // event.preventDefault();
            userSelection = $('#specific-location').find(":selected").text();
            console.log("THIS IS MY OUTPUT: "+ userSelection);
            // outputForecast(GeoObject, userSelection);
            myDropDownSelectionArray = userSelection.split(", ");
            return userSelection;
        }


        // EVENT HANDLER
        // buttonDropdown.addEventListener('click', dropdownSubmitHandler);
        buttonDropdown.addEventListener('click', function(event) {
            
            var result = dropdownSubmitHandler();
            myDropDownSelectionArray = result.split(", ");
            var myCity = myDropDownSelectionArray[0];
            var myState = myDropDownSelectionArray[1];
            var myCountry = myDropDownSelectionArray[2];
            console.log("THIS IS MY OUTPUTTTTTT: "+ myDropDownSelectionArray);
            // loopThroughGeoObject(myGeoObject, myRepeatCityArray);

            for (var i = 0; i < myGeoObject.length; i++) {
                if(myCity === String(Object.values(myGeoObject)[i].name) &&
                   myState === String(Object.values(myGeoObject)[i].state) &&
                   myCountry === String(Object.values(myGeoObject)[i].country)) {
                    
                    latitude = Object.values(myGeoObject)[i].lat;
                    longitude = Object.values(myGeoObject)[i].lon;
                    console.log("These are the coordinates: " + '\n' + 
                    "LAT: " + latitude + '\n' + 
                    "LONG: " + longitude);
                   }
            }
            getWeatherData(latitude, longitude);




        });

  
}
var getWeatherData = function(retrievedLat, retrievedLon) {
    var weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${retrievedLat}&lon=${retrievedLon}&appid=${weatherApiKey}`;
    var weatherObject = {};
    fetch(weatherUrl)
        .then(function (response) {
            // check that code is viable
            // store data from API into global object
            if (response.ok) {
                console.log(response);
                myData = response.json();
                myData.then(function (weatherData) {
                    console.log("print full WEATHER DATA", weatherData);
                    // stores the object 'rates' from the data response into
                    // global variable object
                    weatherObject = weatherData.current;
                    console.log("print WEATHER OBJECT", weatherObject);

                    // var cityName = weatherData.name;
                    // var country = weatherData.sys.country;
                });
              } else {
                alert('Error: ' + response.statusText);
              }

        });
}

var getGeoData = function(userCityInput) {
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${userCityInput}&limit=${limitSearch}&appid=${weatherApiKey}`;
    var GeoObject = {};
    return fetch(geoUrl)
        .then(function (response) {
            // check that code is viable
            // store data from API into global object
            if (response.ok) {
                console.log(response);
                myData = response.json();
                // return myData;
                myData.then(function (geoData) {
                    console.log("print full GEO DATA", geoData);
                    console.log("geoData.length is: " + geoData.length);

                    var sameNameArray = [];

                    if (geoData.length == 0) {
                        console.log("NO CITIES");
                    } else if (geoData.length == 1) {
                        latitude = Object.values(geoData)[0].lat;
                        longitude = Object.values(geoData)[0].lon;
                        console.log("These are the coordinates: " + '\n' + 
                        "LAT: " + latitude + '\n' + 
                        "LONG: " + longitude);
                        getWeatherData(latitude, longitude);
                    } else {
                        multipleCities(geoData, sameNameArray);
                    }

                    
                    // if (geoData.length > 1) {
                    //     for (var i = 0; i < geoData.length; i++) {

                    //         var city = String(Object.values(geoData)[i].name);
                    //         var state = String(Object.values(geoData)[i].state);
                    //         var country = String(Object.values(geoData)[i].country);
                    //         var cityStateCountry = city + ", " + state + ", " + country;
                    //         sameNameArray[i] = cityStateCountry;
                    //     }
                    //     console.log("All my Cities: " + sameNameArray);

                    

                });
              } else {
                alert('Error: ' + response.statusText);
              }

        });
}

// TO-DO: init() function


// EVENT HANDLERS---------------------------------------------------------------
// TO-DO: add search button method
buttonSearch.on("click", function(event) {
    event.preventDefault();
    if (userInput.val() === "") {
        alert("Please type a userInput to know the current weather");
        } else
        var trimmedUserInput = userInput.val().trim().toLowerCase();


        $('#btn-dropdown').remove();
        $('#specific-location').remove();
        
    

    getGeoData(trimmedUserInput);
    // Any time this button is pushed, call init so that multiple "submit location" buttons don't pop up.
});










// RUN CODE---------------------------------------------------------------
// getWeatherData();
// getGeoData();

