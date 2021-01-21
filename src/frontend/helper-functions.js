$(() => {
  setInterval(uhr, 500);
});

function uhr() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  hours = firstZero(hours);
  minutes = firstZero(minutes);
  document.getElementById("uhr").innerHTML = hours + ":" + minutes + " Uhr";
}
function firstZero(num) {
  num = (num < 10 ? '0' : '' )+ num;
  return num;
}

setInterval(() => {
  document.getElementById('valBathroom').value = document.getElementById('sldBathroom').value;
  document.getElementById('valKitchen').value = document.getElementById('sldKitchen').value;
  document.getElementById('valBedroom').value = document.getElementById('sldBedroom').value;
  document.getElementById('valLivingroom').value = document.getElementById('sldLivingroom').value;
}, 100); 


