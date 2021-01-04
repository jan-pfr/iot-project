const express = require("express");
const http = require("http");
const mqtt = require("mqtt");

var client_options = {
  clientId: "http-server",
};

var mqtt_status = {
  weather: null,
};

const mqtt_client = mqtt.connect("mqtt://localhost:1885", client_options);
const app = express();
const router = express.Router();

//On connecting to the broker subscribe to topic
mqtt_client.on("connect", function () {
  topic = "local/temperature";
  mqtt_client.subscribe(topic, () => {
    console.log("Subscribed on %s", topic);
  });
});

//Printing incoming messages to topic
mqtt_client.on("message", function (topic, message) {
  console.log("%s : %s", topic, message);

  if (topic == "local/temperature") {
    mqtt_status.weather = message;
  }
});

router.get("/status/all", (req, res) => {
  res.status(200).json({
    weather: mqtt_status.weather.toString(),
  });
});

router.get("/settemperature/:id/:degrees", (req, res) => {
  id = req.params.id;
  degrees = req.params.degrees;

  if (roomExists(id)) {
    oldTemperature = roomTemperatures[id];

    roomTemperatures[id] = degrees;

    res.status(200).json({
      RoomId: id,
      "Old temperature": oldTemperature,
      "New temperature": degrees,
    });
  } else {
    return404();
  }
});

app.use(router);

const http_port = process.env.PORT || 3000;

const http_server = http.createServer(app);

http_server.listen(http_port);

function return404(res) {
  return res.status(404).json({
    message: "Room does not exist",
  });
}
