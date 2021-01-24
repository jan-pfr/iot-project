const mqtt = require("mqtt");
const config = require("./../../config.json");
const paths = config.paths;
const mqtt_client = mqtt.connect(`mqtt://localhost:${config.mqtt_port}`, {
  clientId: "rollerblinds",
});

var sunrise = 0;
var sunset = 0;
var outside_temperature;
var simulationInterval = 33.33;

const isAutomatic = true;
const hotTemperature = 28;
var initialisedBlinds;
//roller blinds
var rollerBlinds = {
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
});

mqtt_client.on("message", function (topic, message) {
  message = JSON.parse(message);

  if (topic === paths.weather) {
    outside_temperature = message.temperature;
    sunrise = convertUnixTimestamp(message.sunrise);
    sunset = convertUnixTimestamp(message.sunset);

    // Initialise blinds at first message from weather station
    !initialisedBlinds ? initialise() : undefined;
  }
  if (topic === paths.blinds + "/in" && initialisedBlinds) {
    for (const room in message) {
      for (const property in message[room]) {
        rollerBlinds[room][property] = message[room][property];
      }
    }
  }
});

//Converting Unix Timestamps
function convertUnixTimestamp(unixTimestamp) {
  var date = new Date(unixTimestamp * 1000);
  var hours = date.getHours();
  return hours;

}
//roller binds cycle Simulation
function simulateBlinds() {
  for (const room in rollerBlinds) {
    var currentHours = new Date().getHours();
    //Bei automatischen Rollläden 
    if (rollerBlinds[room].mode) {
     // Rollladen Steuerung Sonnenabhängig
      if(currentHours >= sunset || currentHours <= sunrise){
        rollerBlinds[room].target = 100;
      }else {
        rollerBlinds[room].target = 0;
      }

      // depends on outside temperature
      if (outside_temperature >= hotTemperature) {
        rollerBlinds[room].target = 100;
      }
    }

    //simulation of the going up and down of the roller binds
    if (rollerBlinds[room].status <= rollerBlinds[room].target) {
      for (let x = rollerBlinds[room].status; x <= rollerBlinds[room].target-0.5; x++) {
        rollerBlinds[room].status += 0.05;
      }
    }
    if (rollerBlinds[room].status >= rollerBlinds[room].target) {
      for (let y = rollerBlinds[room].target; y <= rollerBlinds[room].status+0.5; y++) {
        rollerBlinds[room].status -= 0.05;
      }
    }
  }
}
function initialise() {
  initialisedBlinds = true;
  // Publish once and set intervals for publishing and simulation
  setInterval(() => {
    publishData();
    simulateBlinds();
  }, simulationInterval);
}

// Helper functions
function publishData() {
  mqtt_client.publish(paths.blinds, JSON.stringify(rollerBlinds));
}

function subscribe(topic) {
  mqtt_client.subscribe(topic, () => {
    console.log("Subscribed on %s", topic);
  });
}
