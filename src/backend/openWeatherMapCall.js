const fetch = require("node-fetch");
const fs = require("fs");

function assembleURL(city, apiKey, lang, units) {
  let url =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=" +
    units +
    "&lang=" +
    lang +
    "&appid=" +
    apiKey;
  return url;
}
function getData(city, apiKey, lang, unit) {
  let url = assembleURL(city, apiKey, lang, unit);
  return fetch(url)
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(function (data) {
      var currentWeather = {
        weather: data.weather[0].description,
        weatherID: data.weather[0].id,
        celsius: Math.round(parseFloat(data.main.temp)),
        wind: data.wind.speed,
        location: data.name,
      };
      let toString = JSON.stringify(currentWeather);
      fs.writeFile("./weather.json", toString, (err) => {
        if (err) {
          console.log("Error while writing", err);
        } else {
          console.log("Successful write");
        }
      });
      return currentWeather;
    })
    .catch((err) => {
      console.log("caught it!", err);
    });
}
module.exports = { getData };

//bsp answer in de
//{"coord":{"lon":8.2,"lat":48.05},
// "weather":[{"id":804,"main":"Clouds","description":"Bedeckt","icon":"04n"}],
// "base":"stations","main":{"temp":7.54,"feels_like":6.21,"temp_min":6.11,"temp_max":8.89,"pressure":1020,"humidity":87},
// "visibility":10000,"wind":{"speed":0.45,"deg":254,"gust":2.68},
// "clouds":{"all":98},"dt":1608485265,
// "sys":{"type":3,"id":20163,"country":"DE","sunrise":1608448448,"sunset":1608478545},
// "timezone":3600,"id":2923521,"name":"Furtwangen im Schwarzwald","cod":200}
