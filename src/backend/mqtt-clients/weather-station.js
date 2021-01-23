const mqtt = require("mqtt");
const owm = require("../lib/owm-call");
const config = require("../../config.json");
const paths = config.paths;

const mqtt_client = mqtt.connect(`mqtt://localhost:${config.mqtt_port}`, {
  clientId: "weather-station",
});

var weatherData;
var alert;

//Initialize with current data then publish
owm.getWeatherData().then((data) => {
  weatherData = data;
  owm.getAlerts(weatherData.lat, weatherData.lon).then((data) =>{
    alert = data;
    if (typeof alert === "object"){
      mqtt_client.publish(paths.alert, JSON.stringify(alert));
    }
  });
  mqtt_client.publish(paths.weather, JSON.stringify(weatherData));
});

//Update weather data every 10 minutes and looking for alerts in the selected region (= OW API refresh cycle)
setInterval(() => {
  owm.getWeatherData().then((data) => (weatherData = data));
   owm.getAlerts(weatherData.lat, weatherData.lon).then((data) =>{
     alert = data;
     if (typeof alert === "object"){
       mqtt_client.publish(paths.alert, JSON.stringify(alert));
     }
   });
}, 600000);

//Publish current weather data every 2 seconds
setInterval(() => {
  mqtt_client.publish(paths.weather, JSON.stringify(weatherData));
}, 2000);
