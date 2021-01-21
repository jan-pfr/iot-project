const mqtt = require("mqtt");

const client_options = {
  clientId: "rollerblind-system",
};
const mqtt_client = mqtt.connect("mqtt://localhost:1885", client_options);
let initialised = false;


const weather_topic = "local/temperature";
const blinds_topic = "appliances/blinds";
const blinds_inbound = blinds_topic + "/inbound";
const blinds_outbound = blinds_topic + "/outbound";
var hours = date.getHours();
const bedTime = 22;
const wakeUp = 7;
const isAutomatic = true;
const hot_temperature = 23;

var roller_blinds = {
    bathroom: {
      status: 0.0,
      power: false,
      mode: isAutomatic,
    },
    kitchen: {
      status: 0.0,
      power: false,
      mode: isAutomatic,
    },
    bedroom: {
      status: 0.0,
      power: false,
      mode: isAutomatic,
    },
    livingroom: {
      status: 0.0,
      power: false,
      mode: isAutomatic,
    },
  };

  mqtt_client.on("connect", () => {
    mqtt_client.subscribe(weather_topic, () => {
      console.log("Subscribed on %s", weather_topic);
    });
    mqtt_client.subscribe(blinds_inbound, () => {
      console.log("Subscribed on %s", blinds_inbound);
    });
  });
 
 
  for (const key in roller_blinds) {
    
    if(roller_blinds[key].mode=isAutomatic)
{
    let isHotOutside = hot_temperature < outside_temperature;
   
    if (isHotOutside) {
      roller_blinds[key].status = 1.0;
      
      }
    
  
  let isDarkOutside = bedTime = hours ;
  let isntDarkOutside = wakeUp = hours;
  if(isDarkOutside){
    roller_blinds[key].status = 1.0;
  }
  if(isntDarkOutside){
    roller_blinds[key].status = 0.0;
  }
  }
}

