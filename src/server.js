const express = require('express');
const http = require('http');
const app = express();
//const server = createServer(app);
//defining ports
let port = Number(process.env.PORT);
if (!port)
    port = 3000;
app.listen(port);
app.set('view engine', 'pug');
app.set("views", '../website/views');
app.use("/static", express.static('../website/views/css/weather-icons.min.css'));
app.use("/static", express.static('../website/views/css/stylesheet.css'));
app.get('/', function (req, res) {
    res.render('home')
});
