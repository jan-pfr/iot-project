// import io from "socket.io-client";
var socket = io("ws://localhost:3000");
// import $ from "jquery";

$(() => {
  const heating_topic = "heating";
  const simulation_speed_topic = "speed";
  const alert_topic = "alert";
  const blinds_topic = "blinds";
  var currentEvent = undefined;
  var initialised = false;
  var initialisedBlinds = false;

//Listeners for information from the backend
  socket.on(heating_topic, (message) => {
    for (const room in message) {
      updateHeatingValues(room, message[room]);
    }
    if (!initialised) {
      for (const room in message) {
        initToggles(room, heating_topic);
        initTempChangeButtons(room, heating_topic);
      }
      initSpeedButtons(simulation_speed_topic);
      initialised = !initialised;
    }
  });

  socket.on(blinds_topic, (message) => {
    for (const room in message) {
      updateBlindsValues(room, message[room]);

    }
    if (!initialisedBlinds) {
      for (const room in message) {
        initToggleBlinds(room, blinds_topic);
        initBlindsChangeSlider(room, blinds_topic);
      }
      initialisedBlinds = !initialisedBlinds;
    }
  });
  socket.on(alert_topic, (message) => {
    if(currentEvent === message.event){
      hasEventChanged = false;
    } else {
      hasEventChanged = true;
      hasAlertBeenShown = false;
    }
    if(hasEventChanged || !hasAlertBeenShown){
      currentEvent = message.event;
      $(`.alert-content .event`).html(message.event);
      $(`.alert-content .sender`).html(message.sender_name);
      $(`.alert-content .period`).html(convertUnixTimestamp(message.start) +" - "+convertUnixTimestamp(message.end));
      $(`.alert-content .description`).html(message.description);
      $(".alert-content").addClass("active");
      $(".close").on("click", function() {
        $(".alert-content").removeClass("active");
      });
      hasAlertBeenShown = true;
    }
  });
});

function convertUnixTimestamp(unix_timestamp){
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Dezember"];
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var day = date.getDate();
  var month = months[date.getMonth()];

  return hours + ':' + minutes + ", " + day + ". " + month;
}

//Initialising the Buttons
function initToggles(room, topic) {
  $(`.heating .${room} button.toggle`).on("click", (event) => {
    let $toggle = $(event.target);
    let property = $toggle.attr("class").replace("toggle button ", "");
    let value = $toggle.attr("data-value") === "true";
    toggleHeating(topic, room, property, value);
  });
}

function initTempChangeButtons(room, topic) {
  $(`.heating .${room} button:not(.toggle)`).on("click", (event) => {
    let $button = $(event.target);
    let target_temperature = +$(`.heating .${room} .target_temperature`).html();
    target_temperature =
      $button.attr("class") === "button up"
        ? target_temperature + 1
        : target_temperature - 1;
    changeTargetTemperature(
      topic,
      room,
      "target_temperature",
      target_temperature
    );
  });
}

function initToggleBlinds(room, topic) {
  $(`.blinds .${room} button.toggle`).on("click", (event) => {
    let $toggle = $(event.target);
    let value = $toggle.attr("data-value") === "true";
    toggleBlinds(topic, room, value);
  });
}

function initBlindsChangeSlider(room, topic) {
  $(`.blinds .${room} .sld`).on('change', function () {

    let target = $(this).val();
    changeBlinds(
        topic,
        room,
        "target",
        target
    );
  });
}

//functionalities of all buttons
function toggleHeating(topic, room, property, value) {
  let message = {};
  message[room] = {};
  message[room][property] = !value;
  if (property === "power") {
    message[room]["mode"] = false;
  }
  console.log("Emitting %s", JSON.stringify(message));
  socket.emit(topic, message);
}

function changeTargetTemperature(topic, room, property, value) {
  let message = {};
  message[room] = {};
  message[room][property] = value;
  socket.emit(topic, message);
}
function toggleBlinds(topic, room, value) {
  let message = {};
  message[room] = {};
  message[room]["mode"] = !value;
  console.log("Emitting %s", JSON.stringify(message));
  socket.emit(topic, message);
}

function changeBlinds(topic, room, property, value) {
  let message = {};
  message[room] = {};
  message[room][property] = value;
  socket.emit(topic, message);
}

//Updating all values of the frontend
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

function updateBlindsValues(room, properties) {
  $(`.blinds .${room} .title`).html(room);
  $(`.blinds .${room} .mode`).attr("data-value", properties.mode);
  $(`.blinds .${room} .mode`).html(properties.mode ? "Automatic" : "Manual");
  $(`.blinds .${room} .sld`).attr("value", properties.target);
  $(`.blinds .${room} .val`).html(properties.target);
  $(`.blinds .${room} .soll`).html("current " + Math.round(properties.status)+ " %");

}

//Init Buttons for manipulating the speed from the heating
function initSpeedButtons(topic) {
  $(`button.speed`).on("click", (event) => {
    let $button = $(event.target);
    $button.addClass("active");
    $button.siblings().removeClass("active");
    let value = $button.data("value");
    socket.emit(topic, value);
  });
}
