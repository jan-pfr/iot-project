var socket = io("ws://localhost:3000");

$(() => {
    const blinds_topic = "blinds";
    var initialised = false;
  
    socket.on(blinds_topic, (message) => {
      for (const room in message) {
        updateBlindsValues(room, message[room]);
      }
    });
  });

function updateBlindsValues(room, properties) {
    $(`.blinds .${room} .title`).html(room);
    $(`.blinds .${room} .mode`).attr("data-value", properties.mode);
    $(`.blinds .${room} .mode`).html(properties.mode ? "Automatic" : "Manual");
    $(`.blinds .${room} .sldContainer`).value;
  }