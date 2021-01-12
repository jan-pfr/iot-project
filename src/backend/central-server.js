const HTTPServerWrapper = require("./http-server");
const MQTTServerWrapper = require("./mqtt-server");
const MQTTWebSocketBridge = require("./mqtt-websocket-bridge");

const httpPort = 3000;
const mqttPort = 1885;

var cache = {};

const http = new HTTPServerWrapper(cache, httpPort);

new MQTTServerWrapper(cache, mqttPort);

new MQTTWebSocketBridge(cache, http.server);
