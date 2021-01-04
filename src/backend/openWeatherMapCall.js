const fetch = require("node-fetch");
const config = require("./config.json");

const URL =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  config.city +
  "&units=" +
  config.unit +
  "&lang=" +
  config.lang +
  "&appid=" +
  config.apikey;

function getWeatherData() {
  console.log("Getting weather data from: " + URL);
  return fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var temperature = Math.floor(
        parseFloat((data.main.temp + data.main.feels_like) / 2)
      );
      var weatherData = {
        id: data.weather[0].id,
        temperature,
        description: data.weather[0].description,
        city: config.city,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      };
      return JSON.stringify(weatherData);
    });
}
module.exports = { getWeatherData };
