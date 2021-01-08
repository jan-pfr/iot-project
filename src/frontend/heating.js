$(() => {
  const heating_topic = "appliances/heating";
  var initialised = false;

  var socket = io("ws://localhost:3000");

  socket.on(heating_topic, (message) => {
    for (const key in message) {
      updateHeatingValues(key, message[key]);
    }

    if (!initialised) {
      for (const room in message) {
        let mode_button = $(`.heating .${room} button.toggle.mode`);
        mode_button.on("click", () => {
          toggleMode(mode_button, room);
        });
      }
      console.log("Initialised with", message);
      initialised = !initialised;
    }
  });

  function updateHeatingValues(room, value) {
    $(`.heating .${room} button.toggle.mode`).html(
      value.isAutomatic ? "Auto" : "Manuell"
    );
    $(`.heating .${room} .title`).html(room);
    $(`.heating .${room} .actual`).html(value.actual_temperature);
  }

  function toggleMode(button, room) {
    let message = {};
    message[room] = {};
    message[room]["isAutomatic"] = !(button.html() == "Auto");
    console.log("Emitting", message);
    socket.emit(heating_topic, message);
  }
});
