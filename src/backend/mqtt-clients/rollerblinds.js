const mqtt = require("mqtt");
const config = require("./../../config.json");
const paths = config.paths;
const mqtt_client = mqtt.connect(`mqtt://localhost:${config.mqtt_port}`, {
  clientId: "rollerblinds",
});

var sunrise = 0;
var sunset = 0;
var outside_temperature;
var simulation_interval = 33.33;

const isAutomatic = true;
const hot_temperature = 28;
var initialisedBlinds;

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
    !initialisedBlinds ? initialise() : undefined;
  }
  if (topic == paths.blinds + "/in" && initialisedBlinds) {
    for (const room in message) {
      for (const property in message[room]) {
        roller_blinds[room][property] = message[room][property];
        console.log("ich bin in rollerblinds",roller_blinds[room][property]);
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
    var currentHours = new Date().getHours();
    if (roller_blinds[room].mode) {
      if(currentHours >= sunset || currentHours <= sunrise){
        roller_blinds[room].target = 100;
      }else {
        roller_blinds[room].target = 0;
      }
      if (outside_temperature >= hot_temperature) {
        roller_blinds[room].target = 100;
      }
    }
    if (roller_blinds[room].status <= roller_blinds[room].target) {
      for (let x = roller_blinds[room].status; x <= roller_blinds[room].target-0.5; x++) {
        roller_blinds[room].status = roller_blinds[room].status + 0.05;
        console.log("1 ",roller_blinds[room], roller_blinds[room].status, " %")
      }
    }
    if (roller_blinds[room].status >= roller_blinds[room].target) {
      console.log("bla");
      for (let y = roller_blinds[room].target; y <= roller_blinds[room].status+0.5; y++) {
        roller_blinds[room].status = roller_blinds[room].status - 0.05;
        console.log("2 ", roller_blinds[room], roller_blinds[room].status, " %")
      }
    }
  }
}
function initialise() {
  initialisedBlinds = true;

  setInterval(() => {
    publishData();
    simulateBlinds();
  }, simulation_interval);
}

function publishData() {
  mqtt_client.publish(paths.blinds, JSON.stringify(roller_blinds));
  console.log("3 ",roller_blinds.bathroom);
}

function subscribe(topic) {
  mqtt_client.subscribe(topic, () => {
    console.log("Subscribed on %s", topic);
  });
}
