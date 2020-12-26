const fetch = require('node-fetch');
const config = require('../config/config.json');
const owmConfig = config.owm;
const delay = 600000; //10 min, da OWM sowieso nur alle 10 min ihre daten updated.
var lastUpdate = 0;

getData(assembleURL(owmConfig.default_city, owmConfig.owmapikey, owmConfig.default_lang, "metric"));

function assembleURL (city, apiKey, lang, units){
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+units+"&lang="+lang+"&appid="+apiKey;
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
    var weather = data.weather[0].description;
    var weatherID = data.weather[0].id;
    var celsius = Math.round(parseFloat(data.main.temp))
    var wind = data.wind.speed;
    console.log("weather: "+ weather + ", celsius: " + celsius + ", wind: " + wind + " km/h" + ", weatherID: " + weatherID)
}

//bsp answer in en
//{"coord":{"lon":8.2,"lat":48.05},
// "weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],
// "base":"stations","main":{"temp":280.86,"feels_like":279.12,"temp_min":279.26,"temp_max":282.59,"pressure":1020,"humidity":87},
// "visibility":10000,
// "wind":{"speed":1.08,"deg":245},
// "clouds":{"all":98},"dt":1608482575,
// "sys":{"type":3,"id":20163,"country":"DE","sunrise":1608448448,"sunset":1608478545},
// "timezone":3600,"id":2923521,"name":"Furtwangen im Schwarzwald","cod":200}

//bsp answer in de
//{"coord":{"lon":8.2,"lat":48.05},
// "weather":[{"id":804,"main":"Clouds","description":"Bedeckt","icon":"04n"}],
// "base":"stations","main":{"temp":7.54,"feels_like":6.21,"temp_min":6.11,"temp_max":8.89,"pressure":1020,"humidity":87},
// "visibility":10000,"wind":{"speed":0.45,"deg":254,"gust":2.68},
// "clouds":{"all":98},"dt":1608485265,
// "sys":{"type":3,"id":20163,"country":"DE","sunrise":1608448448,"sunset":1608478545},
// "timezone":3600,"id":2923521,"name":"Furtwangen im Schwarzwald","cod":200}

