$(document).ready(() => {
  // MANDATORY: GET status/weather call
  const url = "http://localhost:3000/status/weather";
  $.ajax({
    url,
    type: "GET",
    success: (weather) => {
      console.log("GET status/weather", weather);
      $("div.temperature").html(weather.temperature);
      $("span.city").html(
        weather.city + ` (${weather.description.toLowerCase()})`
      );

      //Calculating whether current time is daytime or nighttime and setting the corresponding icon class
      var sunrise = weather.sunrise;
      var sunset = weather.sunset;
      var now = Math.floor(new Date().valueOf() / 1000);
      isDay = now > sunrise && now < sunset;
      timeOfDay = isDay ? "day" : "night";
      $("#weather-icon").addClass(`wi wi-owm-${timeOfDay}-${weather.id}`);
    },
  });
  // End GET status/weather

  // Updating appliances/heating/status
  const url2 = "http://localhost:3000/appliances/status";

  var socket = io("ws://localhost:3000");
  socket.emit("test", "Hello, World!");

  socket.on("appliances/heating", function (data) {
    for (const key in data) {
      updateHeatingValues(key, data[key]);
    }
  });

  // WebSocket Connection
  // webSocketURL = "ws://localhost:1333";
  // webSocket = new WebSocket(webSocketURL);
  // webSocket.onopen = function (openEvent) {
  //   console.log("WebSocket opened");
  // };
  // webSocket.onclose = function (closeEvent) {};
  // webSocket.onerror = function (errorEvent) {
  //   console.log("WebSocket ERROR: " + JSON.stringify(errorEvent, null, 4));
  // };
  // webSocket.onmessage = function (messageEvent) {
  //   var wsMsg = messageEvent.data;
  //   // console.log("WebSocket MESSAGE: " + wsMsg);
  //   console.log("Message");
  //   if (wsMsg.indexOf("error") > 0) {
  //     document.getElementById("incomingMsgOutput").value +=
  //       "error: " + wsMsg.error + "\r\n";
  //   } else {
  //     document.getElementById("incomingMsgOutput").value +=
  //       "message: " + wsMsg + "\r\n";
  //   }
  // };
  // bath_target = $("#tempBath");
  // $("#btnUpBath").click(() => {
  //   // $("#tempBath").html($("#tempBath").html + 1);
  //   data = {
  //     topic: "appliances/heating/bathroom",
  //     message: "Hello, World",
  //   };
  //   webSocket.send(JSON.stringify(data));
  // });
});

function updateHeatingValues(room, value) {
  $(`.heating .${room} .title`).html(room);
  $(`.heating .${room} .actual`).html(value);
}

//Function uhr() initiates Date() in a variable and extracts hours and minutes in two more variables that are set into label uhr.
function uhr() {
  var jetzt = new Date();
  var stunden = jetzt.getHours();
  var minuten = jetzt.getMinutes();
  document.getElementById("uhr").innerHTML = stunden + ":" + minuten + " Uhr";
  setTimeout(uhr, 500);
}

//Interval starts function sliderValue() ever 50ms. sliderValue() writes the current value of the blind sliders into labels.
setInterval(function () {
  sliderValue();
}, 50);

function sliderValue() {
  document.getElementById("lbl0").innerHTML = document.getElementById(
    "slider0"
  ).value;
  document.getElementById("lbl1").innerHTML = document.getElementById(
    "slider1"
  ).value;
  document.getElementById("lbl2").innerHTML = document.getElementById(
    "slider2"
  ).value;
  document.getElementById("lbl3").innerHTML = document.getElementById(
    "slider3"
  ).value;
}

function heaterTemperature() {
  //Default variables for temperature
  var tempCh = 25;
  var tempBath = 25;
  var tempKitchen = 25;
  var tempBedroom = 25;
  var tempLiving = 25;
  //Temperature Central Heating//////////////////////////////////////////////////////////////////
  document.getElementById("tempH").innerHTML = tempCh + "°C";
  document.getElementById("btnUpH").addEventListener("click", function () {
    tempCh = tempCh + 1;
    document.getElementById("tempH").innerHTML = tempCh + "°C";
  });
  document.getElementById("btnDownH").addEventListener("click", function () {
    tempCh = tempCh - 1;
    document.getElementById("tempH").innerHTML = tempCh + "°C";
  });
  //Temperature Bathroom/////////////////////////////////////////////////////////////////////////
  document.getElementById("tempBath").innerHTML = tempBath + "°C";
  document.getElementById("btnUpBath").addEventListener("click", function () {
    tempBath = tempBath + 1;
    document.getElementById("tempBath").innerHTML = tempBath + "°C";
  });
  document.getElementById("btnDownBath").addEventListener("click", function () {
    tempBath = tempBath - 1;
    document.getElementById("tempBath").innerHTML = tempBath + "°C";
  });
  //Temperature Kitchen//////////////////////////////////////////////////////////////////////////
  document.getElementById("tempKitchen").innerHTML = tempKitchen + "°C";
  document
    .getElementById("btnUpKitchen")
    .addEventListener("click", function () {
      tempKitchen = tempKitchen + 1;
      document.getElementById("tempKitchen").innerHTML = tempKitchen + "°C";
    });
  document
    .getElementById("btnDownKitchen")
    .addEventListener("click", function () {
      tempKitchen = tempKitchen - 1;
      document.getElementById("tempKitchen").innerHTML = tempKitchen + "°C";
    });
  //Temperature Bedroom//////////////////////////////////////////////////////////////////////////
  document.getElementById("tempBed").innerHTML = tempBedroom + "°C";
  document.getElementById("btnUpBed").addEventListener("click", function () {
    tempBedroom = tempBedroom + 1;
    document.getElementById("tempBed").innerHTML = tempBedroom + "°C";
  });
  document.getElementById("btnDownBed").addEventListener("click", function () {
    tempBedroom = tempBedroom - 1;
    document.getElementById("tempBed").innerHTML = tempBedroom + "°C";
  });
  //Temperature Livingroom//////////////////////////////////////////////////////////////////////
  document.getElementById("tempLiv").innerHTML = tempLiving + "°C";
  document.getElementById("btnUpLiv").addEventListener("click", function () {
    tempLiving = tempLiving + 1;
    document.getElementById("tempLiv").innerHTML = tempLiving + "°C";
  });
  document.getElementById("btnDownLiv").addEventListener("click", function () {
    tempLiving = tempLiving - 1;
    document.getElementById("tempLiv").innerHTML = tempLiving + "°C";
  });
}
