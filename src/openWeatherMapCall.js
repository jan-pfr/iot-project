const fetch = require('node-fetch');
const config = require('../config/config.json');
const fs = require('fs');
const owmConfig = config.owm;
const delay = 600000; //10 min, da OWM sowieso nur alle 10 min ihre daten updated.
let lastUpdate = 0;

getData(assembleURL(owmConfig.city, owmConfig.owmapikey, owmConfig.lang, "metric"));

function assembleURL (city, apiKey, lang, units){
    let url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&lang=" + lang + "&appid=" + apiKey;
    console.log("url: " + url);
    return url;
}
function getData(url){
    console.log(lastUpdate);
    if (lastUpdate >= (Date.now() - delay))
        return;
    lastUpdate = Date.now();
    fetch(url)
        .then(function(resp) { return resp.json() }) // Convert data to json
        .then(function(data) {
            drawData(data);
        })
        .catch( err => {
            console.log('caught it!',err);
        });
}
function drawData(data){
    let currentWeather = {
        weather: data.weather[0].description,
        weatherID: data.weather[0].id,
        celsius: Math.round(parseFloat(data.main.temp)),
        wind: data.wind.speed
    };
    let toString = JSON.stringify(currentWeather);
    fs.writeFile('../config/weather.json', toString, err => {
        if (err) {
            console.log('Error while writing', err)
        } else {
            console.log('Successful write')
        }
    })
}
//bsp answer in de
//{"coord":{"lon":8.2,"lat":48.05},
// "weather":[{"id":804,"main":"Clouds","description":"Bedeckt","icon":"04n"}],
// "base":"stations","main":{"temp":7.54,"feels_like":6.21,"temp_min":6.11,"temp_max":8.89,"pressure":1020,"humidity":87},
// "visibility":10000,"wind":{"speed":0.45,"deg":254,"gust":2.68},
// "clouds":{"all":98},"dt":1608485265,
// "sys":{"type":3,"id":20163,"country":"DE","sunrise":1608448448,"sunset":1608478545},
// "timezone":3600,"id":2923521,"name":"Furtwangen im Schwarzwald","cod":200}

