const express = require("express");
const http = require("http");

class HTTPServerWrapper {
  port = 3000;
  weather_topic = "local/temperature";

  constructor(cache) {
    this.cache = cache;
    this.app = express();
    this.router = express.Router();

    this.router.get("/status/all", (req, res) => {
      res.status(200).send(cache);
    });

    this.router.get("/status/:device/", (req, res) => {
      var device = req.params.device;

      if (device == "weather") {
        if (this.isSet(this.weather_topic)) {
          res.status(200).send(cache[this.weather_topic]);
        } else {
          this.send404(res);
        }
      }
    });

    // Setting CORS headers
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      next();
    });

    this.app.use(this.router);

    this.server = http.createServer(this.app);

    this.server.listen(this.port);
  }

  isSet(of) {
    for (const [device, value] of Object.entries(this.cache)) {
      if (device == of) {
        return value != null;
      }
    }
  }

  send404(res) {
    return res.status(404).json();
  }
}

module.exports = HTTPServerWrapper;
