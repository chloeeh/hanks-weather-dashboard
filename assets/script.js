
// QUERY SELECTORS---------------------------------------------------------------
// Use jQuery to getElementId
// var userInput = $("#user-input");
var mySelection = $('#specific-location');
var cityResultText = $("#city-display");
var dateResultText = $('#date-display');
var tempResultText = $("#temp-display");
var humidityResult = $("#humidity-display");
var windResultText = $("#wind-display");
var mainIcon =       $("#main-icon");
var rowForecast = $("#row-forecast");
var dayForecast = $("#forecast");
var cardDisplay = $("#card-display");
var buttonList = $("#buttons-list");
var userInput = $("#user-input")
var buttonSearch = $("#search-button");


// GLOBALS---------------------------------------------------------------
var forecastDate = {};
var forecastIcon = {};
var forecastTemp = {};
var forecastHumidity = {};
var forecastWind = {};
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



// ---------------------------FUNCTIONS------------------------------------

// When opened or refreshed, page is clear besides options 
// select previous searches if any searches are stored
function init() {
    $(document).ready(function (){
        displayPreviousSearch();
    });
}


// Takes in an abject and array to parse through object, combine
// items into a string, then pass the string into an array
function loopThroughGeoObject(myGeoObject, myRepeatCityArray) {
    for (var i = 0; i < myGeoObject.length; i++) {

        var city = String(Object.values(myGeoObject)[i].name);
        var state = String(Object.values(myGeoObject)[i].state);
        var country = String(Object.values(myGeoObject)[i].country);
        var cityStateCountry = city + ", " + state + ", " + country;
        myRepeatCityArray[i] = cityStateCountry;
    }
    console.log("All my Cities: " + myRepeatCityArray);
}

// WHen a user selects a city name that has muliple locations
// generate a dropdown with limit=5 cities (max allowed by API)
// perform operations on the user's selection to retrieve the
// latitude and longitude of the selected city 
// use these coordinates and the city's name to retrieve and 
// display weather data to the user
function multipleCities(myGeoObject, myRepeatCityArray) {

    var userSelection;
    var myDropDownSelectionArray;

    if (myGeoObject.length > 1) {
        loopThroughGeoObject(myGeoObject, myRepeatCityArray);
    }
// ----------------CREATE DYNAMIC DROPDOWN---------------------
        var newDropDown = document.createElement("select");
        newDropDown.setAttribute("id", "specific-location");
        newDropDown.setAttribute("class", "btn dropdown-trigger");
        document.getElementById("specify-dropdown").appendChild(newDropDown);
        // place elements myOptions in array in dropdown
        myOptions = myRepeatCityArray;
        specificLocation = $('#specific-location');
        specificLocation.append($('<option></option>').val("placeholder").html("Specify Location"));
        for (var i = 0; i < myRepeatCityArray.length; i++) {
            specificLocation.append($('<option></option>').val(i).html(myRepeatCityArray[i]));
        }

// ----------------CREATE DROPDOWN BUTTON---------------------
        var buttonDropdown = document.createElement("button");
        buttonDropdown.setAttribute("id", "btn-dropdown");
        buttonDropdown.setAttribute("class", "btn btn-outline-primary");
        buttonDropdown.setAttribute("type", "submit");
        buttonDropdown.textContent = "Submit";
        document.getElementById("specify-dropdown").appendChild(buttonDropdown);
    
        // When user makes selection in dropdown, return the userSelection
        let dropdownSubmitHandler = function () {
            // event.preventDefault();
            userSelection = $('#specific-location').find(":selected").text();
            console.log("THIS IS MY OUTPUT: "+ userSelection);
            return userSelection;
        }
        
// ----------------HANDLE DROPDOWN SELECTION---------------------
        // when user submits the dropdown selection, set the result
        // to the selection of dropdownSubmitHandler() return
        // split the array into individual components
        // loop through the geoObject; if the user's selected 
        // city, state, country matches to one geoObject at a given
        // index, then grab the latitude and longitude coordinates
        buttonDropdown.addEventListener('click', function(event) {
            var result = dropdownSubmitHandler();
            myDropDownSelectionArray = result.split(", ");
            var myCity = myDropDownSelectionArray[0];
            var myState = myDropDownSelectionArray[1];
            var myCountry = myDropDownSelectionArray[2];
            console.log("THIS IS MY OUTPUT: "+ myDropDownSelectionArray);

            // find a match with the specific location and grab geo
            // coordinates
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

            // Use the coordinates and the city name to retrieve and 
            // display weather data
            getWeatherData(latitude, longitude, myCity);
        });
}

