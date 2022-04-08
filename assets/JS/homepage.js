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

var currDate =
  "(" +
  dateObj.getDate() +
  "/" +
  dateObj.getMonth() +
  "/" +
  dateObj.getFullYear() +
  ")";

var city = "";

var weatherEmojiHandler = (weatherMain) => {
  if (weatherMain === "Thunderstorm") {
    return "⛈️";
  } else if (weatherMain === "Drizzle" || weatherMain === "Rain") {
    return "🌧️";
  } else if (weatherMain === "Snow") {
    return "🌨️";
  } else if (weatherMain === "Clear") {
    return "☀️";
  } else if (weatherMain === "Clouds") {
    return "🌥️";
  } else if (
    weatherMain === "Mist" ||
    weatherMain === "Smoke" ||
    weatherMain === "Haze" ||
    weatherMain === "Dust" ||
    weatherMain === "Fog" ||
    weatherMain === "Sand" ||
    weatherMain === "Ash" ||
    weatherMain === "Squall"
  ) {
    return "🌫️";
  } else if (weatherMain === "Tornado") {
    return "🌪️";
  }
};

var getLocation = () => {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=2d81bc1f1b05a9a201fdb0947c29daec"
  )
    .then(function (response) {
      response.json().then(function (geo) {
        console.log(geo);
        if (geo.length === 0) {
          alert("City Not Found, Please Enter a Correct City Name.");
        } else {
          currentCity.textContent = "Loading...";
          var locLat = geo[0].lat;
          var locLon = geo[0].lon;
          console.log(locLat);
          console.log(locLon);
          getWeather(locLat, locLon);
        }
      });
    })
    .catch(function (error) {
      alert("unable to connect to location server");
    });
};

var getWeather = (lat, lon) => {
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

        //update 5-day forcast
        for (var i = 0; i < 5; i++) {
          updateForcastWeather(
            theWeather.daily[i],
            theWeather.daily[i].weather[0],
            i
          );
        }
      });
    })
    .catch(function (error) {
      alert("Unable to connect to weather server");
    });
};

// update current weather
var updateCurrentWeatherEl = (
  { temp, wind_speed, humidity, uvi },
  { main }
) => {
  currentCity.textContent =
    city + " " + currDate + " " + weatherEmojiHandler(main);
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

// update 5-day forcast
var updateForcastWeather = (
  { temp, wind_speed, humidity, uvi },
  { main },
  i
) => {};

$(citySearchContainer).submit(citySearchHandler);
