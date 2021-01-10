const HTTPServerWrapper = require("./http-server");
const MQTTServerWrapper = require("./mqtt-server");
const MQTTWebSocketBridge = require("./mqtt-websocket-bridge");

var cache = {};
new MQTTServerWrapper(cache);

const http = new HTTPServerWrapper(cache);

new MQTTWebSocketBridge(cache, http.server);