// ------------------------WEATHER FUNCTIONS----------------------------

// Accepts a weather object and user-selected city to retrieve and display
// the current weather data to the user
function currentWeather(myWeatherObject, myCity) {
    // grab data from the API's weather object
    var myCurrentWeatherObject = myWeatherObject.current;
    var currentTemp = myCurrentWeatherObject.temp;
    var currentWind = myCurrentWeatherObject.wind_speed;
    var currentHumidity = myCurrentWeatherObject.humidity;
    var currentIcon = myCurrentWeatherObject.weather[0].icon;

    // create html element to display the weather icon to graphically report
    // current weather
    // append this element to the mainIcon element
    var displayCurrentIcon = $("<img>").attr("class", "card-img-top").attr("src", `http://openweathermap.org/img/wn/${currentIcon}@2x.png`);
    mainIcon.append(displayCurrentIcon);

    // Display text results to the user
    var currentDate = dayjs().format('dddd, MMM D, YYYY');
    cityResultText.text(myCity);
    dateResultText.text(currentDate);
    tempResultText.text("Temperature: " + currentTemp + " F");
    windResultText.text("Wind Speed: " + currentWind + " MPH");
    humidityResult.text("Humidity: " + currentHumidity + " %");
}

// Accepts a weather object to retrieve and display the current weather
// data to the user
// Select a total of 5 days for the forecast. The weather API stores data
// to display a maximum of 8 forecast days 
function forecastWeather(myWeatherObject) {

    // for the number of forecasted days, loop through the weatherObject and
    // store the daily items into the forecastWeatherData array
    var numForecast = 5;
    var forecastWeatherData = [];
    for (var i = 0; i < numForecast; i++) {
        forecastWeatherData[i] = myWeatherObject.daily[i]; 
    }
    console.log("print FORECAST", forecastWeatherData);

    // remove child nodes
    // create title for the forecast chart
    dayForecast.empty();
    rowForecast.empty();
    var titleForecast = $("<h2>").attr("class", "forecast").text("5-Day Forecast: "); 

    // for each day in the forecast, retruieve the date and listed weather 
    // data to display to the user
    for (var i = 0; i < forecastWeatherData.length; i++){
        var today = new Date();
        var nextDay = new Date(today);
        nextDay.setDate(nextDay.getDate()+1)

        forecastDate[i] = nextDay.setDate(nextDay.getDate()+i);
        forecastIcon[i] = forecastWeatherData[i].weather[0].icon;
        forecastTemp[i] = forecastWeatherData[i].temp.day; 
        forecastHumidity[i] = forecastWeatherData[i].humidity; 
        forecastWind[i] = forecastWeatherData[i].wind_speed; 

        var newCol2 = $("<div>").attr("class", "col-2");
        rowForecast.append(newCol2);

        var newDivCard = $("<div>").attr("class", "card card-forecast text-white mb-3");
        newDivCard.attr("style", "max-width: 18rem;")
        newCol2.append(newDivCard);

        var newCardBody = $("<div>").attr("class", "card-body");
        newDivCard.append(newCardBody);

        var showForecastTitle = $("<h5>").attr("class", "card-title").text(moment(forecastDate[i]).format("MMM Do"));
        newCardBody.append(showForecastTitle);

        var showForecastIcon = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + forecastIcon[i] + "@2x.png");
        newCardBody.append(showForecastIcon);

        var showForecastTemp = $("<p>").attr("class", "card-text").text("Temp: " + Math.floor(forecastTemp[i]) + " F");
        newCardBody.append(showForecastTemp);

        var showForecastWind = $("<p>").attr("class", "card-text").text("Wind: " + forecastWind[i] + " MPH");
        newCardBody.append(showForecastWind);

        var showForecastHumidity = $("<p>").attr("class", "card-text").text("Humidity: " + forecastHumidity[i] + " %");

        newCardBody.append(showForecastHumidity);
        dayForecast.append(titleForecast);
    };
}

