const mqtt = require("mqtt");
const owm = require("../openWeatherMapCall");

const mqtt_client = mqtt.connect("mqtt://localhost:1885", {
  clientId: "weather-station",
});

const topic = "local/temperature";

var weatherData;

//Initialize with current data then publish
owm.getWeatherData().then((data) => {
  weatherData = data;
  mqtt_client.publish(topic, weatherData);
});

//Update weather data every 10 minutes (= OW API refresh cycle)
setInterval(() => {
  owm.getWeatherData().then((data) => (weatherData = data));
}, 600000);

//Publish current weather data every 2 seconds
setInterval(() => {
  mqtt_client.publish(topic, weatherData);
}, 2000);
