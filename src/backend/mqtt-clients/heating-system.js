const mqtt = require("mqtt");

const client_options = {
  clientId: "heating-system",
};

const mqtt_client = mqtt.connect("mqtt://localhost:1885", client_options);
let initialised = false;

const weather_topic = "local/temperature";
const heating_topic = "appliances/heating";

var outside_temperature = null;

// Initial values
const ideal_temperature = 23;
const isAutomatic = true;

var heating_elements = {
  bathroom: {
    target_temperature: ideal_temperature,
    actual_temperature: null,
    isTurnedOn: false,
    isAutomatic: isAutomatic,
  },
  kitchen: {
    target_temperature: ideal_temperature,
    actual_temperature: null,
    isTurnedOn: false,
    isAutomatic: isAutomatic,
  },
  bedroom: {
    target_temperature: ideal_temperature,
    actual_temperature: null,
    isTurnedOn: false,
    isAutomatic: isAutomatic,
  },
  livingroom: {
    target_temperature: ideal_temperature,
    actual_temperature: null,
    isTurnedOn: false,
    isAutomatic: isAutomatic,
  },
};

// function getModes() {
//   let modes = {};
//   for (const key in heating_elements) {
//     modes[key] = heating_elements[key].isAutomatic;
//   }
//   return JSON.stringify(modes);
// }

//On connecting to the broker subscribe to topic
mqtt_client.on("connect", function () {
  mqtt_client.subscribe(weather_topic, () => {
    console.log("Subscribed on %s", weather_topic);
  });
  mqtt_client.subscribe(heating_topic, () => {
    console.log("Subscribed on %s", heating_topic);
  });
});

//Printing incoming messages to topic
mqtt_client.on("message", function (topic, message) {
  if (topic == weather_topic) {
    message = JSON.parse(message);
    outside_temperature = message.temperature;

    //Initialise heating_elements with calculated temperature only ONCE
    !initialised ? initialise() : undefined;
  }
  if (topic == heating_topic && initialised) {
    message = JSON.parse(message);
    for (const room in message) {
      for (const property in message[room]) {
        heating_elements[room][property] = message[room][property];
      }
    }
  }
});

//Helper function for publishing current heating data
function publishData() {
  mqtt_client.publish(heating_topic, JSON.stringify(heating_elements));
}

function updateHeatingValues() {
  //Update heating element on/off state based on mode (auto/manual)
  if (isAutomatic) {
    for (const key in heating_elements) {
      //If heating element has not reached ideal temperature and its cold outside => turn on
      //Else => turn off
      shouldBeOn =
        heating_elements[key].actual_temperature <= ideal_temperature - 0.75 &&
        outside_temperature < ideal_temperature;
      shouldBeOn
        ? (heating_elements[key].isTurnedOn = true)
        : (heating_elements[key].isTurnedOn = false);
    }
  }

  //Update temperature based on heating element on/off state and outside temperature
  for (const key in heating_elements) {
    let delta_temperature = 0;

    if (heating_elements[key].isTurnedOn) {
      delta_temperature += 1;
    }

    let isColderOutside = ideal_temperature > outside_temperature;
    let doesNotExceedOutsideTemperature =
      (heating_elements[key].actual_temperature > outside_temperature &&
        isColderOutside) ||
      (heating_elements[key].actual_temperature < outside_temperature &&
        !isColderOutside);
    if (doesNotExceedOutsideTemperature) {
      if (isColderOutside) {
        delta_temperature -= 0.25;
      } else {
        delta_temperature += 0.25;
      }
    }
    heating_elements[key].actual_temperature += delta_temperature;
  }
}

//Setting default values for heating device initialization
function initialise() {
  //Calculating the maximum possible difference from the ideal temperature;
  range = ideal_temperature - outside_temperature;

  for (const key in heating_elements) {
    initial_temperature =
      outside_temperature + Math.floor(Math.random() * range);
    heating_elements[key].actual_temperature = initial_temperature;
  }

  initialised = true;
  publishData();
  setInterval(() => {
    updateHeatingValues();
    publishData();
  }, 2000);
}
