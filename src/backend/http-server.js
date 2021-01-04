const http = require('http');
const express = require('express');

const app = express();
const router = express.Router();

roomTemperatures = {
    1: '22C',
    2: '17C',
    3: '25C',
}

router.get('/gettemperature/:id', (req, res) => {
    id = req.params.id;

    if (roomExists(id)) {
        res.status(200).json({
            RoomId: id,
            Temperature: roomTemperatures[id]
        })
    } else {
        return404(res);
    }
});

router.get('/settemperature/:id/:degrees', (req, res) => {
    id = req.params.id;
    degrees = req.params.degrees;

    if (roomExists(id)) {
        oldTemperature = roomTemperatures[id];

        roomTemperatures[id] = degrees;

        res.status(200).json({
            RoomId: id,
            'Old temperature': oldTemperature,
            'New temperature': degrees 
        })
    } else {
        return404();
    }
});

app.use(router);

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

function roomExists(roomId) {
    return Object.keys(roomTemperatures).indexOf(String(roomId)) > -1;
}

function return404(res) {
    return res.status(404).json({
        message: "Room does not exist"
    });
}