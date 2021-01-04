const aedes = require("aedes")();
const mqtt_server = require("net").createServer(aedes.handle);
const mqtt_port = 1885;

mqtt_server.listen(mqtt_port, function () {
  console.log("MQTT Server is running on port ", mqtt_port);
});

//Printing all published messages
aedes.on("publish", function (packet, client) {
  if (client) {
    console.log("%s : %s : %s", client.id, packet.topic, packet.payload);
  }
});

//Printing connects
aedes.on("client", function (client) {
  console.log("%s has connected", client.id);
});

//Printing disconnects
aedes.on("clientDisconnect", function (client) {
  console.log("%s has disconnected", client.id);
});

//Printing errors
// aedes.on("clientError", function (client, err) {
//   console.log("Client error: Client: %s, Message: %s", client.id, err.message);
// });

// aedes.on("connectionError", function (client, err) {
//   console.log(
//     "Connection error: Client: %s, Message: %s",
//     client.id,
//     err.message
//   );
// });
