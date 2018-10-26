'use strict';
const mosca = require('mosca');
var mqtt = require('mqtt')
var io = require('socket.io')(30);

const moscaSettings = {
    port: 1883,
    host: 'localhost'
}

const server = new mosca.Server(moscaSettings); //here we start mosca
server.on('ready', setup); //on init it fires up setup()
server.on('clientConnected', () => {
    console.log('new client connected');
})

server.on('clientDisconnected', () => {
    console.log('new client disconnected');
})

// fired when a message is received
server.on('published', function (packet, client) {
    console.log('Je dois publier les nouveauté aux clients!');
    
});

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}