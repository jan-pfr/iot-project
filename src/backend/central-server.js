const HTTPServerWrapper = require("./http-server");
const MQTTServerWrapper = require("./mqtt-server");
const MQTTWebSocketBridge = require("./mqtt-websocket-bridge");

var cache = {};
const mqtt = new MQTTServerWrapper(cache);

const http = new HTTPServerWrapper(cache);

const wss = new MQTTWebSocketBridge(cache, http.server);

// setInterval(() => {
//   console.log(JSON.stringify(cache));
// }, 2000);
