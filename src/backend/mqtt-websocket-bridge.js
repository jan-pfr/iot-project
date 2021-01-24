const socketio = require("socket.io");
const mqtt = require("mqtt");
const config = require("./../config.json");
const paths = config.paths;

class MQTTWebSocketBridge {
  constructor(http_server) {
    this.mqtt_client = mqtt.connect(`mqtt://localhost:${config.mqtt_port}`, {
      clientId: "websocket-server",
    });
    this.io = socketio(http_server);
    this.setupWebSocketServer();
    this.setupMQTTClient();
  }

  setupWebSocketServer() {
    this.io.on("connection", (socket) => {
      console.log("WebSocket client connected");
      socket.on(paths.heating, (message) => {
        var message = JSON.stringify(message);
        this.mqtt_client.publish(paths.heating + "/in", message);
      });
      socket.on(paths.simulation_speed, (message) => {
        var message = message.toString();
        this.mqtt_client.publish(paths.simulation_speed, message);
      });
    });
  }

  setupMQTTClient() {
    this.mqtt_client.on("connect", () => {
      this.mqtt_client.subscribe(paths.heating, () => {
        console.log("Subscribed on %s", paths.heating);
      });
      this.mqtt_client.subscribe(paths.alert, () => {
        console.log("Subscribed on %s", paths.alert);
      });
      this.mqtt_client.subscribe(paths.blinds, () => {
        console.log("Subscribed on %s", paths.blinds);
      });
    });

    this.mqtt_client.on("message", (topic, message) => {
      var message = JSON.parse(message);
      this.io.emit(topic, message);
    });
  }
}

module.exports = MQTTWebSocketBridge;
