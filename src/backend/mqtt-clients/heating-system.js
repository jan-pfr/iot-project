const mqtt = require("mqtt");
const config = require("./../../config.json");
const paths = config.paths;

const mqtt_client = mqtt.connect(`mqtt://localhost:${config.mqtt_port}`, {
  clientId: "heating-system",
});

var initialised;

// Simulation values
var simulation_interval = 33.33;
var simulation_speed = 1;
var heating_power = 1;
var heating_increase = 0.005;
var temperature_decay = 0.00125;

var outside_temperature;

// Initial values
const ideal_temperature = 23;
const isAutomatic = true;

// Data
var heating_elements = {
  bathroom: {
    target_temperature: ideal_temperature,
    actual_temperature: undefined,
    power: false,
    mode: isAutomatic,
  },
  kitchen: {
    target_temperature: ideal_temperature,
    actual_temperature: undefined,
    power: false,
    mode: isAutomatic,
  },
  bedroom: {
    target_temperature: ideal_temperature,
    actual_temperature: undefined,
    power: false,
    mode: isAutomatic,
  },
  livingroom: {
    target_temperature: ideal_temperature,
    actual_temperature: undefined,
    power: false,
    mode: isAutomatic,
  },
};

// Subscribing to topics
mqtt_client.on("connect", () => {
  subscribe(paths.weather);
  subscribe(paths.heating + "/in");
  subscribe(paths.simulation_speed);
});

// Event handlers on incoming messages
mqtt_client.on("message", function (topic, message) {
  message = JSON.parse(message);

  if (topic == paths.weather) {
    outside_temperature = message.temperature;

    // Initialise heating_elements at first message from weather station
    !initialised ? initialise() : undefined;
  }
  if (topic == paths.heating + "/in" && initialised) {
    for (const room in message) {
      for (const property in message[room]) {
        heating_elements[room][property] = message[room][property];
      }
    }
  }
  if (topic == paths.simulation_speed) {
    simulation_speed = +message;
    setSimulationVariables();
  }
});

//hello world

// Main functions
function simulateCycle() {
  // Update heating element on/off state based on mode (auto/manual)
  for (const room in heating_elements) {
    // If heating element has not reached target temperature and its colder outside => turn on
    // Else => turn off
    // But only if heating element is automatic
    if (heating_elements[room].mode) {
      shouldBeOn =
        heating_elements[room].actual_temperature <=
          heating_elements[room].target_temperature &&
        outside_temperature < heating_elements[room].target_temperature;
      shouldBeOn
        ? (heating_elements[room].power = true)
        : (heating_elements[room].power = false);
    }
  }

  // Update temperature based on heating element on/off state and outside temperature
  for (const key in heating_elements) {
    let delta_temperature = 0;

    if (heating_elements[key].power) {
      delta_temperature += heating_increase;
    }

    let isColderOutside = ideal_temperature > outside_temperature;
    let doesNotExceedOutsideTemperature =
      (heating_elements[key].actual_temperature > outside_temperature &&
        isColderOutside) ||
      (heating_elements[key].actual_temperature < outside_temperature &&
        !isColderOutside);
    if (doesNotExceedOutsideTemperature) {
      if (isColderOutside) {
        delta_temperature -= temperature_decay;
      } else {
        delta_temperature += temperature_decay;
      }
    }
    heating_elements[key].actual_temperature += delta_temperature;
  }
}

// Setting randomised values for heating element initialization
function initialise() {
  setSimulationVariables();
  // Calculating the maximum possible difference from the ideal temperature;
  let max_range = ideal_temperature - outside_temperature;

  for (const key in heating_elements) {
    initial_temperature =
      outside_temperature + Math.floor(Math.random() * max_range);
    heating_elements[key].actual_temperature = initial_temperature;
  }

  initialised = true;

  // Publish once and set intervals for publishing and simulation
  setInterval(() => {
    publishData();
    simulateCycle();
  }, simulation_interval);
}

// Helper function
function publishData() {
  mqtt_client.publish(paths.heating, JSON.stringify(heating_elements));
}

function subscribe(topic) {
  mqtt_client.subscribe(topic, () => {
    console.log("Subscribed on %s", topic);
  });
}

function setSimulationVariables() {
  heating_increase =
    ((0.005 * heating_power) / simulation_interval) * simulation_speed;
  temperature_decay = (0.00125 / simulation_interval) * simulation_speed;
}
