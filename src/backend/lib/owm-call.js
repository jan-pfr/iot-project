const fetch = require("node-fetch");
const config = {
  apikey: "df85738b893855278d6f48eb35250501",
  lang: "de",
  city: "Furtwangen",
  unit: "metric",
  test_id: 3384868,
};

const hotLocation = false;

const URL = getURL();

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
        city: data.name,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      };
      return JSON.stringify(weatherData);
    });
}

//Assembles API URL based on hot/cold location
function getURL() {
  let url = "http://api.openweathermap.org/data/2.5/weather?";
  if (hotLocation) {
    //Get data for hot location (Brazil)
    url += "id=" + config.test_id;
  } else {
    //Get data for cold location (Furtwangen)
    url += "q=" + config.city;
  }
  return (
    url +
    "&units=" +
    config.unit +
    "&lang=" +
    config.lang +
    "&appid=" +
    config.apikey
  );
}
module.exports = { getWeatherData };
