
// QUERY SELECTORS---------------------------------------------------------------
// Use jQuery to getElementId
var cityResultText = $("#city-display");
var tempResultText = $("#temp-display");
var humidityResult = $("#humidity-display");
var windResultText = $("#wind-display");
var mainIcon =$("#mainIcon");
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


var weatherApiKey = "a795125c754c25589a8e5535bdc9a574";
// UPDATE with jquery methods for lat, lon, api key. Former two variables are local 
// add script info into HTML 
var weatherUrl =  "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={API key}";
var citiesArray = JSON.parse(localStorage.getItem("Saved City")) || [];

// FUNCTIONS---------------------------------------------------------------
// TO-DO: put date/time into updateClock function like workday scheduler
// TO-DO: local storage
// TO-DO: fetch request for weather - put in function; conditionals for non-existent city
// TO-DO: init() function


// EVENT HANDLERS---------------------------------------------------------------
// TO-DO: add search button method



// RUN CODE---------------------------------------------------------------


