const mqtt = require("mqtt");
const config = require("./../../config.json");
const paths = config.paths;

const mqttClient = mqtt.connect(`mqtt://localhost:${config.mqtt_port}`, {
  clientId: "heating-system",
});

var initialised;

// Simulation values
var simulationInterval = 33.33;
var simulationSpeed = 1;
var heatingPower = 1;
var heatingIncrease = 0.005;
var temperatureDecay = 0.00125;

var outsideTemperature;

// Initial values
const idealTemperature = 23;
const isAutomatic = true;

// Data
var heatingElements = {
  bathroom: {
    targetTemperature: idealTemperature,
    actualTemperature: undefined,
    power: false,
    mode: isAutomatic,
  },
  kitchen: {
    targetTemperature: idealTemperature,
    actualTemperature: undefined,
    power: false,
    mode: isAutomatic,
  },
  bedroom: {
    targetTemperature: idealTemperature,
    actualTemperature: undefined,
    power: false,
    mode: isAutomatic,
  },
  livingroom: {
    targetTemperature: idealTemperature,
    actualTemperature: undefined,
    power: false,
    mode: isAutomatic,
  },
};

// Subscribing to topics
mqttClient.on("connect", () => {
  subscribe(paths.weather);
  subscribe(paths.heating + "/in");
  subscribe(paths.simulationSpeed);
});

// Event handlers on incoming messages
mqttClient.on("message", function (topic, message) {
  message = JSON.parse(message);

  if (topic === paths.weather) {
    outsideTemperature = message.temperature;

    // Initialise heatingElements at first message from weather station
    !initialised ? initialise() : undefined;
  }
  if (topic === paths.heating + "/in" && initialised) {
    for (const room in message) {
      for (const property in message[room]) {
        heatingElements[room][property] = message[room][property];
      }
    }
  }
  if (topic === paths.simulationSpeed) {
    simulationSpeed = +message;
    setSimulationVariables();
  }
});

// Main functions
function simulateCycle() {
  // Update heating element on/off state based on mode (auto/manual)
  for (const room in heatingElements) {
    // If heating element has not reached target temperature and its colder outside => turn on
    // Else => turn off
    // But only if heating element is automatic
    if (heatingElements[room].mode) {
      shouldBeOn =
        heatingElements[room].actualTemperature <=
          heatingElements[room].targetTemperature &&
        outsideTemperature < heatingElements[room].targetTemperature;
      shouldBeOn
        ? (heatingElements[room].power = true)
        : (heatingElements[room].power = false);
    }
  }

  // Update temperature based on heating element on/off state and outside temperature
  for (const key in heatingElements) {
    let deltaTemperature = 0;

    if (heatingElements[key].power) {
      deltaTemperature += heatingIncrease;
    }

    let isColderOutside = idealTemperature > outsideTemperature;
    let doesNotExceedOutsideTemperature =
      (heatingElements[key].actualTemperature > outsideTemperature &&
        isColderOutside) ||
      (heatingElements[key].actualTemperature < outsideTemperature &&
        !isColderOutside);
    if (doesNotExceedOutsideTemperature) {
      if (isColderOutside) {
        deltaTemperature -= temperatureDecay;
      } else {
        deltaTemperature += temperatureDecay;
      }
    }
    heatingElements[key].actualTemperature += deltaTemperature;
  }
}

// Setting randomised values for heating element initialization
function initialise() {
  setSimulationVariables();
  // Calculating the maximum possible difference from the ideal temperature;
  let max_range = idealTemperature - outsideTemperature;

  for (const key in heatingElements) {
    initialTemperature =
      outsideTemperature + Math.floor(Math.random() * max_range);
    heatingElements[key].actualTemperature = initialTemperature;
  }

  initialised = true;

  // Publish once and set intervals for publishing and simulation
  setInterval(() => {
    publishData();
    simulateCycle();
  }, simulationInterval);
}

// Helper function
function publishData() {
  mqttClient.publish(paths.heating, JSON.stringify(heatingElements));
}

function subscribe(topic) {
  mqttClient.subscribe(topic, () => {
    console.log("Subscribed on %s", topic);
  });
}

function setSimulationVariables() {
  heatingIncrease =
    ((0.005 * heatingPower) / simulationInterval) * simulationSpeed;
  temperatureDecay = (0.00125 / simulationInterval) * simulationSpeed;
}
