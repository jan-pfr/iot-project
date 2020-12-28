const mqtt = require('mqtt');
const owm = require('./lib/openWeatherMapCall');
const client = mqtt.connect('mqtt://localhost:1885');
const fs = require('fs');
const config = require('../config/config.json');
const owmConfig = config.owm;
let weatherData = {};

owm.getData(owm.assembleURL(owmConfig.city, owmConfig.owmapikey, owmConfig.lang, "metric"));
fs.readFile('../config/weather.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log(" readFile weather.json failed:", err)
        return
    }
    try {
        weatherData = JSON.parse(jsonString);
        console.log("successfull read " + weatherData.weatherID);
    } catch(err) {
        console.log('Error parsing JSON string:', err)
    }
})

setInterval(_ => {
    owm.getData(owm.assembleURL(owmConfig.city, owmConfig.owmapikey, owmConfig.lang, "metric"));
    fs.readFile('../config/weather.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log(" readFile weather.json failed:", err)
            return
        }
        try {
            weatherData = JSON.parse(jsonString);
        } catch(err) {
            console.log('Error parsing JSON string:', err)
        }
    })
    client.publish("local/condition", weatherData.weatherID);
    console.log('successful publish of wID' + weatherData.weatherID);
}, 600000); //10 min

setInterval(_ => {
    client.publish("local/temperature", weatherData.celsius);
    console.log('successful publish of ' + weatherData.celsius + ' celsius');
    }, 30000); //30 sec