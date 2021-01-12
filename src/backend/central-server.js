const HTTPServerWrapper = require("./http-server");
const MQTTServerWrapper = require("./mqtt-broker");
const MQTTWebSocketBridge = require("./mqtt-websocket-bridge");
const config = require("./../config.json");

var cache = {};

const http = new HTTPServerWrapper(cache, config.http_port);

new MQTTServerWrapper(cache, config.mqtt_port);

new MQTTWebSocketBridge(http.server);
