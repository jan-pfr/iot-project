const mqtt = require("mqtt");

const client_options = {
  clientId: "heating-system",
};

const mqtt_client = mqtt.connect("mqtt://localhost:1885", client_options);
let initialised = false;

const weather_topic = "local/weather";
const heating_values_topic = "appliances/heating";
const heating_status_topic = "appliances/status";
const heating_status_change_topic = "appliances/status/change";

var outside_temperature = null;
const ideal_temperature = 23;
var isAutomatic = true;

var heating_elements = {
  bathroom: {
    temperature: null,
    isTurnedOn: false,
  },
  kitchen: {
    temperature: null,
    isTurnedOn: false,
  },
  bedroom: {
    temperature: null,
    isTurnedOn: false,
  },
  livingroom: {
    temperature: null,
    isTurnedOn: false,
  },
};

//On connecting to the broker subscribe to topic
mqtt_client.on("connect", function () {
  mqtt_client.subscribe(weather_topic, () => {
    console.log("Subscribed on %s", weather_topic);
  });
  mqtt_client.subscribe(heating_status_change_topic, () => {
    console.log("Subscribed on %s", heating_status_change_topic);
  });
});

//Printing incoming messages to topic
mqtt_client.on("message", function (topic, message) {
  //   console.log("%s : %s", topic, message);

  if (topic == weather_topic) {
    message = JSON.parse(message);
    outside_temperature = message.temperature;

    //Initialise heating_elements with calculated temperature only ONCE
    !initialised ? initialise() : undefined;
  }
  if (topic == heating_status_change_topic) {
    message = JSON.parse(message);
  }
});

setInterval(() => {
  publishTemperatures();
  publishStatus();
}, 2000);

setInterval(() => {
  updateHeatingValues();
}, 10000);

//Helper function for publishing current heating temperature data
function publishTemperatures() {
  let temperatures = getCurrentTemperatures();
  mqtt_client.publish(heating_values_topic, temperatures);
  console.log("%s : %s", heating_values_topic, temperatures);
}

//Helper function for publishing current appliance state data
function publishStatus() {
  let status = getCurrentStatus();
  mqtt_client.publish(heating_status_topic, status);
  console.log("%s : %s", heating_status_topic, status);
}

function updateHeatingValues() {
  //Update heating element on/off state based on mode (auto/manual)
  if (isAutomatic) {
    for (const key in heating_elements) {
      //If heating element has not reached ideal temperature and its cold outside => turn on
      //Else => turn off
      shouldBeOn =
        heating_elements[key].temperature <= ideal_temperature - 0.75 &&
        outside_temperature < ideal_temperature;
      shouldBeOn
        ? (heating_elements[key].isTurnedOn = true)
        : (heating_elements[key].isTurnedOn = false);
    }
  }

  //Update temperature based on heating element on/off state and outside temperature
  for (const key in heating_elements) {
    delta_temperature = 0;

    if (heating_elements[key].isTurnedOn) {
      delta_temperature += 1;
    }

    if (outside_temperature < ideal_temperature) {
      delta_temperature -= 0.25;
    } else if (outside_temperature > ideal_temperature) {
      delta_temperature += 0.25;
    }
    heating_elements[key].temperature += delta_temperature;
  }
}

function getCurrentTemperatures() {
  temperatures = {};
  for (const key in heating_elements) {
    temperatures[key] = heating_elements[key].temperature;
  }
  return JSON.stringify(temperatures);
}

function getCurrentStatus() {
  status = {};
  for (const key in heating_elements) {
    status[key] = heating_elements[key].isTurnedOn;
  }
  return JSON.stringify(status);
}

//Setting default values for heating device initialization
function initialise() {
  //Calculating the maximum possible difference from the ideal temperature;
  range = ideal_temperature - outside_temperature;

  for (const key in heating_elements) {
    initial_temperature =
      outside_temperature + Math.floor(Math.random() * range);
    heating_elements[key].temperature = initial_temperature;
  }

  console.log(heating_elements);

  initialised = true;
}
