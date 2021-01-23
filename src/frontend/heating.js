// import io from "socket.io-client";
var socket = io("ws://localhost:3000");
// import $ from "jquery";
var hasLocationChanged = true;

$(() => {
  const heating_topic = "heating";
  const simulation_speed_topic = "speed";
  const alert_topic = "alert";
  var initialised = false;

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
  socket.on(alert_topic, (message) => {
    alert("Neue Warnung für deinen Standort!" +
        "\n" + "Sender: " + message.sender_name +
        "\n" + "Event: " + message.event +
        "\n" + "Start: " + convertUnixTimestamp(message.start) +
        "\n" + "Ende: " + convertUnixTimestamp(message.end) +
        "\n"+ "Message: " + message.description);
  });
});

function convertUnixTimestamp(unix_timestamp){
  var months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var day = date.getDate();
  var month = months[date.getMonth()];

  return hours + ':' + minutes.substr(-2) + ", " + day + ". " + month;
}

function initToggles(room, topic) {
  $(`.heating .${room} button.toggle`).on("click", (event) => {
    let $toggle = $(event.target);
    let property = $toggle.attr("class").replace("toggle ", "");
    let value = $toggle.attr("data-value") == "true";
    toggle(topic, room, property, value);
  });
}

function initTempChangeButtons(room, topic) {
  $(`.heating .${room} button:not(.toggle)`).on("click", (event) => {
    let $button = $(event.target);
    let target_temperature = +$(`.heating .${room} .target_temperature`).html();
    target_temperature =
      $button.attr("class") == "up"
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
  console.log("Emitting %s", JSON.stringify(message));
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
