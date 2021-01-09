$(document).ready(() => {
  // MANDATORY: GET status/weather call
  setWeather();
  // End GET status/weather

  // Updating appliances/heating/status
});

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
