"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManger_1 = require("./GameManger");
const game = new GameManger_1.GameManger();
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    game.addUser(ws);
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
    ws.send('something');
});
