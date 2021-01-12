const aedes = require("aedes");
const net = require("net");

class MQTTServerWrapper {
  mqtt_port = 1885;

  constructor(cache) {
    this.cache = cache;
    this.aedes = aedes();
    this.server = net.createServer(this.aedes.handle);

    this.server.listen(this.mqtt_port, () => {
      console.log("MQTT Server is running on port ", this.mqtt_port);
    });

    //Printing all published messages
    this.aedes.on("publish", (packet, client) => {
      if (client) {
        // console.log("%s : %s : %s", client.id, packet.topic, packet.payload);
        this.cache[packet.topic] = JSON.parse(packet.payload);
      }
    });

    //Printing connects
    this.aedes.on("client", (client) => {
      console.log("%s has connected", client.id);
    });

    //Printing disconnects
    this.aedes.on("clientDisconnect", (client) => {
      console.log("%s has disconnected", client.id);
    });
  }
}

module.exports = MQTTServerWrapper;
