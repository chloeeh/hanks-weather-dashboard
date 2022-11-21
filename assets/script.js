
// QUERY SELECTORS---------------------------------------------------------------
// Use jQuery to getElementId
// var userInput = $("#user-input");
var mySelection = $('#specific-location');
var cityResultText = $("#city-display");
var dateResultText = $('#date-display');
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
var citiesArray = JSON.parse(localStorage.getItem("savedSearch")) || [];
var userSelection;


var weatherApiKey = "a795125c754c25589a8e5535bdc9a574";
// UPDATE with jquery methods for lat, lon, api key. Former two variables are local 
// add script info into HTML 
var latitude
var longitude;
// default is kelvin; use "metric" for degrees C and meters/sec
// imperial is in degrees F and miles/hour
var units = "imperial";
var limitSearch = 5;
// var userInput = "Houston"



// FUNCTIONS---------------------------------------------------------------

function init() {
    $(document).ready(function (){
        // var userInput = citiesArray[citiesArray.length - 1];
        displayPreviousSearch();
    });
}




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
            getWeatherData(latitude, longitude, myCity);
        });
}

function currentWeather(myWeatherObject, myCity) {
    var myCurrentWeatherObject = myWeatherObject.current;
    var currentTemp = myCurrentWeatherObject.temp;
    var currentWind = myCurrentWeatherObject.wind_speed;
    var currentHumidity = myCurrentWeatherObject.humidity;
    var currentIcon = myCurrentWeatherObject.weather[0].icon;
    var displayCurrentIcon = $("<img>").attr("class", "card-img-top").attr("src", `http://openweathermap.org/img/wn/${currentIcon}@2x.png`);
    mainIcon.append(displayCurrentIcon);
    var currentDate = dayjs().format('dddd, MMM D, YYYY');
    cityResultText.text(myCity);

    dateResultText.text(currentDate);
    tempResultText.text("Temperature: " + currentTemp + " ºC");
    humidityResult.text("Humidity: " + currentHumidity + " %");
    windResultText.text("Wind Speed: " + currentWind + " MPH");
}

function forecastWeather(myWeatherObject) {
    var numForecast = 5;
    forecastWeatherData = [];
    for (var i = 0; i < numForecast; i++) {
        forecastWeatherData[i] = myWeatherObject.daily[i]; 
    }
    console.log("print FORECAST", forecastWeatherData);
    // console.log("print ICON", forecastWeatherData.weather[0].icon);
    
    dayForecast.empty();
    rowForecast.empty();
    var titleForecast = $("<h2>").attr("class", "forecast").text("5-Day Forecast: "); 

    for (var i = 0; i < forecastWeatherData.length; i++){
        var today = new Date();
        var nextDay = new Date(today);
        nextDay.setDate(nextDay.getDate()+1)

        forecastDate[i] = nextDay.setDate(nextDay.getDate()+i);
        forecastIcon[i] = forecastWeatherData[i].weather[0].icon;
        forecastTemp[i] = forecastWeatherData[i].temp.day; 
        forecastHum[i] = forecastWeatherData[i].humidity;  

        var newCol2 = $("<div>").attr("class", "col-2");
        rowForecast.append(newCol2);

        var newDivCard = $("<div>").attr("class", "card text-white bg-primary mb-3");
        newDivCard.attr("style", "max-width: 18rem;")
        newCol2.append(newDivCard);

        var newCardBody = $("<div>").attr("class", "card-body");
        newDivCard.append(newCardBody);

        var newH5 = $("<h5>").attr("class", "card-title").text(moment(forecastDate[i]).format("MMM Do"));
        newCardBody.append(newH5);

        var newImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + forecastIcon[i] + "@2x.png");
        newCardBody.append(newImg);

        var newPTemp = $("<p>").attr("class", "card-text").text("Temp: " + Math.floor(forecastTemp[i]) + "ºC");
        newCardBody.append(newPTemp);

        var newPHum = $("<p>").attr("class", "card-text").text("Humidity: " + forecastHum[i] + " %");
        newCardBody.append(newPHum);

        dayForecast.append(titleForecast);
        };

}

var getWeatherData = function(retrievedLat, retrievedLon, retrievedCity) {
    var weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${retrievedLat}&lon=${retrievedLon}&units=${units}&appid=${weatherApiKey}`;
    mainIcon.empty();

    fetch(weatherUrl)
        .then(function (response) {
            // check that code is viable
            // store data from API into global object
            if (response.ok) {
                console.log(response);
                myData = response.json();
                myData.then(function (weatherData) {
                    console.log("print full WEATHER DATA", weatherData);
                    
                    currentWeather(weatherData, retrievedCity);
                    forecastWeather(weatherData);
                });
                cardDisplay.attr("style", "display: flex; width: 98%");
              } else {
                alert('Error: ' + response.statusText);
              }

        });
}

var getGeoData = function(userCityInput) {
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${userCityInput}&limit=${limitSearch}&appid=${weatherApiKey}`;
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
                });
              } else {
                alert('Error: ' + response.statusText);
              }

        });
}

function storeCitySearch() {
    userSearch = userInput.val().trim().toLowerCase();
    var containsCity = false;

    if (citiesArray != null) {
        $(citiesArray).each(function(oldSearch) {
            if (citiesArray[oldSearch] === userSearch) {
                containsCity = true;
            }
        });
    }

    if (containsCity === false) {
        citiesArray.push(userSearch);
    }

    localStorage.setItem("savedSearch", JSON.stringify(citiesArray));
}

function displayPreviousSearch() {
    buttonList.empty();
    for (var i = 0; i < citiesArray.length; i ++) {
        var newButton = $("<button>").attr("type", "button").attr("class","savedBtn btn btn-secondary btn-lg btn-block");
        newButton.attr("data-name", citiesArray[i])
        newButton.text(citiesArray[i]);
        buttonList.prepend(newButton);
    }
    $(".savedBtn").on("click", function(event){
        event.preventDefault();
        oldInput = $(this).data("name");
        console.log("THIS IS OLD: "+ oldInput);
        $('#btn-dropdown').remove();
        $('#specific-location').remove();
        getGeoData(oldInput);
    })
}


// RUN CODE---------------------------------------------------------------------
init();

// EVENT HANDLERS---------------------------------------------------------------
// TO-DO: add search button method
buttonSearch.on("click", function(event) {
    event.preventDefault();
    if (userInput.val() === "") {
        alert("Please type a userInput to know the current weather");
        } else {
            var trimmedUserInput = userInput.val().trim().toLowerCase();
            $('#btn-dropdown').remove();
            $('#specific-location').remove();
            // STORE DATA----------
            storeCitySearch();
            displayPreviousSearch();
            getGeoData(trimmedUserInput);
        }


});


