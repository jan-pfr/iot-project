const socketio = require("socket.io");
const mqtt = require("mqtt");

class MQTTWebSocketBridge {
  mqtt_clientId = "websocket-server";
  heating_topic = "appliances/heating";
  heating_inbound = this.heating_topic + "/inbound";
  heating_outbound = this.heating_topic + "/outbound";

  constructor(cache, http_server) {
    this.cache = cache;
    this.mqtt_client = mqtt.connect("mqtt://localhost:1885", {
      clientId: this.mqtt_clientId,
    });
    this.io = socketio(http_server);
    this.setupWebSocketServer();
    this.setupMQTTClient();
  }

  setupWebSocketServer() {
    this.io.on("connection", (socket) => {
      console.log("WebSocket client connected");
      socket.on(this.heating_inbound, (message) => {
        console.log("Received WS: ", message);
        this.mqtt_client.publish(this.heating_inbound, JSON.stringify(message));
      });
    });
  }

  setupMQTTClient() {
    this.mqtt_client.on("connect", () => {
      this.mqtt_client.subscribe(this.heating_outbound, () => {
        console.log("Subscribed on %s", this.heating_topic);
      });
    });

    this.mqtt_client.on("message", (topic, message) => {
      message = JSON.parse(message);
      this.io.emit(topic, message);
    });
  }
}

module.exports = MQTTWebSocketBridge;
