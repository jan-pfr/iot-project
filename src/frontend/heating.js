// import io from "socket.io-client";
var socket = io("ws://localhost:3000");
// import $ from "jquery";

$(() => {
  const heating_topic = "appliances/heating";
  const heating_inbound = heating_topic + "/inbound";
  const heating_outbound = heating_topic + "/outbound";
  const simulation_speed_topic = "speed";
  var initialised = false;

  socket.on(heating_outbound, (message) => {
    for (const room in message) {
      updateHeatingValues(room, message[room]);
    }

    if (!initialised) {
      for (const room in message) {
        initToggles(room, heating_inbound);
        initTempChangeButtons(room, heating_inbound);
      }
      initSpeedButtons(simulation_speed_topic);
      initialised = !initialised;
    }
  });
});

function initToggles(room, heating_topic) {
  $(`.heating .${room} button.toggle`).on("click", (event) => {
    let $toggle = $(event.target);
    let property = $toggle.attr("class").replace("toggle ", "");
    let value = $toggle.attr("data-value") == "true";
    toggle(heating_topic, room, property, value);
  });
}

function initTempChangeButtons(room, heating_topic) {
  $(`.heating .${room} button:not(.toggle)`).on("click", (event) => {
    let $button = $(event.target);
    let target_temperature = +$(`.heating .${room} .target_temperature`).html();
    target_temperature =
      $button.attr("class") == "up"
        ? target_temperature + 1
        : target_temperature - 1;
    changeTargetTemperature(
      heating_topic,
      room,
      "target_temperature",
      target_temperature
    );
  });
}

function initSpeedButtons(topic) {
  $(`button.speed`).on("click", (event) => {
    let $button = $(event.target);
    $button.addClass("active");
    $button.siblings().removeClass("active");
    let value = $button.data("value");
    socket.emit(topic, value);
  });
}

function toggle(topic, room, property, value) {
  let message = {};
  message[room] = {};
  message[room][property] = !value;
  if (property == "power") {
    message[room]["mode"] = false;
  }

  socket.emit(topic, message);
}

function changeTargetTemperature(topic, room, property, value) {
  let message = {};
  message[room] = {};
  message[room][property] = value;
  socket.emit(topic, message);
}

function updateHeatingValues(room, properties) {
  $(`.heating .${room} .title`).html(room);
  $(`.heating .${room} .mode`).attr("data-value", properties.mode);
  $(`.heating .${room} .mode`).html(properties.mode ? "Automatic" : "Manual");
  $(`.heating .${room} .power`).attr("data-value", properties.power);
  $(`.heating .${room} .power`).html(properties.power ? "On" : "Off");
  $(`.heating .${room} .actual_temperature`).html(
    properties.actual_temperature.toFixed(2)
  );
  $(`.heating .${room} .target_temperature`).html(
    properties.target_temperature
  );
}
