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
          initToggles(room, blinds_topic);
          sliderChange(room, blinds_topic);
        }
        initialised = !initialised;
      }
    });
      
    });


    function initToggles(room, topic) {
      $(`.heating .${room} button.toggle`).on("click", (event) => {
        let $toggle = $(event.target);
        let value = $toggle.attr("data-value") == "true";
        toggle(topic, room, value);
      });
    }
    
    function toggle(topic, room, value) {
      let message = {};
      message[room] = {};
      message[room]["mode"] = !value;
    
      console.log("Emitting %s", JSON.stringify(message));
      socket.emit(topic, message);
    }


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