$(document).ready(() => {
  var socket = io("ws://localhost:3000");

  socket.on("appliances/heating", function (data) {
    for (const key in data) {
      updateHeatingValues(key, data[key]);
    }
  });
});

function updateHeatingValues(room, value) {
  $(`.heating .${room} .title`).html(room);
  $(`.heating .${room} .actual`).html(value);
}
