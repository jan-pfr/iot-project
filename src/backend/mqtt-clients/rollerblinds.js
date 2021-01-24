const mqtt = require("mqtt");
const config = require("./../../config.json");
const paths = config.paths;
const mqtt_client = mqtt.connect(`mqtt://localhost:${config.mqtt_port}`, {
  clientId: "rollerblinds",
});

var sunrise;
var sunset;
var outside_temperature;
var simulation_interval = 33.33;

const isAutomatic = true;
const hot_temperature = 28;
var initialised;

var roller_blinds = {
  bathroom: {
    status: 0,
    target: 0,
    mode: isAutomatic,
  },
  kitchen: {
    status: 0,
    target: 0,
    mode: isAutomatic,
  },
  bedroom: {
    status: 0,
    target: 0,
    mode: isAutomatic,
  },
  livingroom: {
    status: 0,
    target: 0,
    mode: isAutomatic,
  },
};

mqtt_client.on("connect", () => {
  subscribe(paths.weather);
  subscribe(paths.blinds + "/in");
  subscribe(paths.simulation_speed);
});

mqtt_client.on("message", function (topic, message) {
  message = JSON.parse(message);

  if (topic === paths.weather) {
    outside_temperature = message.temperature;
    sunrise = convertUnixTimestamp(message.sunrise);
    sunset = convertUnixTimestamp(message.sunset);

    // Initialise heating_elements at first message from weather station
    !initialised ? initialise() : undefined;
  }
  if (topic == paths.blinds + "/in" && initialised) {
    for (const room in message) {
      for (const property in message[room]) {
        roller_blinds[room][property] = message[room][property];
      }
    }
  }
});

function convertUnixTimestamp(unix_timestamp) {
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  return hours;
}
function simulateBlinds() {
  for (const room in roller_blinds) {
    if (roller_blinds[room].target > roller_blinds[room].target) {
      var i = roller_blinds[room].status;
      for (; i > roller_blinds[room].target; i++) {
        roller_blinds[room].status++;
      }
    } else if (roller_blinds[room].target < roller_blinds[room].target) {
      var i = roller_blinds[room].status;
      for (; i < roller_blinds[room].target; i--) {
        roller_blinds[room].status--;
      }
    }
  }
}
function initialise() {
  initialised = true;

  setInterval(() => {
    publishData();
    simulateBlinds();
  }, simulation_interval);
}

function publishData() {
  mqtt_client.publish(paths.blinds, JSON.stringify(roller_blinds));
}

for (const key in roller_blinds) {
  var currentdate = new Date();
  var currentHours = currentdate.getHours();
  if (roller_blinds[key].mode === isAutomatic) {
    let isHotOutside = hot_temperature < outside_temperature;

    if (isHotOutside) {
      roller_blinds[key].status = 100;
    }

    let isDarkOutside = (currentHours > sunset) || currentHours < sunrise;
    if (isDarkOutside) {
      roller_blinds[key].status = 100;
    } else {
      roller_blinds[key].status = 0;
    }
  }
}
function subscribe(topic) {
  mqtt_client.subscribe(topic, () => {
    console.log("Subscribed on %s", topic);
  });
}
