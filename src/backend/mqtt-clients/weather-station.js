const mqtt = require("mqtt");
const owm = require("../openWeatherMapCall");

var owm_config = {
  apikey: "df85738b893855278d6f48eb35250501",
  lang: "de",
  city: "Furtwangen",
  unit: "metric",
};

var client_options = {
  clientId: "weather-station",
};

var weatherData = {};

const mqtt_client = mqtt.connect("mqtt://localhost:1885", client_options);

owm
  .getData(owm_config.city, owm_config.apikey, owm_config.lang, owm_config.unit)
  .then((data) => {
    weatherData = data;
    console.log("Initial Data " + JSON.stringify(weatherData));
  });

setInterval((_) => {
  owm
    .getData(
      owm_config.city,
      owm_config.apikey,
      owm_config.lang,
      owm_config.unit
    )
    .then((data) => {
      weatherData = data;
      console.log(data);
    });
  mqtt_client.publish("local/condition", toString(weatherData.weatherID));
  console.log("successful publish of wID " + weatherData.weatherID);
}, 600000); //10 min, 600000

setInterval((_) => {
  topic = "local/temperature";
  message = weatherData.celsius.toString();
  mqtt_client.publish(topic, message);
  console.log("%s : %s", topic, message);
}, 30000); //30 sec

// setInterval((_) => {
//   topic = "test";
//   message = weatherData.celsius.toString();
//   // console.log(weatherData.celsius);
//   mqtt_client.publish(topic, message);
//   console.log("Published %s on %s", message, topic);
// }, 1000); //1 sec
