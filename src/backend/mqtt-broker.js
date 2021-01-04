const aedes = require("aedes")();
const mqtt_server = require("net").createServer(aedes.handle);
const mqtt_port = 1885;

mqtt_server.listen(mqtt_port, () => {
  console.log("MQTT Server is running on port ", mqtt_port);
});

//Printing all published messages
aedes.on("publish", (packet, client) => {
  if (client) {
    console.log("%s : %s : %s", client.id, packet.topic, packet.payload);
  }
});

// aedes.on("subscribe", (subscriptions, client) => {
//   console.log(subscriptions);
// });

//Printing connects
aedes.on("client", (client) => {
  console.log("%s has connected", client.id);
});

//Printing disconnects
aedes.on("clientDisconnect", (client) => {
  console.log("%s has disconnected", client.id);
});
