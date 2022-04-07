// search
var citySearchContainer = document.querySelector(".city-search-container");
var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-btn");

// cuurent weather display
var currentWeather = document.querySelector(".current-weather");
var currentCity = document.querySelector(".current-city");
var currentTemp = document.querySelector(".current-temp");
var currentWind = document.querySelector(".current-wind");
var currentHumidity = document.querySelector(".current-humidity");
var currentUV = document.querySelector(".current-uv");

// forcast
var day1Date = document.querySelector(".forcast-date-1");
var day1Emoji = document.querySelector(".day-1-emoji");
var day1Temp = document.querySelector(".day-1-temp");
var day1Wind = document.querySelector(".day-1-wind");
var day1Humidity = document.querySelector(".day-1-humidity");

var day2Date = document.querySelector(".forcast-date-2");
var day2Emoji = document.querySelector(".day-2-emoji");
var day2Temp = document.querySelector(".day-2-temp");
var day2Wind = document.querySelector(".day-2-wind");
var day2Humidity = document.querySelector(".day-2-humidity");

var day3Date = document.querySelector(".forcast-date-3");
var day3Emoji = document.querySelector(".day-3-emoji");
var day3Temp = document.querySelector(".day-3-temp");
var day3Wind = document.querySelector(".day-3-wind");
var day3Humidity = document.querySelector(".day-3-humidity");

var day4Date = document.querySelector(".forcast-date-4");
var day4Emoji = document.querySelector(".day-4-emoji");
var day4Temp = document.querySelector(".day-4-temp");
var day4Wind = document.querySelector(".day-4-wind");
var day4Humidity = document.querySelector(".day-4-humidity");

var day5Date = document.querySelector(".forcast-date-5");
var day5Emoji = document.querySelector(".day-5-emoji");
var day5Temp = document.querySelector(".day-5-temp");
var day5Wind = document.querySelector(".day-5-wind");
var day5Humidity = document.querySelector(".day-5-humidity");

var dateObj = new Date();

var calDate =
  "(" +
  dateObj.getDate() +
  "/" +
  dateObj.getMonth() +
  "/" +
  dateObj.getFullYear() +
  ")";

var city = "";

var getLocation = function () {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=2d81bc1f1b05a9a201fdb0947c29daec"
  )
    .then(function (response) {
      response.json().then(function (geo) {
        console.log(geo);
        var locLat = geo[0].lat;
        var locLon = geo[0].lon;
        console.log(locLat);
        console.log(locLon);
        getWeather(locLat, locLon);
      });
    })
    .catch(function (error) {
      alert("unable to connect to location server");
    });
};

var getWeather = function (lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=alerts&units=imperial&appid=2d81bc1f1b05a9a201fdb0947c29daec"
  )
    .then(function (response) {
      response.json().then(function (theWeather) {
        console.log(theWeather);

        // update current weather
        updateCurrentWeatherEl(
          theWeather.current,
          theWeather.current.weather[0]
        );
      });
    })
    .catch(function (error) {
      alert("Unable to connect to weather server");
    });
};

var updateCurrentWeatherEl = function (
  { temp, wind_speed, humidity, uvi },
  { main }
) {
  // update current weather
  var weatherEmojiHandler = function (main) {
    if (main === "Thunderstorm") {
      return "⛈️";
    } else if (main === "Drizzle" || main === "Rain") {
      return "🌧️";
    } else if (main === "snow") {
      return "🌨️";
    } else if (main === "Clear") {
      return "☀️";
    } else if (main === "Clouds") {
      return "🌥️";
    } else if (
      main === "Mist" ||
      main === "Smoke" ||
      main === "Haze" ||
      main === "Dust" ||
      main === "Fog" ||
      main === "Sand" ||
      main === "Ash" ||
      main === "Squall"
    ) {
      return "🌫️";
    } else if (main === "Tornado") {
      return "🌪️";
    }
  };
  currentCity.textContent =
    city + " " + calDate + " " + weatherEmojiHandler(main);
  currentTemp.textContent = "Temp: " + temp + "°F";
  currentWind.textContent = "Wind: " + wind_speed + "MPH";
  currentHumidity.textContent = "Humidity: " + humidity + "%";
  currentUV.innerHTML =
    "UV Index: <span class='px-2' id='UV-I'>" + uvi + "</span>";
  var uvI = document.querySelector("span");
  if (uvi > 10) {
    $("#UV-I").addClass("UV-severe");
  } else if (uvi >= 8) {
    $("#UV-I").addClass("UV-very-high");
  } else if (uvi >= 6) {
    $("#UV-I").addClass("UV-high");
  } else if (uvi >= 3) {
    $("#UV-I").addClass("UV-moderate");
  } else if (uvi >= 0) $("#UV-I").addClass("UV-low");
};
var citySearchHandler = function (e) {
  e.preventDefault();
  city = $(searchInput).val().trim();
  if (city === "") {
    alert("please enter city name");
    return false;
  }
  console.log(city);
  getLocation();
};

$(citySearchContainer).submit(citySearchHandler);
