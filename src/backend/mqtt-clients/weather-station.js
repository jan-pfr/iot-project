const mqtt = require("mqtt");
const owm = require("../openWeatherMapCall");

const client_options = {
  clientId: "weather-station",
};

const mqtt_client = mqtt.connect("mqtt://localhost:1885", client_options);

const topic = "local/temperature";
var weatherData = "";

initialise();

//Update weather data every 10 minutes (= OW API refresh cycle)
setInterval(() => {
  owm.getWeatherData().then((data) => (weatherData = data));
}, 600000);

//Publish current weather data every 2 seconds
setInterval(() => {
  publish();
}, 2000);

//Initialize with current data then publish
function initialise() {
  owm.getWeatherData().then((data) => {
    weatherData = data;
    publish();
  });
}

//Helper function for publishing current weather data
function publish() {
  mqtt_client.publish(topic, weatherData);
  console.log("%s : %s", topic, weatherData);
}
