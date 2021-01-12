$(() => {
  setInterval(uhr, 500);
});

function uhr() {
  var jetzt = new Date();
  var stunden = jetzt.getHours();
  var minuten = jetzt.getMinutes();
  document.getElementById("uhr").innerHTML = stunden + ":" + minuten + " Uhr";
}
