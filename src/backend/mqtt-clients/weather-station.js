const mqtt = require("mqtt");
const owm = require("../lib/owm-call");
const config = require("../../config.json");
const paths = config.paths;

const mqtt_client = mqtt.connect(`mqtt://localhost:${config.mqtt_port}`, {
  clientId: "weather-station",
});

var weatherData;

//Initialize with current data then publish
owm.getWeatherData().then((data) => {
  weatherData = data;
  mqtt_client.publish(paths.weather, weatherData);
});

//Update weather data every 10 minutes (= OW API refresh cycle)
setInterval(() => {
  owm.getWeatherData().then((data) => (weatherData = data));
}, 600000);

//Publish current weather data every 2 seconds
setInterval(() => {
  mqtt_client.publish(paths.weather, weatherData);
}, 2000);
