import { WebSocket } from "ws";

import { Chess } from 'chess.js'
import { Socket } from "dgram";




export class GameManger{

    

    private games:Game[]
private users:WebSocket[]
    private pendingUser: WebSocket[];

constructor(){

 this.users=[]
 this.pendingUser=[]
this.games=[]

}

    
    addUser(User:WebSocket){

   this.users.push(User);
 
  console.log('number of user'+this.users.length)
this.setUserforgame(User);



    }

    removeUser(User:WebSocket){

this.users=this.users.filter(item=>item===User)

    }


    private setUserforgame(Socket:WebSocket){

        Socket.onclose=()=>{this.removeUser(Socket)}
        Socket.on('message', (data:string)=>{
            console.log(JSON.parse(data.toString()))
            const message = JSON.parse(data.toString());
    if(message.type==='START_GAME'){
        this.pendingUser.push(Socket)
       console.log(this.pendingUser.length)
        if(this.pendingUser.length===2){

          const game=  new Game(this.pendingUser[0],this.pendingUser[1])
          console.log('game started')
          this.games.push(game)
          this.pendingUser=[]
        }

        else{
console.log('wating for another palyer')
           return
        }
          }
        
        if(message.type==='MOVE'){

            console.log(message)
         this.games.filter(item=>item.player1===Socket||item.player2===Socket)[0].makeMove(Socket,message.move)
      

        }
        
if(message.type==='RE_GAME'){
    this.games.filter(item=>item.player1===Socket||item.player2===Socket)[0].player1.send(JSON.stringify({type:'RE_GAME',message:message.message})) 
    this.games.filter(item=>item.player1===Socket||item.player2===Socket)[0].player2.send(JSON.stringify({type:'RE_GAME',message:message.message})) 
    


 }

        


        
        });




    }



}


interface Moves {
    from:string,
    to:string
}

class Game{

    
public player1:WebSocket
public player2:WebSocket
private Chess:any
public moves:Moves[]
public startTime:Date
constructor(a:WebSocket,b:WebSocket){
this.player1=a
this.player2=b
this.moves=[]
this.startTime=new Date()
this.player1.send(JSON.stringify({type:'START_GAME',payload:{color:'WHITE'}}))
this.player2.send(JSON.stringify({type:'START_GAME',payload:{color:'BLACK'}}))
this.Chess=new Chess()
}

makeMove(player:WebSocket,move:{from:string,to:string}){

if(this.moves.length%2===0&&player===this.player2){
    return
}

if(this.moves.length%2===1&&player===this.player1){
    return
}


try{

    console.log(move);
    this.Chess.move(move);
    if(player===this.player1){
        this.player2.send(JSON.stringify({type:'MOVE',move}))
        
    }else{
        this.player1.send(JSON.stringify({type:'MOVE',move}))

    }
}catch(e){ 
    this.player1.send(JSON.stringify({type:'WARNING',message:'Sorry wrong move'}))
}

if(this.Chess.isDraw()){
    this.player1.send(JSON.stringify({type:'DRAW',message:'Sorry wrong move'}))
    this.player2.send(JSON.stringify({type:'DRAW',message:'Sorry wrong move'}))
    
}

if(this.Chess.isCheckmate()){
     this.player1.send(JSON.stringify({type:'CHECKMATE',message:'Sorry wrong move'}))
     this.player2.send(JSON.stringify({type:'CHECKMATE',message:'Sorry wrong move'}))
    
 }

 if(this.Chess.isGameOver()){
    this.player1.send(JSON.stringify({type:'CHECKMATE',message:'Sorry wrong move'})) 
 }

    this.moves.push(move);


    if(this.Chess.moves.length%2===0){
        this.player1.emit(JSON.stringify({
            type:'move',
            payload:move
        }))
      }else{
        this.player2.emit(JSON.stringify({
            type:'move',
            payload:move
        }))
      }



}


}