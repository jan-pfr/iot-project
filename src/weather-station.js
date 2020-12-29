const mqtt = require('mqtt');
const owm = require('./lib/openWeatherMapCall');
const client = mqtt.connect('mqtt://localhost:1885');
const fs = require('fs');
const config = require('../config/config.json');
const owmConfig = config.owm;
let weatherData = {};

//owm.getData(owm.assembleURL(owmConfig.city, owmConfig.owmapikey, owmConfig.lang, "metric"));
fs.watch('../config/weather.json', 'utf8', (eventType, filename) => {
    if (eventType === 'change') {
        fs.readFile('../config/weather.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log(" readFile weather.json failed:", err)
                return
            }
            try {
                weatherData = JSON.parse(jsonString);
                console.log("successfull read " + weatherData.celsius);
            } catch(err) {
                console.log('Error parsing JSON string:', err)
            }
        })
    }
});

/*
*/
setInterval(_ => {
    owm.getData(owm.assembleURL(owmConfig.city, owmConfig.owmapikey, owmConfig.lang, "metric"));
    fs.watch('../config/weather.json', 'utf8', (eventType) => {
        if (eventType === 'change') {
            fs.readFile('../config/weather.json', 'utf8', (err, jsonString) => {
                if (err) {
                    console.log(" readFile weather.json failed:", err)
                    return
                }
                try {
                    weatherData = JSON.parse(jsonString);
                    console.log("successfull read " + weatherData.celsius);
                } catch(err) {
                    console.log('Error parsing JSON string:', err)
                }
            })
        }
    });
    client.publish("local/condition", toString(weatherData.weatherID));
    console.log('successful publish of wID ' + weatherData.weatherID);
}, 600000); //10 min, 600000

setInterval(_ => {
    client.publish("local/temperature", toString(weatherData.celsius));
    console.log('successful publish of ' + weatherData.celsius + ' celsius');
    }, 30000); //3 sec