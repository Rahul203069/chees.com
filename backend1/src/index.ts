
import { WebSocket } from "ws";




import { WebSocketServer } from 'ws';
import { GameManger } from "./GameManger";

const game=new GameManger()
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  game.addUser(ws)
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});