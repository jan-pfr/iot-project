const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1885

server.listen(port, function () {
    console.log('up and running', port)
})

