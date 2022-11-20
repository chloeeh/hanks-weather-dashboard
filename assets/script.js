
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



// GLOBALS---------------------------------------------------------------
var forecastDate = {};
var forecastIcon = {};
var forecastTemp = {};
var forecastHum = {};
var duplicateCity = [];


var weatherApiKey = "a795125c754c25589a8e5535bdc9a574";
// UPDATE with jquery methods for lat, lon, api key. Former two variables are local 
// add script info into HTML 
var latitude
var longitude;
var limitSearch = 5;
var userInput = "Houston"
var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=${limitSearch}&appid=${weatherApiKey}`;
var weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`;

// var citiesArray = JSON.parse(localStorage.getItem("Saved City")) || [];

// FUNCTIONS---------------------------------------------------------------
// TO-DO: put date/time into updateClock function like workday scheduler
// TO-DO: local storage
// TO-DO: fetch request for weather - put in function; conditionals for non-existent city

function createDropDown(duplicateCity) {
    // CREATE DYNAMIC DROPDOWN
    var newDropDown = document.createElement("select");
    newDropDown.setAttribute("id", "specific-location");
    newDropDown.setAttribute("class", "btn dropdown-trigger");
    // newDropDown.setAttribute("onchange", "getOption()");
    document.getElementById("specify-dropdown").appendChild(newDropDown);



    myOptions = duplicateCity;
    test = $('#specific-location');
    test.append($('<option></option>').val("placeholder").html("Specify Location"));
    for (var i = 0; i < duplicateCity.length; i++) {
        test.append($('<option></option>').val(i).html(duplicateCity[i]));
        console.log("MY SPECFIC LOCATION: " + duplicateCity);
    }

    var buttonDropdown = document.createElement("button");
    buttonDropdown.setAttribute("id", "btn-dropdown");
    buttonDropdown.setAttribute("class", "btn btn-outline-primary");
    buttonDropdown.setAttribute("type", "submit");
    buttonDropdown.textContent = "Submit";
    document.getElementById("specify-dropdown").appendChild(buttonDropdown);


let dropdownSubmitHandler = function (event) {
    event.preventDefault();
    output = test.value;
    console.log("THIS IS MY OUTPUT: "+ $('#specific-location').find(":selected").text());
}

// EVENT HANDLER
buttonDropdown.addEventListener('click', dropdownSubmitHandler);


}

var getGeoData = function() {

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
                    if (geoData.length > 1) {
                        for (var i = 0; i < geoData.length; i++) {

                            var city = String(Object.values(geoData)[i].name);
                            var state = String(Object.values(geoData)[i].state);
                            var country = String(Object.values(geoData)[i].country);
                            var cityStateCountry = city + ", " + state + ", " + country;
                            sameNameArray[i] = cityStateCountry;
                        }
                        console.log("All my Cities: " + sameNameArray);

                        createDropDown(sameNameArray);
                    
                        
                    GeoObject = Object.values(geoData)[1];
                    console.log("print GEO OBJECT", GeoObject);


                    };
                });
              } else {
                alert('Error: ' + response.statusText);
              }

        });
}

var getWeatherData = function() {

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





// TO-DO: init() function


// EVENT HANDLERS---------------------------------------------------------------
// TO-DO: add search button method










// RUN CODE---------------------------------------------------------------
// getWeatherData();
getGeoData();

