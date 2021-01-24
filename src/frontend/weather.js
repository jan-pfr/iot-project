$(() => {
  const url = "http://localhost:3000/status/weather";
  $.ajax({
    url,
    type: "GET",
    success: (weather) => {
      $("div.temperature").html(weather.temperature);
      $(".location").html(
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
});
