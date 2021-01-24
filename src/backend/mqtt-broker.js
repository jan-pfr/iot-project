const aedes = require("aedes");
const net = require("net");

class MQTTBrokerWrapper {
  constructor(cache, port) {
    this.cache = cache;
    this.mqttPort = port;
    this.aedes = aedes();
    this.server = net.createServer(this.aedes.handle);

    this.server.listen(this.mqttPort, () => {
      console.log("MQTT Server is running on port ", this.mqttPort);
    });

    // Printing all published messages
    this.aedes.on("publish", (packet, client) => {
      if (client) {
        this.cache[packet.topic] = JSON.parse(packet.payload);
      }
    });

    // Printing (dis-)connects
    this.on("client");
    this.on("clientDisconnect");
  }

  on(topic) {
    this.aedes.on(topic, (client) => {
      console.log("%s : %s", client.id, topic);
    });
  }
}

module.exports = MQTTBrokerWrapper;
