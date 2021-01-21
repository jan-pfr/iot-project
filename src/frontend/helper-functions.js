$(() => {
  setInterval(uhr, 500);
});

function uhr() {
  var jetzt = new Date();
  var stunden = jetzt.getHours();
  var minuten = jetzt.getMinutes();
  document.getElementById("uhr").innerHTML = stunden + ":" + minuten + " Uhr";
}

setInterval(() => {
  document.getElementById('valBathroom').value = document.getElementById('sldBathroom').value;
  document.getElementById('valKitchen').value = document.getElementById('sldKitchen').value;
  document.getElementById('valBedroom').value = document.getElementById('sldBedroom').value;
  document.getElementById('valLivingroom').value = document.getElementById('sldLivingroom').value;
}, 100); 


