const mqtt = require('mqtt');
const owm = require('./openWeatherMapCall');
const client = mqtt.connect('mqtt://localhost:1885');
const config = require('../../config/config.json');
const owmConfig = config.owm;
let weatherData = {};

owm.getData(owmConfig.city, owmConfig.owmapikey, owmConfig.lang, "metric").then((data) => {
    weatherData = data;
    console.log('Initial Data '+ JSON.stringify(weatherData));
});


setInterval(_ => {
    owm.getData(owmConfig.city, owmConfig.owmapikey, owmConfig.lang, "metric").then((data) => {
        weatherData = data;
        console.log(data);
    });
    client.publish("local/condition", toString(weatherData.weatherID));
    console.log('successful publish of wID ' + weatherData.weatherID);
}, 600000); //10 min, 600000

setInterval(_ => {
    client.publish("local/temperature", toString(weatherData.celsius));
    console.log('successful publish of ' + weatherData.celsius + ' celsius');
    }, 30000); //30 sec


