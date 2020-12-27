const fs = require('fs');

fs.readFile('../config/weather.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("updateWeather readFile failed:", err)
        return
    }
    try {
        const weatherData = JSON.parse(jsonString)
        console.log("weatherID", weatherData.weatherID)
    } catch(err) {
        console.log('Error parsing JSON string:', err)
    }
})