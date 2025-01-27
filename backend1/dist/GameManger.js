"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManger = void 0;
const chess_js_1 = require("chess.js");
class GameManger {
    constructor() {
        this.users = [];
        this.pendingUser = [];
        this.games = [];
    }
    addUser(User) {
        this.users.push(User);
        console.log('number of user' + this.users.length);
        this.setUserforgame(User);
    }
    removeUser(User) {
        this.users = this.users.filter(item => item === User);
    }
    setUserforgame(Socket) {
        Socket.onclose = () => { this.removeUser(Socket); };
        Socket.on('message', (data) => {
            console.log(JSON.parse(data.toString()));
            const message = JSON.parse(data.toString());
            if (message.type === 'START_GAME') {
                this.pendingUser.push(Socket);
                console.log(this.pendingUser.length);
                if (this.pendingUser.length === 2) {
                    const game = new Game(this.pendingUser[0], this.pendingUser[1]);
                    console.log('game started');
                    this.games.push(game);
                    this.pendingUser = [];
                }
                else {
                    console.log('wating for another palyer');
                    return;
                }
            }
            if (message.type === 'MOVE') {
                console.log(message);
                this.games.filter(item => item.player1 === Socket || item.player2 === Socket)[0].makeMove(Socket, message.move);
            }
            if (message.type === 'RE_GAME') {
                this.games.filter(item => item.player1 === Socket || item.player2 === Socket)[0].player1.send(JSON.stringify({ type: 'RE_GAME', message: message.message }));
                this.games.filter(item => item.player1 === Socket || item.player2 === Socket)[0].player2.send(JSON.stringify({ type: 'RE_GAME', message: message.message }));
            }
        });
    }
}
exports.GameManger = GameManger;
class Game {
    constructor(a, b) {
        this.player1 = a;
        this.player2 = b;
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({ type: 'START_GAME', payload: { color: 'WHITE' } }));
        this.player2.send(JSON.stringify({ type: 'START_GAME', payload: { color: 'BLACK' } }));
        this.Chess = new chess_js_1.Chess();
    }
    makeMove(player, move) {
        if (this.moves.length % 2 === 0 && player === this.player2) {
            return;
        }
        if (this.moves.length % 2 === 1 && player === this.player1) {
            return;
        }
        try {
            console.log(move);
            this.Chess.move(move);
            if (player === this.player1) {
                this.player2.send(JSON.stringify({ type: 'MOVE', move }));
            }
            else {
                this.player1.send(JSON.stringify({ type: 'MOVE', move }));
            }
        }
        catch (e) {
            this.player1.send(JSON.stringify({ type: 'WARNING', message: 'Sorry wrong move' }));
        }
        if (this.Chess.isDraw()) {
            this.player1.send(JSON.stringify({ type: 'DRAW', message: 'Sorry wrong move' }));
            this.player2.send(JSON.stringify({ type: 'DRAW', message: 'Sorry wrong move' }));
        }
        if (this.Chess.isCheckmate()) {
            this.player1.send(JSON.stringify({ type: 'CHECKMATE', message: 'Sorry wrong move' }));
            this.player2.send(JSON.stringify({ type: 'CHECKMATE', message: 'Sorry wrong move' }));
        }
        if (this.Chess.isGameOver()) {
            this.player1.send(JSON.stringify({ type: 'CHECKMATE', message: 'Sorry wrong move' }));
        }
        this.moves.push(move);
        if (this.Chess.moves.length % 2 === 0) {
            this.player1.emit(JSON.stringify({
                type: 'move',
                payload: move
            }));
        }
        else {
            this.player2.emit(JSON.stringify({
                type: 'move',
                payload: move
            }));
        }
    }
}
