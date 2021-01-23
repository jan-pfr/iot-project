var socket = io("ws://localhost:3000");



$(() => {
    const blinds_topic = "blinds";
    var initialised = false;
  
    socket.on(blinds_topic, (message) => {
      for (const room in message) {
        updateBlindsValues(room, message[room]);
      }
      if (!initialised) {
        for (const room in message) {
          sliderChange(room, blinds_topic);
        }
        initialised = !initialised;
      }
    });
      
    });


function sliderChange(room, topic){

  var target = $(`.blinds .${room} .target`).html(properties.sldContainer.value)
  
changeTargetTemperature(
  topic,
  room,
  "target",
  target
);

}




function changeBlinds(topic, room, property, value) {
  let message = {};
  message[room] = {};
  message[room][property] = value;
  socket.emit(topic, message);
}

function updateblindsValues(room, properties) {
    $(`.blinds .${room} .title`).html(room);
    $(`.blinds .${room} .mode`).attr("data-value", properties.mode);
    $(`.blinds .${room} .mode`).html(properties.mode ? "Automatic" : "Manual");
    $(`.blinds .${room} .target`).html(properties.sldContainer.value)
   
  }