const express = require("express");
const http = require("http");
const paths = require("./../config.json").paths;

class HTTPServerWrapper {
  constructor(cache, port) {
    this.cache = cache;
    this.port = port;
    this.app = express();

    // Setting up the router and paths
    this.router = express.Router();

    //http routes
    this.router.get("/status/all", (req, res) => {
      res.status(200).send(cache);
    });

    this.router.get("/status/:device/", (req, res) => {
      var device = req.params.device;

      if (device === paths.weather) {
        if (this.isSet(paths.weather)) {
          res.status(200).send(cache[paths.weather]);
        } else {
          this.send404(res);
        }
      }
      if (device === paths.blinds) {
        if (this.isSet(paths.blinds)) {
          res.status(200).send(cache[paths.blinds]);
        } else {
          this.send404(res);
        }
      }
      if (device === paths.heating) {
        if (this.isSet(paths.heating)) {
          res.status(200).send(cache[paths.heating]);
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

  // Helper functions
  // isSet checks whether cache has been initialized with the requested resource
  isSet(of) {
    for (const [device, value] of Object.entries(this.cache)) {
      if (device === of) {
        return value != null;
      }
    }
  }

  // send404 returns a HTTP 404 Not Found error
  send404(res) {
    return res.status(404).json();
  }
}
module.exports = HTTPServerWrapper;
