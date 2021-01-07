const socketio = require("socket.io");
const mqtt = require("mqtt");

class MQTTWebSocketBridge {
  mqtt_clientId = "websocket-server";

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
      socket.on("test", (msg) => {
        console.log("message: " + msg);
        // data = JSON.parse(data);
        // const topic = data.topic;
        // const message = data.message;
        // this.publish(topic, message);
      });

      this.emit("server", "Hello, world!");
    });
  }

  setupMQTTClient() {
    let heating_actual_topic = "appliances/heating";
    this.mqtt_client.on("connect", () => {
      this.mqtt_client.subscribe(heating_actual_topic, () => {
        console.log("Subscribed on %s", heating_actual_topic);
      });
    });

    this.mqtt_client.on("message", (topic, message) => {
      message = JSON.parse(message);
      if (topic == heating_actual_topic) {
        this.emit(topic, message);
      }
    });
  }

  publish(topic, message) {
    this.mqtt_client.publish(topic, message);
    console.log("%s : %s", topic, message);
  }

  emit(event, message) {
    this.io.emit(event, message);
  }
}

module.exports = MQTTWebSocketBridge;
