const aedes = require("aedes");
const net = require("net");

class MQTTServerWrapper {
  constructor(cache, port) {
    this.cache = cache;
    this.mqtt_port = port;
    this.aedes = aedes();
    this.server = net.createServer(this.aedes.handle);

    this.server.listen(this.mqtt_port, () => {
      console.log("MQTT Server is running on port ", this.mqtt_port);
    });

    // Printing all published messages
    this.aedes.on("publish", (packet, client) => {
      if (client) {
        this.cache[packet.topic] = JSON.parse(packet.payload);
      }
    });

    // Printing (dis-)connects
    this.subscribe("client");
    this.subscribe("clientDisconnect");
  }

  subscribe(topic) {
    this.aedes.on(topic, (client) => {
      console.log("%s : %s", client.id, topic);
    });
  }
}

module.exports = MQTTServerWrapper;
