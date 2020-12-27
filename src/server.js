const express = require('express');
const http = require('http');
const app = express();
//const server = createServer(app);
//defining ports
let port = Number(process.env.PORT);
if (!port)
    port = 3000;
app.listen(port);