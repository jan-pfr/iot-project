const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const config = require("./config.json");

var client_options = {
  clientId: "http-server",
};

var mqtt_status = {
  weather: {
    temperature: null,
    city: config.city,
  },
  blinds: null,
};

const mqtt_client = mqtt.connect("mqtt://localhost:1885", client_options);

//On connecting to the broker subscribe to topic
mqtt_client.on("connect", function () {
  topic = "local/weather";
  mqtt_client.subscribe(topic, () => {
    console.log("Subscribed on %s", topic);
  });
});

//Printing incoming messages to topic
mqtt_client.on("message", function (topic, message) {
  message = message.toString();
  console.log("%s : %s", topic, message);

  if (topic == "local/weather") {
    mqtt_status.weather = message;
  }
});

const app = express();
const router = express.Router();

// Setting CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  // res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

router.get("/status/all", (req, res, next) => {
  res.status(200).send(mqtt_status);
});

router.get("/status/:device/", (req, res) => {
  device = req.params.device;
  value = mqtt_status[device];

  if (isSet(device)) {
    res.status(200).send(value);
  } else {
    send404();
  }
});

app.use(router);

const http_port = process.env.PORT || 3000;

const http_server = http.createServer(app);

http_server.listen(http_port);

function isSet(of) {
  for (const [device, value] of Object.entries(mqtt_status)) {
    if (device == of) {
      return value != null;
    }
  }
}

function send404() {
  return res.status(404).json();
}