// Fetch url + api and other parameters defined to retrieve a weather object
// operate on currenWeather(object) and forecastWeather(object)
// set CardDisplay to flex in order to display items to user
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
                // alert user there is error in fetch response
                alert('Error: ' + response.statusText);
              }
        });
}

// ------------------------GEOGRAPHICAL FUNCTION----------------------------
// Fetch geographical data, including city name, state, country, latitude, 
// longitude using API + key userCityInput will kick off the search through 
// this function, requiring further user input to narrow down a location
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
                    // if the user enters a non-existent city, do not display
                    // any information
                    if (geoData.length == 0) {
                        console.log("NO CITIES");
                        modal.style.display = "block";
                    // if the user enters a unique-named city (only one result)
                    // do not create dropdown; immediately show weather results
                    } else if (geoData.length == 1) {
                        latitude = Object.values(geoData)[0].lat;
                        longitude = Object.values(geoData)[0].lon;
                        console.log("These are the coordinates: " + '\n' + 
                        "LAT: " + latitude + '\n' + 
                        "LONG: " + longitude);
                        getWeatherData(latitude, longitude);
                    // if the user enters a city with >1 result, develop dropdown
                    // require user selection, follow the rest of multipleCities(object, array)
                    } else {
                        multipleCities(geoData, sameNameArray);
                    }
                });
              } else {
                // alert user there is error in fetch response
                alert('Error: ' + response.statusText);
              }

        });
}

// When a user enters a city, store that city into localstorage
// push new cities into array/localstorage
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

// display the previous searches to the user.
// when the user clicks a previous search, allow user to narrow
// down the selection and/or immediately display weather results
// if there exist previous searches in storage, create a Clear History
// button to allow the user to erase searches. If there is no 
// localstorage, the Clear History button will not display to the user
function displayPreviousSearch() {
    buttonList.empty();
    for (var i = 0; i < citiesArray.length; i ++) {
        var cityButton = $("<button>").attr("type", "button").attr("class","saved-btn btn btn-secondary btn-lg btn-block");
        cityButton.attr("data-name", citiesArray[i])
        cityButton.text(citiesArray[i]);
        buttonList.prepend(cityButton);
    }
    if (localStorage.length) {
        var clearButton = $("<button>").attr("type", "button").attr("class","clear-btn btn btn-danger btn-lg btn-block").attr("id", "clear-history");
        clearButton.text("Clear History");
        buttonList.prepend(clearButton);
    }
    
    $(".saved-btn").on("click", function(event){
        event.preventDefault();
        oldInput = $(this).data("name");
        console.log("THIS IS OLD: "+ oldInput);
        $('#btn-dropdown').remove();
        $('#specific-location').remove();
        getGeoData(oldInput);
    })

    $(".clear-btn").on("click", function(event){
        event.preventDefault();
        citiesArray = [];
        localStorage.clear();
        $('#btn-dropdown').remove();
        $('#specific-location').remove();
        buttonList.empty();
    })
}

/* ---------------------- MODALS ----------------------- */
// When the user enters an invalid city name, build an alert
// Get the modal
var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// -------------------------------EVENT HANDLERS--------------------------------
// When user clicks on search button, 
// if input is blank, user is alerted to enter text
// otherwise, the dropdown and dropdown button are removed
// (as to not be duplicated on Search click)
// the input is stored, previous searches displayed, and the
// retrieval of geo + weather data is kicked off
buttonSearch.on("click", function(event) {
    event.preventDefault();
    if (userInput.val() === "") {
        // alert user to enter valid city
        modal.style.display = "block";
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

// --------------------------------RUN PROGRAM-------------------------------------
init();