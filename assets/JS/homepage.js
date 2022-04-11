// search
var citySearchContainer = document.querySelector(".city-search-container");
var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-btn");

// history
var historyContainer = document.querySelector(".search-history-container");

// cuurent weather display
var currentWeather = document.querySelector(".current-weather");
var currentCity = document.querySelector(".current-city");
var currentTemp = document.querySelector(".current-temp");
var currentWind = document.querySelector(".current-wind");
var currentHumidity = document.querySelector(".current-humidity");
var currentUV = document.querySelector(".current-uv");

// forcast
var forcastContainer = document.querySelector(".forcast-container");

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
var day = dateObj.getDate();
var month = dateObj.getMonth() + 1;
var year = dateObj.getFullYear();
var currDate = "(" + month + "/" + day + "/" + year + ")";

// set current weather from localstorage
var city = "";
var getCity = function () {
  if (localStorage.getItem("currentCity") === null) {
    console.log("city is null");
  } else {
    city = localStorage.getItem("currentCity");
    getLocation();
  }
};
console.log(city);

// save search history
var searchHistory = [];
var saveSearchHistory = (city) => {
  if (localStorage.getItem("history")) {
    searchHistory = JSON.parse(localStorage.getItem("history"));
  }
  searchHistory.push(city);
  if (searchHistory.length > 8) {
    searchHistory.splice(0, 1);
  }
  localStorage.setItem("history", JSON.stringify(searchHistory));
};

// create search history
var createSearchHistory = () => {
  var savedHistory = JSON.parse(localStorage.getItem("history"));
  console.log(savedHistory);
  $(historyContainer).empty();
  for (var i = savedHistory.length - 1; i >= 0; i--) {
    if (savedHistory[i] === city) {
      return false;
    }
    var historyEl = document.createElement("button");
    historyEl.className = "history-btn mb-3 w-100";
    historyEl.setAttribute("type", "submit");
    historyEl.innerHTML = savedHistory[i];
    historyContainer.append(historyEl);
  }
};

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
      "&exclude=minutely,hourly,alerts&units=imperial&appid=2d81bc1f1b05a9a201fdb0947c29daec"
  )
    .then(function (response) {
      response.json().then(function (theWeather) {
        console.log(theWeather);

        // update current weather
        updateCurrentWeatherEl(
          theWeather.current,
          theWeather.current.weather[0]
        );

        // clear placeholder forcast
        $(forcastContainer).empty();

        //update 5-day forcast
        for (var i = 1; i < 6; i++) {
          updateForcastWeather(
            theWeather.daily[i],
            theWeather.daily[i].weather[0],
            i
          );
        }

        // save city to localstorage
        localStorage.setItem("currentCity", city);

        // create search history
        createSearchHistory();
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
  currentTemp.textContent = "Temp: " + temp + "℉";
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

// capture city name and send it to geo locate API
var citySearchHandler = function (e) {
  e.preventDefault();
  if (city != "") {
    saveSearchHistory(city);
  }
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
) => {
  // card
  var forcast = document.createElement("div");
  forcast.className =
    "forcast col-lg-2 row-md card-body me-3 mb-2 pt-1 ps-1 pb-4";
  forcast.innerHTML = "";
  forcastContainer.append(forcast);

  // date
  var futureDate = "(" + month + "/" + (day + i) + "/" + year + ")";
  var forcastDate = document.createElement("p");
  forcastDate.className = "forcast-date card-title fs-2";
  forcastDate.innerHTML = futureDate;
  forcast.append(forcastDate);

  // emoji
  var forcastEmoji = document.createElement("p");
  forcastEmoji.className = "card-text emoji";
  forcastEmoji.innerHTML = weatherEmojiHandler(main);
  forcast.append(forcastEmoji);

  // temp
  var forcastTemp = document.createElement("p");
  forcastTemp.className = "card-text";
  forcastTemp.innerHTML = "Temp: " + temp.day + "℉";
  forcast.append(forcastTemp);

  //wind
  var forcastWind = document.createElement("p");
  forcastWind.className = "card-text";
  forcastWind.innerHTML = "Wind: " + wind_speed + "MPH";
  forcast.append(forcastWind);

  // humidity
  var forcastHumidity = document.createElement("p");
  forcastHumidity.className = "card-text";
  forcastHumidity.innerHTML = "Humidity: " + humidity + "%";
  forcast.append(forcastHumidity);
};

// getLocation();
getCity();
$(citySearchContainer).submit(citySearchHandler);
$(historyContainer).submit(function (e) {
  e.preventDefault();
  console.log(e.target.val);
});
